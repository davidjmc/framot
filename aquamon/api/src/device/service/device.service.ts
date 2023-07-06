import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { Repository } from 'typeorm';
import { MqttService } from '../../mqtt/mqtt.service';
import { CreateUpdateDeviceDTO } from '../controller/device.controller';
import { DeviceHistory } from '../entity/device-history.entity';
import { Device } from '../entity/device.entity';
import { DeviceHistoryService } from './device-history.service';

interface AggregatedDeviceHistory {
  date: string;
  volume: number;
  battery: number;
}

interface DeviceWithAggregatedHistory extends Device {
  aggregatedHistory: AggregatedDeviceHistory[];
}

// Função auxiliar para formatar a data no formato 'DD/MM/YY'
function formatDate(dateString: string): string {
  const date = DateTime.fromISO(dateString);
  return date.toFormat('dd/LL/yy');
}

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
    private readonly mqttService: MqttService,
    private readonly deviceHistoryService: DeviceHistoryService,
  ) {
    // TODO - Subscribe to MQTT topic of each one devices
    this.findAll().then((res) =>
      res.forEach((device) => {
        this.subscribe(device);
      }),
    );
  }

  async create(dto: CreateUpdateDeviceDTO): Promise<Device> {
    await this.verifyMac(dto.mac);

    const newDevice = await this.deviceRepository.save({ ...dto });

    this.subscribe(newDevice);

    return newDevice;
  }

  async update(dto: CreateUpdateDeviceDTO, id: string) {
    const oldDevice = await this.deviceRepository.findOneOrFail({
      where: { id },
    });

    if (oldDevice.mac !== dto.mac) {
      await this.verifyMac(dto.mac);
      await this.deviceRepository.update(id, dto);
      const updateddevice = await this.findOne(id);
      this.unsubscribe(oldDevice);
      this.subscribe(updateddevice);
    } else {
      await this.deviceRepository.update(id, dto);
    }
  }

  async delete(id: string): Promise<void> {
    const device = await this.deviceRepository.findOneOrFail({
      where: { id },
    });

    await this.deviceRepository.delete(id);

    this.unsubscribe(device);
  }

  async findByMac(mac: string): Promise<Device> {
    return await this.deviceRepository.findOne({ where: { mac } });
  }

  async findAll(): Promise<Device[]> {
    const devices = await this.deviceRepository
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.devicesHistory', 'history')
      .orderBy('history.timestamp', 'ASC')
      .getMany();

    return devices.map((device) => this.mapDeviceToAggregatedHistory(device));
  }

  findOne(id: string): Promise<Device> {
    return this.deviceRepository.findOne({
      where: { id },
      relations: ['devicesHistory'],
    });
  }

  async verifyMac(mac: string): Promise<void> {
    const deviceAlreadyExists = await this.findByMac(mac);

    if (deviceAlreadyExists) {
      throw new ConflictException('Device already exists');
    }
  }

  calcCurrentVolume(distance: number, device: Device): number {
    const { height, baseRadius } = device;

    const currentHeight = height - distance / 100;

    const currentVolume = Math.PI * Math.pow(baseRadius, 2) * currentHeight;

    return Number((currentVolume * 1000).toFixed(2));
  }

  mapDeviceToAggregatedHistory(device: Device): DeviceWithAggregatedHistory {
    const aggregatedHistory: AggregatedDeviceHistory[] = [];

    // Agrupa o histórico por dia
    const groupedHistory = device.devicesHistory.reduce((acc, history) => {
      const date = DateTime.fromJSDate(history.timestamp).toISODate(); // Obtém a data em formato 'YYYY-MM-DD'
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(history);
      return acc;
    }, {} as { [date: string]: DeviceHistory[] });

    // Calcula o volume máximo de água e nível de bateria por dia
    for (const date in groupedHistory) {
      const historyList = groupedHistory[date];

      aggregatedHistory.push({
        date: formatDate(date),
        volume: historyList[historyList.length - 1].water,
        battery: historyList[historyList.length - 1].battery,
      });
    }

    const deviceWithAggregatedHistory: DeviceWithAggregatedHistory = {
      ...device,
      aggregatedHistory,
    };

    return deviceWithAggregatedHistory;
  }

  subscribe(device: Device): void {
    Logger.log(`Subscribing to ${device.mac}`);
    this.mqttService.subscribe(device.mac, (msg) => {
      const dto = JSON.parse(msg);

      const currentVolume = this.calcCurrentVolume(dto.distance, device);

      const currentPercentage = (
        (currentVolume * 100) /
        device.maxCapacity
      ).toFixed(2);

      Logger.log(
        `Receiving update from ${device.mac} - currentVolume: ${currentVolume} - currentPercentage: ${currentPercentage}`,
      );

      this.deviceHistoryService.create({
        volume: Number(currentVolume),
        battery: Number(dto.battery),
        timestamp: new Date(dto.timestamp * 1000),
        device,
      });
      this.deviceRepository.update(device.id, {
        percentage: Number(currentPercentage),
        battery: Number(dto.battery),
        water: Number(currentVolume),
      });
    });
  }

  unsubscribe(device: Device): void {
    Logger.log(`Unsubscribing to ${device.mac}`);
    this.mqttService.unsubscribe(device.mac);
  }
}

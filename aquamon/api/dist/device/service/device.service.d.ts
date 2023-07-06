import { Repository } from 'typeorm';
import { MqttService } from '../../mqtt/mqtt.service';
import { CreateUpdateDeviceDTO } from '../controller/device.controller';
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
export declare class DeviceService {
    private deviceRepository;
    private readonly mqttService;
    private readonly deviceHistoryService;
    constructor(deviceRepository: Repository<Device>, mqttService: MqttService, deviceHistoryService: DeviceHistoryService);
    create(dto: CreateUpdateDeviceDTO): Promise<Device>;
    update(dto: CreateUpdateDeviceDTO, id: string): Promise<void>;
    delete(id: string): Promise<void>;
    findByMac(mac: string): Promise<Device>;
    findAll(): Promise<Device[]>;
    findOne(id: string): Promise<Device>;
    verifyMac(mac: string): Promise<void>;
    calcCurrentVolume(distance: number, device: Device): number;
    mapDeviceToAggregatedHistory(device: Device): DeviceWithAggregatedHistory;
    subscribe(device: Device): void;
    unsubscribe(device: Device): void;
}
export {};

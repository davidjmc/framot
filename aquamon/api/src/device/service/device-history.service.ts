import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../entity/device.entity';
import { DeviceHistory } from '../entity/device-history.entity';

@Injectable()
export class DeviceHistoryService {
  constructor(
    @InjectRepository(DeviceHistory)
    private deviceHisotryRepository: Repository<DeviceHistory>,
  ) {}

  async create(dto: {
    volume: number;
    battery: number;
    timestamp: Date;
    device: Device;
  }): Promise<DeviceHistory> {
    return await this.deviceHisotryRepository.save({
      water: dto.volume,
      battery: dto.battery,
      timestamp: dto.timestamp,
      device: dto.device,
    });
  }
}

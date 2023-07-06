import { Repository } from 'typeorm';
import { Device } from '../entity/device.entity';
import { DeviceHistory } from '../entity/device-history.entity';
export declare class DeviceHistoryService {
    private deviceHisotryRepository;
    constructor(deviceHisotryRepository: Repository<DeviceHistory>);
    create(dto: {
        volume: number;
        battery: number;
        timestamp: Date;
        device: Device;
    }): Promise<DeviceHistory>;
}

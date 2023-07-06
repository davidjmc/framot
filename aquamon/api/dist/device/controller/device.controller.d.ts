import { Device } from '../entity/device.entity';
import { DeviceService } from '../service/device.service';
export declare class CreateUpdateDeviceDTO {
    name: string;
    mac: string;
    maxCapacity: number;
    height: number;
    baseRadius: number;
    address: string;
}
export declare class DeviceController {
    private readonly deviceService;
    constructor(deviceService: DeviceService);
    create(dto: CreateUpdateDeviceDTO): Promise<Device>;
    update(dto: CreateUpdateDeviceDTO, id: string): Promise<void>;
    delete(id: string): Promise<void>;
    findAll(): Promise<Device[]>;
    findOne(id: string): Promise<Device>;
}

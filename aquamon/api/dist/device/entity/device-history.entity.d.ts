import { Device } from './device.entity';
export declare class DeviceHistory {
    id: string;
    battery: number;
    water: number;
    timestamp: Date;
    device: Device;
}

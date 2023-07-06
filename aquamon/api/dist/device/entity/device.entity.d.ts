import { DeviceHistory } from './device-history.entity';
export declare class Device {
    id: string;
    mac: string;
    name: string;
    address: string;
    battery: number;
    water: number;
    percentage: number;
    maxCapacity: number;
    height: number;
    baseRadius: number;
    devicesHistory: DeviceHistory[];
}

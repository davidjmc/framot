import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Device } from './device.entity';

@Entity()
export class DeviceHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  battery: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  water: number;

  @Column()
  timestamp: Date;

  @ManyToOne(() => Device, (device) => device.devicesHistory, {
    onDelete: 'CASCADE',
  })
  device: Device;
}

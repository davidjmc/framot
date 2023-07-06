import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './device/entity/device.entity';
import { DeviceModule } from './device/device.module';
import { MqttModule } from './mqtt/mqtt.module';
import { DeviceHistory } from './device/entity/device-history.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '../.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      username: 'dev',
      password: 'dev_pass',
      database: 'water_db',
      entities: [Device, DeviceHistory],
      synchronize: true,
    }),
    DeviceModule,
    MqttModule,
  ],
  providers: [],
})
export class AppModule {}

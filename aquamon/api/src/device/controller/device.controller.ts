import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Device } from '../entity/device.entity';
import { DeviceService } from '../service/device.service';

export class CreateUpdateDeviceDTO {
  name: string;
  mac: string;
  maxCapacity: number;
  height: number;
  baseRadius: number;
  address: string;
}

@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  async create(@Body() dto: CreateUpdateDeviceDTO): Promise<Device> {
    return await this.deviceService.create(dto);
  }

  @Put(':id')
  async update(
    @Body() dto: CreateUpdateDeviceDTO,
    @Param('id') id: string,
  ): Promise<void> {
    return await this.deviceService.update(dto, id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return await this.deviceService.delete(id);
  }

  @Get()
  async findAll(): Promise<Device[]> {
    return await this.deviceService.findAll();
  }

  @Get(':id')
  async findOne(id: string): Promise<Device> {
    return await this.deviceService.findOne(id);
  }
}

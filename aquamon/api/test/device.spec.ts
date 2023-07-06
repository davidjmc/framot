import { MqttService } from '../src/mqtt/mqtt.service';
import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { CreateUpdateDeviceDTO } from '../src/device/controller/device.controller';
import { DeviceHistory } from '../src/device/entity/device-history.entity';
import { Device } from '../src/device/entity/device.entity';
import { DeviceService } from '../src/device/service/device.service';
import { DateTime } from 'luxon';

describe('CRUD Operations', () => {
  let deviceService: DeviceService;
  let deviceRepository: Repository<Device>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: getRepositoryToken(Device),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(DeviceHistory),
          useClass: Repository,
        },
      ],
    }).compile();

    deviceService = module.get<DeviceService>(DeviceService);
    deviceRepository = module.get<Repository<Device>>(
      getRepositoryToken(Device),
    );
  });

  describe('create', () => {
    it('should create a new device and subscribe to MQTT topic', async () => {
      // Arrange
      const dto: CreateUpdateDeviceDTO = {
        name: 'Device 1',
        mac: '00:11:22:33:44:55',
        address: 'Address 1',
        height: 2.0,
        baseRadius: 1.6,
        maxCapacity: 100000,
      };

      const newDevice: Device = {
        id: 'a3feaeae-0cac-48db-86d0-d66b70af7666',
        mac: dto.mac,
        address: dto.address,
        height: dto.height,
        baseRadius: dto.baseRadius,
        maxCapacity: dto.maxCapacity,
        name: dto.name,
        battery: 0,
        water: 0,
        percentage: 0,
        devicesHistory: [] as DeviceHistory[],
      };

      const saveMock = jest
        .spyOn(deviceRepository, 'save')
        .mockResolvedValue(newDevice);
      const subscribeMock = jest.spyOn(deviceService, 'subscribe');

      // Act
      const result = await deviceService.create(dto);

      // Assert
      expect(result).toBe(newDevice);
      expect(saveMock).toHaveBeenCalledWith(dto);
      expect(subscribeMock).toHaveBeenCalledWith(newDevice);

      subscribeMock.mockRestore();
      saveMock.mockRestore();
    });

    it('should throw ConflictException if device with the same MAC already exists', async () => {
      // Arrange
      const dto: CreateUpdateDeviceDTO = {
        name: 'Device 1',
        mac: '00:11:22:33:44:55',
        address: 'Address 1',
        height: 2.0,
        baseRadius: 1.6,
        maxCapacity: 100000,
      };

      const findOneMock = jest
        .spyOn(deviceRepository, 'findOne')
        .mockResolvedValue({} as Device);

      // Act
      const result = deviceService.create(dto);

      // Assert
      await expect(result).rejects.toThrow(ConflictException);
      expect(findOneMock).toHaveBeenCalledWith({
        where: { mac: dto.mac },
      });

      findOneMock.mockRestore();
    });
  });

  describe('update', () => {
    it('should update device and subscribe to MQTT topic if MAC is different', async () => {
      // Arrange
      const id = 'a3feaeae-0cac-48db-86d0-d66b70af7666';

      const dto: CreateUpdateDeviceDTO = {
        name: 'Device 1',
        mac: '00:11:22:33:44:55',
        address: 'Address 1',
        height: 2.0,
        baseRadius: 1.6,
        maxCapacity: 100000,
      };

      const oldDevice: Device = {
        id,
        mac: '11:22:33:44:55:66',
        name: 'Device 1',
        address: 'Address 1',
        height: 2.0,
        baseRadius: 1.6,
        maxCapacity: 100000,
        battery: 0,
        water: 0,
        percentage: 0,
        devicesHistory: [] as DeviceHistory[],
      };

      const updatedDevice: Device = {
        id,
        mac: dto.mac,
        address: dto.address,
        height: dto.height,
        baseRadius: dto.baseRadius,
        maxCapacity: dto.maxCapacity,
        name: dto.name,
        battery: 0,
        water: 0,
        percentage: 0,
        devicesHistory: [] as DeviceHistory[],
      };

      const findOneOrFailMock = jest
        .spyOn(deviceRepository, 'findOneOrFail')
        .mockResolvedValue(oldDevice);
      const findOneMock = jest
        .spyOn(deviceRepository, 'findOne')
        .mockResolvedValue(updatedDevice);
      const findByMacMock = jest
        .spyOn(deviceService, 'findByMac')
        .mockResolvedValue(null);
      const updateMock = jest.spyOn(deviceRepository, 'update');
      const unsubscribeMock = jest.spyOn(deviceService, 'unsubscribe');
      const subscribeMock = jest.spyOn(deviceService, 'subscribe');
      const verifyMacMock = jest.spyOn(deviceService, 'verifyMac');

      // Act
      await deviceService.update(dto, id);

      // Assert
      expect(findOneOrFailMock).toHaveBeenCalledWith({
        where: { id },
      });
      expect(updateMock).toHaveBeenCalledWith(id, dto);
      expect(unsubscribeMock).toHaveBeenCalledWith(oldDevice);
      expect(subscribeMock).toHaveBeenCalledWith(updatedDevice);
      expect(verifyMacMock).toHaveBeenCalledWith(dto.mac);

      findOneOrFailMock.mockRestore();
      findOneMock.mockRestore();
      findByMacMock.mockRestore();
      updateMock.mockRestore();
      unsubscribeMock.mockRestore();
      subscribeMock.mockRestore();
      verifyMacMock.mockRestore();
    });

    it('should update device and dont subscribe if MAC is same', async () => {
      // Arrange
      const id = 'a3feaeae-0cac-48db-86d0-d66b70af7666';

      const dto: CreateUpdateDeviceDTO = {
        name: 'Device updated',
        mac: '00:11:22:33:44:55',
        address: 'Address 1',
        height: 2.0,
        baseRadius: 1.6,
        maxCapacity: 100000,
      };

      const oldDevice: Device = {
        id,
        mac: '00:11:22:33:44:55',
        name: 'Device 1',
        address: 'Address 1',
        height: 2.0,
        baseRadius: 1.6,
        maxCapacity: 100000,
        battery: 0,
        water: 0,
        percentage: 0,
        devicesHistory: [] as DeviceHistory[],
      };

      const updatedDevice: Device = {
        id,
        mac: dto.mac,
        address: dto.address,
        height: dto.height,
        baseRadius: dto.baseRadius,
        maxCapacity: dto.maxCapacity,
        name: dto.name,
        battery: 0,
        water: 0,
        percentage: 0,
        devicesHistory: [] as DeviceHistory[],
      };

      const findOneOrFailMock = jest
        .spyOn(deviceRepository, 'findOneOrFail')
        .mockResolvedValue(oldDevice);
      const findOneMock = jest
        .spyOn(deviceRepository, 'findOne')
        .mockResolvedValue(updatedDevice);
      const findByMacMock = jest
        .spyOn(deviceService, 'findByMac')
        .mockResolvedValue(null);
      const updateMock = jest.spyOn(deviceRepository, 'update');
      const unsubscribeMock = jest.spyOn(deviceService, 'unsubscribe');
      const subscribeMock = jest.spyOn(deviceService, 'subscribe');
      const verifyMacMock = jest.spyOn(deviceService, 'verifyMac');

      // Act
      await deviceService.update(dto, id);

      // Assert
      expect(updateMock).toHaveBeenCalledWith(id, dto);
      expect(unsubscribeMock).toHaveBeenCalledTimes(0);
      expect(subscribeMock).toHaveBeenCalledTimes(0);

      findOneOrFailMock.mockRestore();
      findOneMock.mockRestore();
      findByMacMock.mockRestore();
      updateMock.mockRestore();
      unsubscribeMock.mockRestore();
      subscribeMock.mockRestore();
      verifyMacMock.mockRestore();
    });
  });

  describe('delete', () => {
    it('should delete device and unsubscribe from MQTT topic', async () => {
      // Arrange
      const id = 'a3feaeae-0cac-48db-86d0-d66b70af7666';

      const device: Device = {
        id,
        mac: '11:22:33:44:55:66',
        name: 'Device 1',
        address: 'Address 1',
        height: 2.0,
        baseRadius: 1.6,
        maxCapacity: 100000,
        battery: 0,
        water: 0,
        percentage: 0,
        devicesHistory: [] as DeviceHistory[],
      };

      const findOneOrFailMock = jest
        .spyOn(deviceRepository, 'findOneOrFail')
        .mockResolvedValue(device);
      const deleteMock = jest.spyOn(deviceRepository, 'delete');
      const unsubscribeMock = jest.spyOn(deviceService, 'unsubscribe');

      // Act
      await deviceService.delete(id);

      // Assert
      expect(findOneOrFailMock).toHaveBeenCalledWith({
        where: { id },
      });
      expect(deleteMock).toHaveBeenCalledWith(id);
      expect(unsubscribeMock).toHaveBeenCalledWith(device);

      findOneOrFailMock.mockRestore();
      deleteMock.mockRestore();
      unsubscribeMock.mockRestore();
    });
  });

  describe('findByMac', () => {
    it('should return device with matching MAC', async () => {
      // Arrange
      const mac = '00:11:22:33:44:55';

      const device: Device = {
        id: 'a3feaeae-0cac-48db-86d0-d66b70af7666',
        name: 'Device 1',
        mac: '00:11:22:33:44:55',
        address: 'Address 1',
        height: 2.0,
        baseRadius: 1.6,
        maxCapacity: 100000,
        battery: 0,
        water: 0,
        percentage: 0,
        devicesHistory: [] as DeviceHistory[],
      };

      const findOneMock = jest
        .spyOn(deviceRepository, 'findOne')
        .mockResolvedValue(device);

      // Act
      const result = await deviceService.findByMac(mac);

      // Assert
      expect(result).toBe(device);
      expect(deviceRepository.findOne).toHaveBeenCalledWith({ where: { mac } });

      findOneMock.mockRestore();
    });
  });

  describe('verifyMac', () => {
    it('should throw ConflictException if device with the same MAC already exists', async () => {
      // Arrange
      const mac = '00:11:22:33:44:55';

      const findOneMock = jest
        .spyOn(deviceRepository, 'findOne')
        .mockResolvedValue({} as Device);

      // Act
      const result = deviceService.verifyMac(mac);

      // Assert
      await expect(result).rejects.toThrow(ConflictException);
      expect(findOneMock).toHaveBeenCalledWith({ where: { mac } });

      findOneMock.mockRestore();
    });

    it('should not throw ConflictException if device with the same MAC does not exist', async () => {
      // Arrange
      const mac = '00:11:22:33:44:55';

      const findOneMock = jest
        .spyOn(deviceRepository, 'findOne')
        .mockResolvedValue(null);

      // Act
      const result = deviceService.verifyMac(mac);

      // Assert
      await expect(result).resolves.not.toThrow(ConflictException);
      expect(findOneMock).toHaveBeenCalledWith({ where: { mac } });
    });
  });

  describe('findAll', () => {
    it('should return all devices with aggregated history', async () => {
      // Arrange
      const device1: Device = {
        id: 'a3feaeae-0cac-48db-86d0-d66b70af7666',
        name: 'Device 1',
        mac: '00:11:22:33:44:55',
        address: 'Address 1',
        height: 2.0,
        baseRadius: 1.6,
        maxCapacity: 100000,
        battery: 0,
        water: 0,
        percentage: 0,
        devicesHistory: [] as DeviceHistory[],
      };

      const device2: Device = {
        id: 'a3feaeae-0cac-48db-86d0-d66b70af7888',
        mac: '11:22:33:44:55:66',
        name: 'Device 2',
        address: 'Address 2',
        height: 2.0,
        baseRadius: 1.6,
        maxCapacity: 100000,
        battery: 0,
        water: 0,
        percentage: 0,
        devicesHistory: [] as DeviceHistory[],
      };

      const device1AggregatedHistory = {
        date: '01/01/22',
        volume: 10,
        battery: 80,
      };

      const device2AggregatedHistory = {
        date: '02/01/22',
        volume: 15,
        battery: 90,
      };

      const devices: Device[] = [device1, device2];

      deviceRepository.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(devices),
      });

      deviceService.mapDeviceToAggregatedHistory = jest
        .fn()
        .mockReturnValueOnce({
          ...device1,
          aggregatedHistory: [device1AggregatedHistory],
        })
        .mockReturnValueOnce({
          ...device2,
          aggregatedHistory: [device2AggregatedHistory],
        });

      // Act
      const result = await deviceService.findAll();

      // Assert
      expect(result).toEqual([
        { ...device1, aggregatedHistory: [device1AggregatedHistory] },
        { ...device2, aggregatedHistory: [device2AggregatedHistory] },
      ]);
      expect(deviceRepository.createQueryBuilder).toHaveBeenCalled();
      expect(deviceService.mapDeviceToAggregatedHistory).toHaveBeenCalledWith(
        device1,
      );
      expect(deviceService.mapDeviceToAggregatedHistory).toHaveBeenCalledWith(
        device2,
      );
    });
  });

  describe('findOne', () => {
    it('should return device with matching ID', async () => {
      // Arrange
      const id = 'a3feaeae-0cac-48db-86d0-d66b70af7666';

      const device: Device = {
        id: 'a3feaeae-0cac-48db-86d0-d66b70af7666',
        name: 'Device 1',
        mac: '00:11:22:33:44:55',
        address: 'Address 1',
        height: 2.0,
        baseRadius: 1.6,
        maxCapacity: 100000,
        battery: 0,
        water: 0,
        percentage: 0,
        devicesHistory: [] as DeviceHistory[],
      };

      const findOneMock = jest
        .spyOn(deviceRepository, 'findOne')
        .mockResolvedValue(device);

      // Act
      const result = await deviceService.findOne(id);

      // Assert
      expect(result).toBe(device);
      expect(findOneMock).toHaveBeenCalledWith({
        where: { id },
        relations: ['devicesHistory'],
      });

      findOneMock.mockRestore();
    });
  });

  describe('calcCurrentVolume', () => {
    it('should calculate current volume based on distance and device properties', () => {
      // Arrange
      const distance = 50;

      const device: Device = {
        id: 'a3feaeae-0cac-48db-86d0-d66b70af7666',
        name: 'Device 1',
        mac: '00:11:22:33:44:55',
        address: 'Address 1',
        height: 2.0,
        baseRadius: 1.6,
        maxCapacity: 100000,
        battery: 0,
        water: 0,
        percentage: 0,
        devicesHistory: [] as DeviceHistory[],
      };

      // Act
      const result = deviceService.calcCurrentVolume(distance, device);

      // Assert
      expect(result).toBe(12063.72); // Assuming Math.PI is 3.14159
    });
  });
});

describe('Mapper and Calc', () => {
  let deviceService: DeviceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: getRepositoryToken(Device),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(DeviceHistory),
          useClass: Repository,
        },
      ],
    }).compile();

    deviceService = module.get<DeviceService>(DeviceService);
  });

  it('should map device with history to device with aggregated history', () => {
    // Arrange
    const device: Device = {
      id: 'a3feaeae-0cac-48db-86d0-d66b70af7666',
      name: 'Device 1',
      mac: '00:11:22:33:44:55',
      address: 'Address 1',
      height: 2.0,
      baseRadius: 1.6,
      maxCapacity: 100000,
      battery: 0,
      water: 0,
      percentage: 0,
      devicesHistory: [
        {
          timestamp: DateTime.fromISO('2022-01-01').toJSDate(),
          water: 10,
          battery: 80,
        },
        {
          timestamp: DateTime.fromISO('2022-01-02').toJSDate(),
          water: 15,
          battery: 90,
        },
      ] as DeviceHistory[],
    };

    // Act
    const result = deviceService.mapDeviceToAggregatedHistory(device);

    // Assert
    expect(result).toEqual({
      ...device,
      aggregatedHistory: [
        { date: '01/01/22', volume: 10, battery: 80 },
        { date: '02/01/22', volume: 15, battery: 90 },
      ],
    });
  });

  it('should calculate current volume based on distance and device properties', () => {
    // Arrange
    const distance = 50;

    const device: Device = {
      id: 'a3feaeae-0cac-48db-86d0-d66b70af7666',
      name: 'Device 1',
      mac: '00:11:22:33:44:55',
      address: 'Address 1',
      height: 2.0,
      baseRadius: 1.6,
      maxCapacity: 100000,
      battery: 0,
      water: 0,
      percentage: 0,
      devicesHistory: [] as DeviceHistory[],
    };

    // Act
    const result = deviceService.calcCurrentVolume(distance, device);

    // Assert
    expect(result).toBe(12063.72); // Assuming Math.PI is 3.14159
  });
});

describe('MQTT', () => {
  let deviceService: DeviceService;
  let mqttService: MqttService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: getRepositoryToken(Device),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(DeviceHistory),
          useClass: Repository,
        },
      ],
    }).compile();

    deviceService = module.get<DeviceService>(DeviceService);
    mqttService = module.get<MqttService>(MqttService);
  });

  it('should subscribe to MQTT topic for the device', () => {
    // Arrange
    const device: Device = {
      id: 'a3feaeae-0cac-48db-86d0-d66b70af7666',
      name: 'Device 1',
      mac: '00:11:22:33:44:55',
      address: 'Address 1',
      height: 2.0,
      baseRadius: 1.6,
      maxCapacity: 100000,
      battery: 0,
      water: 0,
      percentage: 0,
      devicesHistory: [] as DeviceHistory[],
    };

    const subscribeMock = jest.spyOn(mqttService, 'subscribe');

    // Act
    deviceService.subscribe(device);

    // Assert
    expect(subscribeMock).toHaveBeenCalledWith(
      device.mac,
      expect.any(Function),
    );
  });

  it('should unsubscribe from MQTT topic for the device', () => {
    // Arrange
    const device: Device = {
      id: 'a3feaeae-0cac-48db-86d0-d66b70af7666',
      name: 'Device 1',
      mac: '00:11:22:33:44:55',
      address: 'Address 1',
      height: 2.0,
      baseRadius: 1.6,
      maxCapacity: 100000,
      battery: 0,
      water: 0,
      percentage: 0,
      devicesHistory: [] as DeviceHistory[],
    };

    const unsubscribeMock = jest.spyOn(mqttService, 'unsubscribe');

    // Act
    deviceService.unsubscribe(device);

    // Assert
    expect(unsubscribeMock).toHaveBeenCalledWith(device.mac);
  });
});

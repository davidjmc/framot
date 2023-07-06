import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeviceHistory } from '../src/device/entity/device-history.entity';
import { Repository } from 'typeorm';
import { DeviceHistoryService } from '../src/device/service/device-history.service';
import { Device } from '../src/device/entity/device.entity';

describe('DeviceHistoryService', () => {
  let deviceHistoryService: DeviceHistoryService;
  let deviceHistoryRepository: Repository<DeviceHistory>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: getRepositoryToken(DeviceHistory),
          useClass: Repository,
        },
      ],
    }).compile();

    deviceHistoryService =
      module.get<DeviceHistoryService>(DeviceHistoryService);
    deviceHistoryRepository = module.get<Repository<DeviceHistory>>(
      getRepositoryToken(DeviceHistory),
    );
  });

  describe('create', () => {
    it('should create a new device history', async () => {
      // Arrange
      const volume = 50;
      const battery = 80;
      const timestamp = new Date();
      const device = new Device();

      const saveSpy = jest
        .spyOn(deviceHistoryRepository, 'save')
        .mockResolvedValueOnce({
          id: 'a3feaeae-0cac-48db-86d0-d66b70af7888',
          water: volume,
          battery,
          timestamp,
          device,
        });

      // Act
      const createdDeviceHistory = await deviceHistoryService.create({
        volume,
        battery,
        timestamp,
        device,
      });

      // Assert
      expect(createdDeviceHistory).toBeDefined();
      expect(createdDeviceHistory.id).toEqual(
        'a3feaeae-0cac-48db-86d0-d66b70af7888',
      );
      expect(createdDeviceHistory.water).toEqual(volume);
      expect(createdDeviceHistory.battery).toEqual(battery);
      expect(createdDeviceHistory.timestamp).toEqual(timestamp);
      expect(createdDeviceHistory.device).toEqual(device);
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledWith({
        water: volume,
        battery,
        timestamp,
        device,
      });
    });
  });
});

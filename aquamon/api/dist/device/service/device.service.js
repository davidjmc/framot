"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const luxon_1 = require("luxon");
const typeorm_2 = require("typeorm");
const mqtt_service_1 = require("../../mqtt/mqtt.service");
const device_entity_1 = require("../entity/device.entity");
const device_history_service_1 = require("./device-history.service");
function formatDate(dateString) {
    const date = luxon_1.DateTime.fromISO(dateString);
    return date.toFormat('dd/LL/yy');
}
let DeviceService = class DeviceService {
    constructor(deviceRepository, mqttService, deviceHistoryService) {
        this.deviceRepository = deviceRepository;
        this.mqttService = mqttService;
        this.deviceHistoryService = deviceHistoryService;
        this.findAll().then((res) => res.forEach((device) => {
            this.subscribe(device);
        }));
    }
    async create(dto) {
        await this.verifyMac(dto.mac);
        const newDevice = await this.deviceRepository.save(Object.assign({}, dto));
        this.subscribe(newDevice);
        return newDevice;
    }
    async update(dto, id) {
        const oldDevice = await this.deviceRepository.findOneOrFail({
            where: { id },
        });
        if (oldDevice.mac !== dto.mac) {
            await this.verifyMac(dto.mac);
            await this.deviceRepository.update(id, dto);
            const updateddevice = await this.findOne(id);
            this.unsubscribe(oldDevice);
            this.subscribe(updateddevice);
        }
        else {
            await this.deviceRepository.update(id, dto);
        }
    }
    async delete(id) {
        const device = await this.deviceRepository.findOneOrFail({
            where: { id },
        });
        await this.deviceRepository.delete(id);
        this.unsubscribe(device);
    }
    async findByMac(mac) {
        return await this.deviceRepository.findOne({ where: { mac } });
    }
    async findAll() {
        const devices = await this.deviceRepository
            .createQueryBuilder('device')
            .leftJoinAndSelect('device.devicesHistory', 'history')
            .orderBy('history.timestamp', 'ASC')
            .getMany();
        return devices.map((device) => this.mapDeviceToAggregatedHistory(device));
    }
    findOne(id) {
        return this.deviceRepository.findOne({
            where: { id },
            relations: ['devicesHistory'],
        });
    }
    async verifyMac(mac) {
        const deviceAlreadyExists = await this.findByMac(mac);
        if (deviceAlreadyExists) {
            throw new common_1.ConflictException('Device already exists');
        }
    }
    calcCurrentVolume(distance, device) {
        const { height, baseRadius } = device;
        const currentHeight = height - distance / 100;
        const currentVolume = Math.PI * Math.pow(baseRadius, 2) * currentHeight;
        return Number((currentVolume * 1000).toFixed(2));
    }
    mapDeviceToAggregatedHistory(device) {
        const aggregatedHistory = [];
        const groupedHistory = device.devicesHistory.reduce((acc, history) => {
            const date = luxon_1.DateTime.fromJSDate(history.timestamp).toISODate();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(history);
            return acc;
        }, {});
        for (const date in groupedHistory) {
            const historyList = groupedHistory[date];
            aggregatedHistory.push({
                date: formatDate(date),
                volume: historyList[historyList.length - 1].water,
                battery: historyList[historyList.length - 1].battery,
            });
        }
        const deviceWithAggregatedHistory = Object.assign(Object.assign({}, device), { aggregatedHistory });
        return deviceWithAggregatedHistory;
    }
    subscribe(device) {
        common_1.Logger.log(`Subscribing to ${device.mac}`);
        this.mqttService.subscribe(device.mac, (msg) => {
            const dto = JSON.parse(msg);
            console.log(dto);
            const currentVolume = this.calcCurrentVolume(dto.distance, device);
            const currentPercentage = ((currentVolume * 100) /
                device.maxCapacity).toFixed(2);
            common_1.Logger.log(`Receiving update from ${device.mac} - currentVolume: ${currentVolume} - currentPercentage: ${currentPercentage}`);
            this.deviceHistoryService.create({
                volume: Number(currentVolume),
                battery: Number(dto.battery),
                timestamp: new Date(dto.timestamp),
                device,
            });
            this.deviceRepository.update(device.id, {
                percentage: Number(currentPercentage),
                battery: Number(dto.battery),
                water: Number(currentVolume),
            });
        });
    }
    unsubscribe(device) {
        common_1.Logger.log(`Unsubscribing to ${device.mac}`);
        this.mqttService.unsubscribe(device.mac);
    }
};
DeviceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(device_entity_1.Device)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        mqtt_service_1.MqttService,
        device_history_service_1.DeviceHistoryService])
], DeviceService);
exports.DeviceService = DeviceService;
//# sourceMappingURL=device.service.js.map
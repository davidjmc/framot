"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const mqtt_module_1 = require("../mqtt/mqtt.module");
const device_controller_1 = require("./controller/device.controller");
const device_entity_1 = require("./entity/device.entity");
const device_service_1 = require("./service/device.service");
const device_history_entity_1 = require("./entity/device-history.entity");
const device_history_service_1 = require("./service/device-history.service");
let DeviceModule = class DeviceModule {
};
DeviceModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([device_entity_1.Device, device_history_entity_1.DeviceHistory]), mqtt_module_1.MqttModule],
        controllers: [device_controller_1.DeviceController],
        providers: [device_service_1.DeviceService, device_history_service_1.DeviceHistoryService],
    })
], DeviceModule);
exports.DeviceModule = DeviceModule;
//# sourceMappingURL=device.module.js.map
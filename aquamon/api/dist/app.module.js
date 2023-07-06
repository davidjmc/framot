"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const device_entity_1 = require("./device/entity/device.entity");
const device_module_1 = require("./device/device.module");
const mqtt_module_1 = require("./mqtt/mqtt.module");
const device_history_entity_1 = require("./device/entity/device-history.entity");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ envFilePath: '../.env' }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                port: 5432,
                username: 'dev',
                password: 'dev_pass',
                database: 'water_db',
                entities: [device_entity_1.Device, device_history_entity_1.DeviceHistory],
                synchronize: true,
            }),
            device_module_1.DeviceModule,
            mqtt_module_1.MqttModule,
        ],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
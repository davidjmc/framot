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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceHistory = void 0;
const typeorm_1 = require("typeorm");
const device_entity_1 = require("./device.entity");
let DeviceHistory = class DeviceHistory {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DeviceHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], DeviceHistory.prototype, "battery", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], DeviceHistory.prototype, "water", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], DeviceHistory.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => device_entity_1.Device, (device) => device.devicesHistory, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", device_entity_1.Device)
], DeviceHistory.prototype, "device", void 0);
DeviceHistory = __decorate([
    (0, typeorm_1.Entity)()
], DeviceHistory);
exports.DeviceHistory = DeviceHistory;
//# sourceMappingURL=device-history.entity.js.map
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
exports.MqttService = void 0;
const common_1 = require("@nestjs/common");
const mqtt = require("mqtt");
let MqttService = class MqttService {
    constructor() {
        this.client = mqtt.connect('mqtt://172.22.64.193');
        this.client.on('connect', () => {
            console.log('Conectado ao broker MQTT');
        });
    }
    subscribe(topic, callback) {
        this.client.subscribe(topic);
        this.client.on('message', (t, message) => {
            if (t === topic) {
                console.log(`Mensagem recebida no tópico ${topic}: ${message.toString()}`);
                callback(message.toString());
            }
        });
    }
    unsubscribe(topic) {
        this.client.unsubscribe(topic);
    }
};
MqttService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MqttService);
exports.MqttService = MqttService;
//# sourceMappingURL=mqtt.service.js.map
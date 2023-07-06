import { Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';
import * as fs from 'fs';

@Injectable()
export class MqttService {
  private client: mqtt.Client;

  constructor() {
    this.client = mqtt.connect(
      'mqtt://f9ca89e3f5df46e6a4b2e122b2d56a3c.s2.eu.hivemq.cloud:8883',
      {
        protocol: 'mqtts', // Indica que a conexão deve usar TLS
        ca: [fs.readFileSync('src/mqtt/cert.pem')], // Caminho para o certificado de autoridade (CA) do broker MQTT
        rejectUnauthorized: true, // Rejeita conexões com certificados inválidos (opcional)
        username: 'username',
        password: '@MQTT-password1',
      },
    );

    this.client.on('connect', () => {
      console.log('Conectado ao broker MQTT');
    });
  }

  subscribe(topic: string, callback: (message: string) => void) {
    this.client.subscribe(topic);
    this.client.on('message', (t, message) => {
      if (t === topic) {
        console.log(
          `Mensagem recebida no tópico ${topic}: ${message.toString()}`,
        );
        callback(message.toString());
      }
    });
  }

  unsubscribe(topic: string) {
    this.client.unsubscribe(topic);
  }
}

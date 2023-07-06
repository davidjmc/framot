import mqtt from 'mqtt';
import * as fs from 'fs';
import { DateTime } from 'luxon';
import { devices } from './devices.js';

const client = mqtt.connect(
  'mqtt://f9ca89e3f5df46e6a4b2e122b2d56a3c.s2.eu.hivemq.cloud:8883',
  {
    protocol: 'mqtts', // Indica que a conexão deve usar TLS
    ca: [fs.readFileSync('./cert.pem')], // Caminho para o certificado de autoridade (CA) do broker MQTT
    rejectUnauthorized: true, // Rejeita conexões com certificados inválidos (opcional)
    username: 'username',
    password: '@MQTT-password1',
  }
);
// GERAR DADOS ATUAIS A CADA 30 SEGUNDOS
client.on('connect', () => {
  console.log('Conectado ao broker MQTT');
  const deviceMap = {};
  const now = DateTime.now().toMillis();

  setInterval(() => {
    devices.forEach((device) => {
      // Simulação da alteração da distância do sensor
      const previousDistance = deviceMap[device.macAddress]?.distance ?? 0;
      const diffDistance = Math.floor(Math.random() * 20) - 10;
      const currentDistance = Math.max(
        0,
        Math.min(device.heigth, previousDistance + diffDistance)
      ); // Garante que a distância seja sempre não negativa

      // Simulação da diminuição da bateria
      const previousBattery = deviceMap[device.macAddress]?.battery ?? 100;
      const currentBattery = Math.max(0, previousBattery - 0.5);
      const isBatteryDead = currentBattery <= 0;

      // Criação da mensagem MQTT com a distância atual e nível de bateria
      const message = {
        distance: currentDistance,
        battery: currentBattery,
        timestamp: now,
      };

      console.table(message);

      client.publish(device.macAddress, JSON.stringify(message));

      // Armazenamento do valor atual para uso no próximo intervalo
      deviceMap[device.macAddress] = {
        distance: currentDistance,
        battery: isBatteryDead ? 100 : currentBattery, // Define o nível de bateria como 0 se estiver descarregada
      };
    });
  }, 10 * 1000);
});

client.on('error', (error) => {
  console.error(error);
});

// GERAR DADOS HISTORICOS ATÉ O DIA ATUAL
// client.on('connect', () => {
//   console.log('Conectado ao broker MQTT');
//   const deviceMap = {}; // Armazena a última distância do sensor e nível de bateria para cada dispositivo
//   let timestamp = DateTime.fromISO('2023-01-01').toMillis(); // Definindo o timestamp inicial para janeiro de 2023
//   const now = DateTime.now().toMillis(); // Obtendo o timestamp atual

//   const intervalId = setInterval(() => {
//     if (timestamp > now) {
//       // Verifica se o timestamp atual ultrapassou o timestamp atual
//       clearInterval(intervalId);
//       console.info('Execução finalizada'); // Interrompe a execução do setInterval
//       close();
//     }

//     devices.forEach((device) => {
//       // Simulação da alteração da distância do sensor
//       const previousDistance = deviceMap[device.macAddress]?.distance ?? 0;
//       const diffDistance = Math.floor(Math.random() * 20) - 10;
//       const currentDistance = Math.max(
//         0,
//         Math.min(device.heigth, previousDistance + diffDistance)
//       ); // Garante que a distância seja sempre não negativa

//       // Simulação da diminuição da bateria
//       const previousBattery = deviceMap[device.macAddress]?.battery ?? 100; // Valor anterior ou 100%
//       const currentBattery = Math.max(0, previousBattery - 1); // Decrementa a bateria em 1%
//       const isBatteryDead = currentBattery <= 0;

//       // Criação da mensagem MQTT com a distância atual e nível de bateria
//       const message = {
//         distance: currentDistance,
//         battery: currentBattery,
//         timestamp,
//       };

//       console.table(message);

//       client.publish(device.macAddress, JSON.stringify(message));

//       deviceMap[device.macAddress] = {
//         distance: currentDistance,
//         battery: isBatteryDead ? 100 : currentBattery,
//       };

//       timestamp += 3600000 * 12; // Incrementa o timestamp em 12 horas
//     });
//   }, 0.5 * 1000);
// });

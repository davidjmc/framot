export declare class MqttService {
    private client;
    constructor();
    subscribe(topic: string, callback: (message: string) => void): void;
    unsubscribe(topic: string): void;
}

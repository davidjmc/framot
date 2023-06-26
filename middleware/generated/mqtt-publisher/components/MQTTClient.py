try:
    import utime as time
except:
    import time

try:
    from umqtt.simple import MQTTClient
except:
    import paho.mqtt.client as MQTTClient

from amot import Amot

class MQTTProxy():

    def __init__(self):
        super().__init__()
        self.client = None
        self.server = None
        self.client_id = None
        self.topic = None
        self.message = None
        self.retain = None
        self.callback = None


    def run(self, invArg):
        self.server = Amot.configEnv('broker_host')
        self.client_id = invArg['THING_ID']

        if invArg['OP'] == 'Connect':
            self.connect()
        else:
            if self.client is None:
                self.connect()

            if invArg['OP'] == 'Publish':
                try:
                    for topic in invArg['TOPICS']:
                        self.client.publish(topic, invArg['MSG'])
                        #self.client.disconnect() # uncomment if you use deep sleep
                except OSError as e:
                    print(e)
        
            elif invArg['OP'] == 'Subscribe':
                try:
                    for topic in invArg['TOPICS']:
                        self.client.subscribe(topic)
                except OSError as e:
                    print(e)

            elif invArg['OP'] == 'CheckMsg':
                try:
                    #self.client.check_msg() #non-bloking
                    self.client.wait_msg() # bloking
                    #print('Message checked!')
                except:
                    self.client.on_message = self.on_message
                    # print('Check new message: {}'.format(self.message))
                    # print('Check retaion: {}'.format(self.retain))
                    self.client.loop()
            
        
    def connect(self):
        try:
            try:
                self.client = MQTTClient(self.client_id, self.server)
                self.client.set_callback(self.call_back)
                self.client.connect()
            except:
                self.client = MQTTClient.Client(self.client_id, self.server)
                self.client.connect(self.server)
                self.client.on_connect = self.on_connect
        except OSError as e:
            print(e)
            Amot.restartAndReconnect()
            
    def call_back(self, topic, msg):
        self.message = msg.decode()
        print((topic, msg))


    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print('Client Connected ' + str(rc))
        else:
            print('Client not Connected')
            # client.subscribe(cfg.subscriber['topic_sub'])

    def on_message(self, client, userdata, msg):
        # print('Topic: {}'.format(msg.topic))
        # print('QoS: {}'.format(msg.qos))
        # print('Retain: {}'.format(msg.retain))
        print('Payload: {}'.format(msg.payload))
        msg = msg.payload.decode('utf-8')
        print(type(msg))
        # self.message = str(msg.payload)
        # self.retain = str(msg.retain)
        # if msg.retain == 1:
        #     print('this is a retained message')
        self.client.loop_stop()
    

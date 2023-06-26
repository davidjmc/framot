import time
#import random as r

class App():
    def __init__(self):
        super().__init__()
        self.count = 0
        # self.sensor = dht.DHT11(machine.Pin(2))


    def run(self):
        [topic] = AmotEngine._app_vars['topics']

        temp = 38
        hum = 15
        msg = b'[NEW] Temperature: 38 and Humidity: 15'

        self.count += 1
        # print('sleeping for ' + str(appVars.sleep_time) + ' second(s)')
        time.sleep(appVars.sleep_time)

        print('Publishing on topic [{0}]: {1}'.format(topic, msg))
        AmotEngine.publish(self, topic, msg, { 'temperature': temp })


    #@staticmethod
    #def temp_hum_sensor():
    #    try:
    #        temp = 100.0 * r.random()
    #        hum = 100.0 * r.random()
    #        if (isinstance(temp, float) and isinstance(hum, float)) or (isinstance(temp, int) and isinstance(hum, int)):
    #            temp = b'%3.1f' % temp
    #            hum = b'%.1f' % hum
    #            return temp, hum
    #        else:
    #            return 'Invalid sensor reading'
    #    except OSError as e:
    #        return 'Failed to read sensor.'

# def read_sensor(self):
#         try:
#             self.sensor.measure()
#             temp = self.sensor.temperature()
#             hum = self.sensor.humidity()
#             if (isinstance(temp, float) and isinstance(hum, float)) or
#             (isinstance(temp, int) and isinstance(hum, int)):
#                 temp = (b'{0:3.1f},'.format(temp))
#                 hum = (b'{0:3.1f},'.format(hum))
#                 return temp, hum
#             else:
#                 return 'Invalid sensor readings.'
#         except OSError as e:
#             return 'Failed to read sensor.'










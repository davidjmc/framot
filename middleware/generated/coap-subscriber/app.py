from amot import Amot
import configurations

import time

class App:
    
    def __init__(self):
        super().__init__()
            
    def setup(self):
        try:
            Amot.proxy().connect()
        except OSError as e:
            print("Error < {0} > Publisher not connect to MQTT Broker".format(str(e)))
        try:
            Amot.proxy().subscribe('water_level')
            print('Connected to {0} MQTT broker, subscribed to {1} topic'.format(Amot.configEnv('broker_host'), Amot.configApp('subscribe_to')))
        except OSError as e:
            print("Error < {0} > Publisher not connect to MQTT Broker".format(str(e)))

    def loop(self):
        
        new_message = Amot.proxy().checkMsg('water_level')
        if new_message != None:
            print('I received the message: {0}'.format(new_message))
        time.sleep(Amot.configApp('loop_interval'))
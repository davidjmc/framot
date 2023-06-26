from amot import Amot
from agent import AmotAgent
from machine import Pin, ADC, RTC
import configurations
import machine
import time

RECTANGLE = False
CYLINDER = True

DEEP_HEIGHT = 100 # [cm]

# RECTANGLE_HEIGHT = 1 
RECTANGLE_LENGTH = 100
RECTANGLE_WIDTH = 100

# CYLINDER_DIAMETER = 1
CYLINDER_RADIUS = 100
# CYLINDER_HEIGHT = 1
PI = 3.1415927

MINIMUM_SENSOR_RANGE = 2 # [cm]
MAXIMUM_SENSOR_RANGE = 400 # [cm]

# capacity of reservoir in Liters
def reservoirCapacity(DEEP_HEIGHT, reservoirArea):
    reservoir_capacity = (DEEP_HEIGHT * reservoirArea) / 1000
    return reservoir_capacity

def deep_sleep(msecs):
        # configure RTC.ALARM0 to be able to wake the device
        rtc = machine.RTC()
        rtc.irq(trigger=rtc.ALARM0, wake=machine.DEEPSLEEP)
        # set RTC.ALARM0 to fire after X milliseconds (waking the device)
        rtc.alarm(rtc.ALARM0, msecs)
        # put the device to sleep
        machine.deepsleep()    
    
def reservoirProfileArea():
    if RECTANGLE:
        reservoirArea = RECTANGLE_WIDTH * RECTANGLE_LENGTH
    else:
        reservoirArea = PI * CYLINDER_RADIUS * CYLINDER_RADIUS
    return reservoirArea

class App:
    
    def __init__(self):
        super().__init__()
        self.echo_timeout_us = 500*2*30
        self.trig = Pin(12, mode=Pin.OUT, pull=None)
        self.trig.value(0)
        self.echo = Pin(14, mode=Pin.IN, pull=None)
        self.start = 1
        self.reservoirProfile = 0
        self.topic = "channels/water-level"
        self.counter = 1
        
    def setup(self):
        try:
            self.reservoirProfile = reservoirProfileArea()
            Amot.proxy().connect()
        except OSError as e:
            print("Error < {0} > Publisher not connect to Broker".format(str(e)))
        #try:
            #Amot.proxy().subscribe(Amot.configApp('subscribe_to'))
            #print('Connected to {0} MQTT broker, subscribed to {1} topic'.format(Amot.configEnv('broker_host'), Amot.configApp('subscribe_to')))
        #except OSError as e:
            #print("Error < {0} > Publisher not connect to MQTT Broker".format(str(e)))

    
    def loop(self):
        
        topic = configurations.configurations['application']['publish_in']
        #Amot.proxy().checkMsg()
        
        #message = b'Hello #%d' % self.counter
        
        #print('Publishing on topic {0} the message: {1}'.format(Amot.configApp('publish_in'), message))
                 
        capacity = reservoirCapacity(DEEP_HEIGHT, self.reservoirProfile)
        volume = self.reservoirVolume(DEEP_HEIGHT, self.reservoirProfile)

        # msg = b'[' + str(self.counter) + '] Water Level Monitoring: [' + str(volume) + '] Capacity: [' + str(capacity) + '] rtc-memory: [' + str(Amot.instance().rtc.memory()) + ']'
        msg = b'[' + str(self.counter) + '] Water Level Monitoring: [' + str(volume) + '] Capacity: [' + str(capacity) + '] Time: [' + str(time.time()) + ']'


        print('Publishing on topic [{0}]: [{1}]'.format(self.topic, msg))
        Amot.proxy().publish(topic, msg, {'fluid_volume': volume, 'reservoir_capacity': capacity})
        Amot.agent().app_context['fluid_volume'] = b'' + str(volume) + '' 
        Amot.agent().app_context['reservoir_capacity'] = b'' + str(capacity) + ''
        
        self.counter += 1
        
        # print('Sleep time in app = {0}'.format(configurations.configurations['application']['loop_interval']))
        # time.sleep(1)
        # time.sleep(configurations.configurations['application']['loop_interval'])
        #Amot.deep_sleep((configurations.configurations['application']['loop_interval'])*1000)
        # self.deep_sleep(10000)

    # send pulse and wait    
    def _send_pulse_and_wait(self):
        self.trig.value(0) # estabiliza o sensor
        time.sleep_us(5)
        self.trig.value(1)

        # envia um pulso de10us.
        time.sleep_us(10)
        self.trig.value(0)

        try:
          pulse_time = machine.time_pulse_us(self.echo, 1, self.echo_timeout_us)
          return pulse_time

        except OSError as ex:
          if ex.args[0] == 110: # 110 = ETIMEDOUT
            raise OSError('Out of range')
          raise ex
    
    # get distance in [cm]
    def _distance_cm(self):
        pulse_time = self._send_pulse_and_wait()
        cms = (pulse_time / 2) / 29.1
        return cms
    
    def reservoirVolume(self, DEEP_HEIGHT, reservoirArea):
        distance = self._distance_cm()
        currentDistance = DEEP_HEIGHT - (distance - MINIMUM_SENSOR_RANGE) # currente tank range in [cm]
        currentVolumeCM = (reservoirArea * currentDistance) # valume of tank in [cm^3]
        currentVolumeLiters = currentVolumeCM / 1000.0
        return currentVolumeLiters
        
    
        

    

        



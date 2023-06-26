import time
import machine
try:
    import utime
except:
    pass
from machine import Pin, ADC

class App():
    def __init__(self):
        super().__init__()

        self.echo_timeout_us = 500*2*30
        self.trig = Pin(4, mode=Pin.OUT, pull=None)
        self.trig.value(0)
        self.echo = Pin(13, mode=Pin.IN, pull=None)


    def run(self):
        [topic] = AmotEngine._app_vars['topics']
        pot = ADC(0)

        time.sleep(appVars.sleep_time)

        #times for evaluation
        try:
            app0 = utime.ticks_us()
        except:
            pass


        maximum_range = 100.0 # maximum tank range in cm
        tank_radius = 100.0 # radius in cm
        pi = 1.0 # In case of cylindrical reservoir, use pi = 3.14

        capacity = self.reservoir_capacity(maximum_range, tank_radius, pi)
        volume = self.fluid_volume_monitoring(maximum_range, tank_radius, pi)

        #rat_factor = 2.80
        #pot_value = 0.0
        #for n in range(11):
        #    pot_value = pot_value + pot.read()
        #    time.sleep(0.5)
        #ana_value = pot_value/10.0
        #volt_value = ana_value * (3.3/1024.0)
        #batt_value = volt_value * rat_factor
        # batt_value = 100


        # tank_log (thing_id, volume, timestamp, date_time)
        #msg = b'Temperature: 29 and Humidity: 13 ATUALIZADO 10!'
        msg = b'Water Level Monitoring: [' + str(volume) + '] Capacity:[' + str(capacity) + ']'

        #msg = b'Water Level Monitoring: ' + str(level) + ' Liters and Battery Level: ' + str(batt_value)


        try:
            AmotEngine._times.append(('App: ', utime.ticks_us()-app0))
        except:
            pass

        print('Publishing on topic [{0}]: [{1}]'.format(topic, msg))
        AmotEngine.publish(self, topic, msg, {'fluid_volume': volume, 'reservoir_capacity': capacity})


    # capacity of reservoir in Liters
    def reservoir_capacity(self, maximum_range, tank_base_or_radius, pi):
        reservoir_capacity = (maximum_range * ((tank_base_or_radius * tank_base_or_radius) * pi)) / 1000
        return reservoir_capacity


    def fluid_volume_monitoring(self, maximum_range, tank_base_or_radius, pi):
        distance = self._distance_cm()
        current_range = (maximum_range - 10.0) - distance # currente tank range in cm
        volume_tank = ((pi * (tank_base_or_radius * tank_base_or_radius)) * (current_range)) # valume of tank in cm^3
        current_volume = volume_tank / 1000 # current volume tank in liters
        return current_volume


    def _distance_cm(self):
        pulse_time = self._send_pulse_and_wait()
        cms = (pulse_time / 2) / 29.1
        return cms


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
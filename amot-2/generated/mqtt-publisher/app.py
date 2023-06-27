from amot import Amot
import configurations

import time
import random as r

from bs4 import BeautifulSoup

import requests

RECTANGLE = True
CYLINDER = False

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

def reservoirProfileArea():
  if RECTANGLE:
    reservoirArea = RECTANGLE_WIDTH * RECTANGLE_LENGTH
  else:
    reservoirArea = PI * CYLINDER_RADIUS * CYLINDER_RADIUS
  return reservoirArea

class App:
  def __init__(self):
    super().__init__()
    self.counter = 1
    self.reservoirArea = 0
    self.topic = None
    self.thing = None

  def setup(self):
    try:
      print('setting things up')
      Amot.proxy().connect()
      self.reservoirProfile = reservoirProfileArea()
      self.topic = configurations.configurations['application']['publish_in']
      self.thing_id = configurations.configurations['device']['id']
    except OSError as e:
      print("Error < {0} > Publisher not connect to MQTT Broker".format(str(e)))

  def loop(self):
    capacity = reservoirCapacity(DEEP_HEIGHT, self.reservoirProfile)
    volume = self.reservoirVolume(DEEP_HEIGHT, self.reservoirProfile)
    distance = self._distance_cm()

    #msg = '{' + 'thing_id: ' + str(self.thing_id) + ', counter: ' + str(self.counter) + ', volume: ' + str(volume) + ', capacity: ' + str(capacity) + '}'
    #message = "{\"distance\": " + String(currentDistance) + ", \"battery\": " + String(currentBattery) + ", \"timestamp\": " + String(timestamp) + "}";
    msg = "{" + "\"distance\""":" + str(distance) + ", " + "\"battery\""":" + str(90) + ", " + "\"timestamp\""":" + str(1687446180) + "}"
    #msg = "{"distance": " + str(distance) + ", "battery": " + str(90) + ", "timestamp": " + str(time.time()) + "}"
    #message = "{\"distance\": " + String(currentDistance) + ", \"battery\": " + String(currentBattery) + ", \"timestamp\": " + String(timestamp) + "}"

    print('Publishing on topic [{0}]: {1}'.format(self.topic, msg))
    #Amot.proxy().publish(self.topic, msg)
    Amot.proxy().publish('00:1B:44:11:3A:B7', msg)
    time.sleep(configurations.configurations['application']['loop_interval'])

    self.counter += 1

  #   topics = configurations.configurations['application']['publish_in']

  #   temp, hum = self.temp_hum_sensor()
  #   print('Publishing on topic {0} = {1} '.format(topics[0], temp))

  #   Amot.proxy().publish(topics, temp)

  #   print('Loop interval = {}'.format(configurations.configurations['application']['loop_interval']))
  #   time.sleep(configurations.configurations['application']['loop_interval'])

  # def temp_hum_sensor(self):
  #   try:
  #     temp = 30.0 * r.random()
  #     hum = 30.0 * r.random()
  #     if (isinstance(temp, float) and isinstance(hum, float)) or (isinstance(temp, int) and isinstance(hum, int)):
  #       temp = b'%3.1f' % temp
  #       hum = b'%.1f' % hum
  #       return temp, hum
  #     else:
  #       return 'Invalid sensor reading'
  #   except OSError as e:
  #     return 'Failed to read sensor.'
  def _distance_cm(self):
    try:
      distance = r.randint(1, 100)
      if (isinstance(distance, float) or isinstance(distance, int)):
        distance = distance
        return distance
      else:
        return 'Invalid sensor reading'
    except OSError as e:
      return 'Failed to read sensor.'
    
  def reservoirVolume(self, DEEP_HEIGHT, reservoirArea):
    distance = self._distance_cm()
    currentDistance = DEEP_HEIGHT - (distance - MINIMUM_SENSOR_RANGE) # currente tank range in [cm]
    currentVolumeCM = (reservoirArea * currentDistance) # valume of tank in [cm^3]
    currentVolumeLiters = currentVolumeCM / 1000.0
    return currentVolumeLiters

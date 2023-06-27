from amot import Amot
import configurations
import time
import requests
import json
from random import randrange
import os

class App:
  def __init__(self):
    super().__init__()
    self.output_file = "messages-20s.txt"

  def setup(self):
    try:
      Amot.proxy().subscribe('water-level')
    except OSError as e:
      print('Error < {0} > Subscriber not subscribe on the Broker'.format(str(e))) 
    pass

  def loop(self):
    try:
      data = Amot.proxy().checkMsg('water-level')
      if data:
        if len(data['MSG']) > 0:
          # thing_id = 10
          # cLevel = int((float(data['MSG']['temperature']['volume']) / float(data['MSG']['temperature']['capacity']))*100)
          # payload = {
          #   'water': cLevel,
          #   'battery': randrange(100),
          #   }
          # print(payload)
          # data = requests.put("http://localhost:5500/api/devices/{0}".format(thing_id), json=payload)
          # print(data.json())
          # print("http://localhost:5500/api/things/{0}".format(thing_id))
          print(data['MSG'])
          txt = data['MSG']
          with open(self.output_file, "a") as f:
            f.write(str(txt) + "\n")
            #print("Message written to file.")
    except OSError as e:
      print('Error < {0} > Subscriber cannot check messages on the Broker'.format(str(e))) 

    time.sleep(configurations.configurations['application']['loop_interval'])
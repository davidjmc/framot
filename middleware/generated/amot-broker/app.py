from amot import Amot
from threading import *

import time

class App:
  def __init__(self):
    super().__init__()

  def setup(self):
    # start listen
    pass

  def loop(self):
    
    Amot.proxy().listen() # thread separada

    # Thread(target=Amot.proxy().listen()).start() #thread
    
    # do something

    # Thread(target=Amot.proxy().listen()).start() #thread
    #print('let me sleep')
    #time.sleep(5)
    pass
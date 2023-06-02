import machine
import ubinascii
from umqtt.simple import MQTTClient
import time

from agent import AmotAgent

global start

configs ={
    'THING_ID': 'pcoap', # thing_id,
    'AMOT_HOST': '172.22.64.193',
    'AMOT_PORT': 60010,
    'START_TIME': start
    }

def restart_and_reconnect():
    print('Failed to start the device. Reconnecting...')
    time.sleep(20)
    machine.reset()

try:
    global thing_ip
    # = '192.168.44.101'

    if machine.reset_cause() == machine.DEEPSLEEP_RESET:
        print('Woke from a deep sleep')
        
        # starting the device
        AmotAgent._env = configs
        # AmotAgent.thingStart()
        
        from amot import AmotEngine
        from app import App

        # executing the device's system
        AmotEngine.setInstanceWith(thing_ip, AmotAgent, configs)
        AmotEngine.getInstance().run(App())

    else:
        print('Power on or Hard reset')
    
         # starting the device
        AmotAgent._env = configs
        AmotAgent.thingStart()
        
        from amot import AmotEngine
        from app import App
        
        # executing the device's system
        AmotEngine.setInstanceWith(thing_ip, AmotAgent, configs)
        AmotEngine.getInstance().run(App())

except OSError as e:
    restart_and_reconnect()

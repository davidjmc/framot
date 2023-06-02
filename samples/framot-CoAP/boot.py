# This file is executed on every boot (including wake-boot from deepsleep)
import uos, machine
import gc
gc.collect()
gc.mem_alloc()

#
import network, ubinascii, time, utime

start = time.time()
# print('start time = {}'.format(start))

# set the local area network configuration
#SSID='MULTILASER 1200AC 2.4G'
#PASSWORD='123456789'

# SSID='Redmi Note 8 Pro'
# PASSWORD='12345678'

SSID='CINGUESTS'
PASSWORD='acessocin'

thing = network.WLAN(network.STA_IF)
if not thing.isconnected():
  print('Connecting to local area network...')
  thing.active(True)
  thing.connect(SSID, PASSWORD)
while not thing.isconnected():
  pass
print('Connection sucessful')
print('Network config: {}'.format(thing.ifconfig()))


# get the thing network IP 
thing_ip = thing.ifconfig()[0]

# get the thing unique ID
thing_id = str(ubinascii.hexlify(machine.unique_id()), 'ascii')

#gc.collect()

#from AMoTAgent import AmotAgent
#AmotAgent.thingStart(thing_id)

#gc.collect()

#from AMoTEngine import AmotEngine
#AmotEngine(thing_ip).run()



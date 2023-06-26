# from AMoTAgent import AmotAgent

from agent import AmotAgent

# import micropython
# micropython.alloc_emergency_exception_buf(100)

# _env = {}
# with open('env.ini', 'r') as f:
#   for line in f:
#     if line.strip() == '':
#       continue
#     [key, val] = [p.strip() for p in line.split('=')]
#     _env[key] = val

configs ={
    'THING_ID': '10', # thing_id, get from thing
    
    'AMOT_HOST': '192.168.1.16',
    'AMOT_PORT': 60010
    }

AmotAgent._env = configs
AmotAgent.thingStart()

import socket
ip = ''
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
try:
    # doesn't even have to be reachable
    s.connect(('10.255.255.255', 1))
    ip = s.getsockname()[0]
except:
    ip = '127.0.0.1'
finally:
    s.close()

from app import App
from amot import AmotEngine

AmotEngine.setInstanceWith(ip, AmotAgent, configs)
AmotEngine.getInstance().run(App())
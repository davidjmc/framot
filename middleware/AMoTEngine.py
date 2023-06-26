import time, gc, socket, os

# import datetime
import config as config
# from app import App
# import sys

try:
  import adl as adl
#   import appVars as appVars
except:
  # fooling the IDE
  pass

# from AMoTAgent import AmotAgent


class Amot:
  @staticmethod
  def config(conf):
    return AmotEngine.getInstance().config(conf)

  @staticmethod
  def proxy():
    return AmotEngine.getInstance().starter()

  @staticmethod
  def attached(component):
    return AmotEngine.getInstance().attached(component)

  @staticmethod
  def env(data):
    return AmotEngine.getInstance().env.get(data)


class AmotEngine:
  _instance = None

  @staticmethod
  def setInstanceWith(ip, env):
    if AmotEngine._instance == None:
      AmotEngine._instance = AmotEngine(ip, env)

  @staticmethod
  def getInstance():
    # if Amot.instance == None:
    #   Amot.instance = Amot()
    return AmotEngine._instance

  def __init__(self, ip, env):
    self.ip = ip
    self.env = env

    self.current_components = self.loadComponents()
    self.attachments = adl.adl['attachments']
    self.configuration = adl.adl['configuration']

    self.last_adaptation = time.time()

    self.app = None

  def loadComponents(self):
    current_components = {}
    components = adl.adl['components']
    for component in components:
      component_file = components.get(component)
      namespace = __import__('components.' + component_file)
      component_module = getattr(namespace, component_file)
      # component_module.__dict__['AmotEngine'] = self
      # setattr(component_module, 'Amot', self)
      # setattr(component_module, 'appVars', appVars)
      component_instance = getattr(component_module, component)
      current_components[component] = component_instance()
    return current_components

  def run(self, app):
    self.app = app
    self.app.setup()
    while True:
      try:
        self.app.loop()
        # self.checkAdaptation()
      except OSError as e:
        print(e)
        self.restart_and_reconnect()

  # TODO
  # def checkAdaptation(self):
  #   if (self.adaptability['type'] != '' and (time.time() - self.last_adaptation) > self.adaptability['timeout']):
  #     # it will adapt
  #     # self.adaptation_executor.run()
  #     updated = AmotAgent.adapt()
  #     if updated:
  #       self.reload_components()
  #     self.last_adaptation = time.time()

  def config(self, conf):
    return config.app[conf]

  def starter(self):
    return self.current_components[self.configuration['start']]

  def attached(self, component):
    class_name = component.__class__.__name__
    next_class = self.attachments.get(class_name)
    next_object = self.current_components[next_class]
    return next_object


import os
import socket
import time

class AmotAgent:

    app_context = {}
    env_context = {}
    _env = {}

    @staticmethod
    def send_receive(socket, data):
        buffer_size = 536
        response = b''
        try:
            socket.sendall(data)
            while True:
                part = socket.recv(buffer_size)
                response += part
                if len(part) < buffer_size:
                    break
            if response == b'0':
                return None
            elif response == b'':
                # TODO look for a better exception
                raise OSError
            return response
        except OSError as e:
            print('Cant send or receive data')
            socket.close()
            return False

    @staticmethod
    def update_files(data, clear = True): # data should be a string
        if clear:
            # clear directory
            files = os.listdir('components')
            for file in files:
                path = 'components/' + file
                try:
                    f = open(path, "r")
                    f.close()
                    os.remove(path)
                except OSError:
                   pass

        # writing files from data
        files = data.split('\x1c') # FILE SEPARATOR (28)
        for comp_content in files:
            compname, content = comp_content.split('\x1d') # GROUP SEPARATOR (29)
            file = compname + '.py'
            wr = open(file, 'w')
            wr.write(content)
            wr.close()

    # @staticmethod
    # def adapt():
    #     import adl
    #     print('adapting...')

    #     if adl.Adaptability['type'] not in ['', None]:

    #         AmotAgent.env_context['battery'] = b'100'

    #         try:
    #             conn = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    #             conn.connect(socket.getaddrinfo(cfg.server['host'], cfg.server['port'])[0][-1])
    #         except:
    #             print('could not create socket for adaptation')
    #             return False

    #         msg = b'ADAPT\nThing:' + bytes(cfg.thing['id'], 'ascii')
    #         for info in AmotAgent.app_context:
    #             msg += b'\n' + bytes(info, 'ascii') + b':' + AmotAgent.app_context[info]
    #         for info in AmotAgent.env_context:
    #             msg += b'\n' + bytes(info, 'ascii') + b':' + AmotAgent.env_context[info]
    #         print(msg)
    #         data = AmotAgent.send_receive(conn, msg)
    #         data = str(data, 'ascii')
    #         if data == None:
    #             return

    #         # headers => "instructions" from server
    #         # data => files with their names
    #         [headers, data] = data.split('\x1e')
    #         headers = [h for h in headers.split('\n')]
    #         for h in headers:
    #             print(h)
    #             if h[:3] == 'rm:':
    #                 # remove a file
    #                 file_to_remove = h[3:]
    #                 try:
    #                     os.remove(file_to_remove)
    #                 except Exception as e:
    #                     pass

    #         if len(data) > 0:
    #             AmotAgent.update_files(data, False)
    #             print('adaptou')
    #             return True

    #     return False


    @staticmethod
    def thingStart():
        print('running agent')
        # connecting to server
        conn = None
        for i in range(5):
            try:
                conn = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                conn.connect(socket.getaddrinfo(AmotAgent._env['SERVER_HOST'], AmotAgent._env['SERVER_PORT'])[0][-1])
                break
            except:
                conn = None
                time.sleep(1)
                print('error')

        if conn is None:
            return

        # sending data
        # msg = b'START\nThing:soueu\nComponents:' + b','.join([bytes(c, 'ascii') for c in components])
        msg = b'START_NEW\nThing:' + bytes(AmotAgent._env['THING_ID'], 'ascii')
        data = AmotAgent.send_receive(conn, msg)

        data = str(data, 'ascii')
        try:
            [headers, data] = data.split('\x1e')
        except:
            pass
        AmotAgent.update_files(data)



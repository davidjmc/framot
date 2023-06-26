import os

try:
    import machine
except:
    pass

import variables as config

try:
    import utime as time
except:
    import time

try:
    import configurations
except:
    pass

try:
  import adl as adl
except:
  # fooling the IDE
  pass


class Amot:
    
    @staticmethod
    def configApp(conf):
        return AmotEngine.getInstance().config(conf, mode='App')
    
    @staticmethod
    def configEnv(conf):
        return AmotEngine.getInstance().config(conf, mode='Env')
    
    @staticmethod
    def proxy():
        return AmotEngine.getInstance().starter()

    @staticmethod
    def attached(component):
        return AmotEngine.getInstance().attached(component)

    @staticmethod
    def env(data):
        return AmotEngine.getInstance().conf.get(data)


class AmotEngine:
    _instance = None

    @staticmethod
    def setInstanceWith(ip, agent, conf):
        if AmotEngine._instance == None:
            AmotEngine._instance = AmotEngine(ip, agent, conf)

    @staticmethod
    def getInstance():
    # if Amot.instance == None:
    #   Amot.instance = Amot()
        return AmotEngine._instance
    
    #
    def config(self, conf, mode):
        if mode == 'App':
            return configurations.configurations['application'][conf]
        elif mode == 'Env':
            # return config.env[conf]
            return configurations.configurations['environment'][conf]
        else:
            # return config.mote[conf]
            return configurations.configurations['device'][conf]
        
    #
    def starter(self):
        return self.current_components[self.configuration['start']]
    
    #
    def attached(self, component):
        class_name = component.__class__.__name__
        next_class = self.attachments.get(class_name)
        next_object = self.current_components[next_class]
        return next_object
    
    @staticmethod
    def setAdaptationTime():
        from ntptime import settime # NTP Server
        settime()
        rtc = machine.RTC()
        tm = time.time()
        adaptation_time = (tm-10800)
        d = {1: adaptation_time} 
        rtc.memory(ujson.dumps(d))
        
    @staticmethod
    def getAdaptationTime():
        rtc = machine.RTC()
        r = ujson.loads(rtc.memory())
        print(r)
        return r['1']
    
    @staticmethod
    def restartAndReconnect():
        print('Failed to start the device. Reconnecting...')
        time.sleep(5)
        machine.reset()
        
    def deepSleep(self, msecs):
        # configure RTC.ALARM0 to be able to wake the device
        rtc = machine.RTC()
        rtc.irq(trigger=rtc.ALARM0, wake=machine.DEEPSLEEP)
        # set RTC.ALARM0 to fire after X milliseconds (waking the device)
        rtc.alarm(rtc.ALARM0, msecs)
        # put the device to sleep
        machine.deepsleep()
    
    #
    def __init__(self, ip, agent, conf):
        self.ip = ip
        self.conf = conf
        self.app = None
        self.agent = agent
        self.last_adaptation = 0

        self.current_components = self.loadComponents()
        self.attachments = adl.adl['attachments']
        self.configuration = adl.adl['configuration']
        self.adaptability = adl.adl['adaptability']
        
    def loadComponents(self):
        current_components = {}
        components = adl.adl['components']
        for component in components:
            component_file = components.get(component)
            namespace = __import__('components.' + component_file)
            component_module = getattr(namespace, component_file)
            # component_module.__dict__['AmotEngine'] = self
            # setattr(component_module, 'Amot', self)
            setattr(component_module, 'configurations', configurations)
            component_instance = getattr(component_module, component)
            current_components[component] = component_instance()
        return current_components

    def run(self, app):
        self.app = app

        if self.last_adaptation == 0:
            self.last_adaptation = time.time()
        
        # setup function runs once to initialize the environment of the application 
        self.app.setup()
        
        # adaptation settings
        #rtc = machine.RTC()
        #r = ujson.loads(rtc.memory())
        #if r['1'] is None: 
            #AmotEngine.setAdaptationTime()
    
        while True:
            try:
                
                # application execution loop
                self.app.loop()
                
                # adaptation check
                self.checkAdaptation()
                
                # deep sleep adaptation
                # self.deepSleep(config.mote['deep_sleep_interval'])
                
            except OSError as e:
                print(e)
                AmotEngine.restartAndReconnect()

    
    def checkAdaptation(self):
        if (self.adaptability['type'] not in ['', None] 
        and (time.time() - self.last_adaptation) > self.adaptability['timeout']):
            isthere_adaptation = self.agent.adapt()
            if isthere_adaptation:
                self.reload_components()
            self.last_adaptation = time.time()



#   # TODO
#     def checkAdaptation(self):
#         print('Time before: {0}'.format(AmotEngine.getAdaptationTime()))
#         if (self.configuration['adaptability']['type'] != '' and ((time.time() - 10800) - AmotEngine.getAdaptationTime()) > self.configuration['adaptability']['timeout']):
#             print('adaptation time')
#             AmotEngine.setAdaptationTime()
#             print('Time now: {0}'.format(AmotEngine.getAdaptationTime()))
            
        #tm = (time.time() - 10800)
        
        #print('Time now: {0}'.format(tm))        
        #print('Difference: {}'.format(tm-AmotEngine.getAdaptationTime()))
        
        #if((tm - AmotEngine.getAdaptationTime()) > 20):
            #print('Adaptation time')
            #AmotEngine.setAdaptationTime(tm)
        
            #print(self.configuration['adaptability']['type'])
            #AmotEngine.setAdaptationTime(tm)
  #     # it will adapt
  #     # self.adaptation_executor.run()
  #     updated = AmotAgent.adapt()
  #     if updated:
  #       self.reload_components()
  #     self.last_adaptation = time.time()


##############################################################3



# import time, gc, socket, os


# # import datetime
# import variables as config
# # from app import App
# # import sys


# try:
#   import adl as adl
# #   import appVars as appVars
# except:
#   # fooling the IDE
#   pass

# # from AMoTAgent import AmotAgent


# class Amot:
#   @staticmethod
#   def configApp(conf):
#     return AmotEngine.getInstance().config(conf, mode='App')

#   @staticmethod
#   def configEnv(conf):
#     return AmotEngine.getInstance().config(conf, mode='Env')

#   @staticmethod
#   def proxy():
#     return AmotEngine.getInstance().starter()

#   @staticmethod
#   def attached(component):
#     return AmotEngine.getInstance().attached(component)

#   @staticmethod
#   def env(data):
#     return AmotEngine.getInstance().env.get(data)


# class AmotEngine:
#   _instance = None

#   @staticmethod
#   def setInstanceWith(ip, env):
#     if AmotEngine._instance == None:
#       AmotEngine._instance = AmotEngine(ip, env)

#   @staticmethod
#   def getInstance():
#     # if Amot.instance == None:
#     #   Amot.instance = Amot()
#     return AmotEngine._instance


#   def config(self, conf, mode):
#     if mode == 'App':
#         return config.app[conf]
#     elif mode == 'Env':
#         return config.env[conf]

#   def starter(self):
#     return self.current_components[self.configuration['start']]


#   def attached(self, component):
#     class_name = component.__class__.__name__
#     next_class = self.attachments.get(class_name)
#     next_object = self.current_components[next_class]
#     return next_object


#   def __init__(self, ip, env):
#     self.ip = ip
#     self.env = env

#     self.current_components = self.loadComponents()
#     self.attachments = adl.adl['attachments']
#     self.configuration = adl.adl['configuration']

#     self.last_adaptation = time.time()

#     self.app = None

#   def loadComponents(self):
#     current_components = {}
#     components = adl.adl['components']
#     for component in components:
#       component_file = components.get(component)
#       namespace = __import__('components.' + component_file)
#       component_module = getattr(namespace, component_file)
#       # component_module.__dict__['AmotEngine'] = self
#       # setattr(component_module, 'Amot', self)
#       # setattr(component_module, 'appVars', appVars)
#       component_instance = getattr(component_module, component)
#       current_components[component] = component_instance()
#     return current_components

#   def run(self, app):
#     self.app = app
#     self.app.setup()
#     while True:
#       try:
#         self.app.loop()
#         # self.checkAdaptation()
#       except OSError as e:
#         print(e)
#         self.restart_and_reconnect()

#   # TODO
#   # def checkAdaptation(self):
#   #   if (self.adaptability['type'] != '' and (time.time() - self.last_adaptation) > self.adaptability['timeout']):
#   #     # it will adapt
#   #     # self.adaptation_executor.run()
#   #     updated = AmotAgent.adapt()
#   #     if updated:
#   #       self.reload_components()
#   #     self.last_adaptation = time.time()



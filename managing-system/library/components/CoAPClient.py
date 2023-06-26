import network
import machine
import microcoapy

from amot import Amot

class CoAPProxy():
    def __init__(self):
        super().__init__()
        self.client = None
        self.server = None
        self.port = None
        self.client_id = None
        self.topic = None
        self.message = None
        self.retain = None
        self.callback = None
    
    def run(self, invArg):
        self.server = Amot.configEnv('broker_host')
        self.port = Amot.configEnv('broker_port')
        self.client_id = invArg['THING_ID']

        print("server = {}, port = {}".format(self.server, self.port))

        if invArg['OP'] == 'Connect':
            self.connect()
        else:
            if self.client is None:
                self.connect()

            if invArg['OP'] == 'Post':
                try:
                    for topic in invArg['TOPICS']:
                        print('topic = {} and msg = {}'.format(topic, invArg['MSG']))
                        messageId = self.client.post(self.server, self.port, topic, invArg['MSG'],
                        None, microcoapy.COAP_CONTENT_FORMAT.COAP_TEXT_PLAIN)
                        print("[POST] Message Id: ", messageId)
                        self.client.stop() # uncomment if you use deep sleep
                except OSError as e:
                    print(e)
        
            elif invArg['OP'] == 'Get':
                try:
                    for topic in invArg['TOPICS']:
                        self.client.subscribe(topic)
                except OSError as e:
                    print(e)

            elif invArg['OP'] == 'CheckMsg':
                try:
                    #self.client.check_msg() #non-bloking
                    self.client.wait_msg() # bloking
                    #print('Message checked!')
                except:
                    self.client.on_message = self.on_message
                    # print('Check new message: {}'.format(self.message))
                    # print('Check retaion: {}'.format(self.retain))
                    self.client.loop()
            
        
    def connect(self):
        try:
            self.client = microcoapy.Coap()
            self.client.discardRetransmissions = True
            #client.debug = False
            # setup callback for incoming response to a request
            self.client.responseCallback = self.receivedMessageCallback

            # Starting CoAP...
            self.client.start()
            
        except OSError as e:
            print(e)
    
    def receivedMessageCallback(self, packet, sender):
        print('Message received:', packet.toString(), ', from: ', sender)
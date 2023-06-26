from amot import Amot
from MessageStorage import MessageStorage
from SubscriptionsManager import SubscriptionsManager

class BrokerEngine():
    def __init__(self):
        super().__init__()
        self.message_storage = MessageStorage()
        self.subscription_manager = SubscriptionsManager()
        

    def run(self, invArg):
        if invArg['OP'] == 'Publish':
            for topic in invArg['TOPICS']:
                self.message_storage.add_message(topic, invArg['MSG'])
                # print("Messages: {}".format(self.message_storage.get_message_by_topic(topic)))
                message = self.message_storage.get_message_by_topic(topic).popleft()

                # print("Subscriptions: {}".format(self.subscription_manager.get_subscriptions()))
                for subscription in self.subscription_manager.get_subscriptions().keys():
                    if topic in self.subscription_manager.get_subscriptions()[subscription].keys():
                        self.subscription_manager.get_subscriptions()[subscription][topic].append(message)
            pass
        
        elif invArg['OP'] == 'Subscribe':
            for topic in invArg['TOPICS']:
                self.subscription_manager.insert_subscription(topic, invArg['THING_ID'], invArg['MSG'])
                # print(self.subscription_manager.subcriptions)
            pass
        
        elif invArg['OP'] == 'CheckMsg':
            msg = {}
            # print("Inside checkMsg:")
            # print(invArg)
            # print("Subscriptions: {}".format(self.subscription_manager.get_subscriptions()))
            thing_id = invArg['THING_ID']
            topics = invArg['TOPICS']

            if thing_id in self.subscription_manager.get_subscriptions().keys():
                for topic in topics:
                    if topic in self.subscription_manager.get_subscriptions()[thing_id].keys():
                        if self.subscription_manager.get_subscriptions()[thing_id][topic]: 
                            msg[topic] = self.subscription_manager.get_subscriptions()[thing_id][topic].popleft()

            # print("Topics by id: {}".format(self.subscription_manager.get_subscriptions()[invArg['THING_ID']]))

            # for topic in invArg['TOPICS']: 
            
            # aa = self.subscription_manager.remove_subscription()
            # thing = self.subscription_manager.get_subscriptions()[invArg['THING_ID']]
            #print("thing on the checkmsg: {}".format(thing.keys()))
            # print("from client: {}".format(thing.pop(0)))
            reply = {'OP': '', 'THING_ID': thing_id, 'TOPICS': '', 'MSG': msg} 
            # reply = {'OP': '', 'THING_ID': thing_id, 'TOPICS': 'temp', 'MSG': msg} 
            return reply
        
        else:
            print(
                'Broker engine :: Operation ' +
                str(invArg['OP']) +
                ' is not implemented by AMoT Engine'
            )
            

    
        
            
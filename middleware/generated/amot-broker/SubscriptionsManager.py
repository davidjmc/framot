from collections import deque
from SubscriptionStorage import SubscriptionStorage


class SubscriptionsManager:

    def __init__(self):
        # self.subcriptions = {}
        self.subscription_storage = SubscriptionStorage()

    
    def obter_subscription(self):
        return "Oii"


    def insert_subscription(self, topic, thing_id, address):
        # thing = {}
        # thing[thing_id] = {'ip': None, 'port': None}
        self.subscription_storage.add_subscription(thing_id, topic)
        

    def remove_subscription(self):
        return "Oiii"

    def get_subscriptions(self):
        return self.subscription_storage.get_subscriptions()
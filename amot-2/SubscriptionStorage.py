from collections import deque

class SubscriptionStorage:

    def __init__(self):
        self.subcriptions = {}

    def add_subscription(self, thing_id, topic):
        if topic in self.subcriptions.keys(): 
            self.subcriptions[topic].append(thing_id)
        else:
            self.subcriptions[topic] = deque([thing_id], maxlen=20)
        print("subscriptions in subscription storage: {}".format(self.subcriptions))

    def get_subscriptions(self):
        return self.subcriptions

from collections import deque

class SubscriptionStorage:

    def __init__(self):
        self.subcriptions = {}
        self.topics = {}

    def add_subscription(self, thing_id, topic):
        if thing_id in self.subcriptions.keys():
            if not self.subcriptions[thing_id].get(topic): 
                self.subcriptions[thing_id][topic] = deque([], maxlen=20)
        else:
            self.topics[topic] = deque([], maxlen=20)
            self.subcriptions[thing_id] = self.topics
        print("subscriptions in subscription storage: {}".format(self.subcriptions))

    def get_subscriptions(self):
        return self.subcriptions

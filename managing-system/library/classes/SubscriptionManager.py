from collections import deque

class SubscriptionManager:

    def __init__(self):
        self.subscribers = {}

    def add_subscriber(self, topic, address):
        if topic in self.subscribers.keys():
            if address not in self.subscribers[topic]:
                self.subscribers[topic].append(address)
        else:
            self.subscribers[topic] = deque([address], maxlen=20)

    def keep_subscribers(self, topic, keep):
        if topic not in self.subscribers.keys():
            return
        remove = []
        for subscriber in self.subscribers[topic]:
            if subscriber not in keep:
                remove.append(subscriber)

        for subscriber in remove:
            self.remove_subscriber(topic, subscriber)

    def remove_subscriber(self, topic, subscriber):
        if subscriber in self.subscribers[topic]:
            self.subscribers[topic].remove(subscriber)

    def filter_subscribers(self, topic):
        subs = []
        if topic in self.subscribers.keys():
            subs = self.subscribers[topic]
        return subs
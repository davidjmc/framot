from collections import deque

class MessageStorage:

    def __init__(self):
        self.topics = {}

    
    def add_message(self, topic, message):
        if topic in self.topics.keys():
            self.topics[topic].append(message)
        else:
            self.topics[topic] = deque([message], maxlen=20)

    
    def get_message_by_topic(self, topic):
        if topic in self.topics.keys():
            return self.topics[topic]


from amot import Amot

class QueueProxy():

    def __init__(self):
        super().__init__()

    def publish(self, topics, msg, ctx={}):
        if not type(topics) is list:
            topics = [topics]

        invocation = {
            'OP': 'Publish',
            'TOPICS': topics,
            'MSG': msg,
            'THING_ID': Amot.env('THING_ID')
        }
        return Amot.attached(self).run(invocation)
        
    def subscribe(self, topics):
        if not type(topics) is list:
            topics = [topics]
        invocation = {
            'OP': 'Subscribe',
            'TOPICS': topics,
            'THING_ID': Amot.env('THING_ID')
        }
        return Amot.attached(self).run(invocation)
        pass

    # def unsubscribe(self, topic):
    #     pass

    def checkMsg(self, topics):
        if not type(topics) is list:
            topics = [topics]
            
        invocation = {
            'OP': 'CheckMsg',
            'TOPICS': topics,
            'THING_ID': Amot.env('THING_ID')
        }
        return Amot.attached(self).run(invocation)
        pass
    
    def connect(self):
        invocation = {
            'OP': 'Connect',
            'THING_ID': Amot.env('THING_ID')
        }
        return Amot.attached(self).run(invocation)

    def post(self, topics, msg, ctx={}):
        if not type(topics) is list:
            topics = [topics]
        invocation = {
            'OP': 'Post',
            'TOPICS': topics,
            'MSG': msg,
            'THING_ID': Amot.env('THING_ID')
        }
        return Amot.attached(self).run(invocation)


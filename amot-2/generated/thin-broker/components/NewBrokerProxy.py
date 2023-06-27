from amot import Amot

class BrokerProxy():

    def __init__(self):
        super().__init__()

    def listen(self):
        Amot.attached(self).run()
        pass

    # def publish(self, topics, msg):
    #     '''
    #     Publishes a message
    #     Parameters:
    #         topics (array(string)): topic where message will be put
    #         msg (string|dict): message to be sent
    #     '''
    #     # print('proxy', topics, msg)
    #     if not type(topics) is list:
    #         topics = [topics]

    #     invocation = {
    #         'OP': 'Publish',
    #         'TOPICS': topics,
    #         'MSG': msg,
    #         'THING_ID': Amot.env('THING_ID')
    #     }
    #     return Amot.attached(self).run(invocation)

    # def subscribe(self, topics):
    #     if not type(topics) is list:
    #         topics = [topics]
    #     invocation = {
    #         'OP': 'Subscribe',
    #         'TOPICS': topics,
    #         'THING_ID': Amot.env('THING_ID')
    #     }
    #     return Amot.attached(self).run(invocation)
    #     pass

    # def unsubscribe(self, topic):
    #     pass

    # def checkMsg(self):
    #     msg = {
    #         'OP':'CheckMsg',
    #         'THING_ID': Amot.env('THING_ID')
    #     }
    #     return Amot.attached(self).run(msg)
    #     pass

    # def run(self, *args):
    #     message = None
    #     ip = AmotEngine._broker['host']
    #     port = AmotEngine._broker['port']

    #     if args[0] == b'Publish':
    #         message = {'op': args[0], 'topic': args[1], 'thing': args[2], 'msg': args[3]}
    #     elif args[0] == b'Subscribe':
    #         ip_port = bytes(AmotEngine.ip, 'ascii') + b' ' + bytes(str(AmotEngine._listen['port']), 'ascii')
    #         message = {'op': args[0], 'topic': args[1], 'thing': args[2], 'msg': ip_port}
    #     elif args[0] == b'Unsubscribe':
    #         #TODO
    #         pass
    #     else:
    #         print('Notification engine :: Operation ' + args[0] + ' is not implemented by AMoT Engine')

    #     if message is None:
    #         return False

    #     return AmotEngine.attached(self).run(message, ip, port)





class NotifierProxy():

    def __init__(self):
        super().__init__()

    def run(self, topic, message, thing, address):
        message = {
            'op': b'Notify',
            'topic': topic,
            'thing': thing,
            'msg': message
        }
        (ip, port) = address

        return AmotEngine.attached(self).run(message, ip, port)

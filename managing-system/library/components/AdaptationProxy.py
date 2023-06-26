
class AdaptationProxy():

    def __init__(self):
        super().__init__()

    def run(self, adaptability, message, ip, port):
        message = {
            'op': b'Adapt',
            'topic': adaptability,
            'msg': message
        }

        return AmotEngine.attached(self).run(message, ip, port)

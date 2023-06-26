
class Notifier():
    def __init__(self):
        super().__init__()


    def run(self, *args):
        message = args[0]
        AmotEngine.attached(self).run(message['topic'], message['msg'], message['thing'])
        pass

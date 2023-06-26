
class Subscriptor():
    def __init__(self):
        super().__init__()

    def run(self):
        for topic in AmotEngine.subscriber_configs['topics']:
            AmotEngine.attached(self).run(b'Subscribe', topic)

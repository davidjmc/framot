import pickle


class Marshaller():

    def __init__(self):
        super().__init__()


    def run(self, *args):
        message_obj, ip, port = args

        serialized = pickle.dumps(message_obj)
        serialized = b'pk1' + serialized

        return AmotEngine.attached(self).run(serialized, ip, port)
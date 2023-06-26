
class Marshaller():
    def __init__(self):
        super().__init__()

    def run(self, *args):
        message_obj, ip, port = args

        serialized = b'Op:' + message_obj['op'] + b'\n'
        serialized += b'Topic:' + message_obj['topic'] + b'\n'
        serialized += b'Thing:' + message_obj['thing'] + b'\n'
        if message_obj.get('subs_addr') is not None:
            serialized += b'Addr:' + message_obj['subs_addr'] + b'\n'

        serialized += b'\n'
        serialized += message_obj['msg']

        return AmotEngine.attached(self).run(serialized, ip, port)

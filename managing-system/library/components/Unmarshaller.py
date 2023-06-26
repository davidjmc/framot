
class Unmarshaller():
    def __init__(self):
        super().__init__()

    def run(self, *args):
        data = args[0]
        # print(data, 'aqui!!!!')
        attrs = {
            b'Op': None,
            b'Topic': None,
            b'Thing': None,
            b'Subscriber_addr': None,
            b'message': None,
        }

        attr = b''
        val = b''
        byte = 0
        while byte < len(data):
            c = data[byte]
            if c != 58: # ':'
                attr += bytes([c])
                byte += 1
                continue

            byte += 1
            c = data[byte]
            while c != 10: # '\n'
                val += bytes([c])
                byte += 1
                c = data[byte]
            # end of header line
            attrs[attr] = val
            attr = b''
            val = b''
            byte += 1
            c = data[byte]
            if c == 10: # '\n', i.e., it is the end of the header
                break
        attrs[b'message'] = b''
        byte += 1
        while byte < len(data):
            attrs[b'message'] += bytes([data[byte]])
            byte += 1

        # parts = str(data, 'ascii').split('\n')
        # for part in parts:
        #     attr, value = part.split(':', 1)
        #     attrs[attr] = value
        message_obj = {
            'op': attrs[b'Op'],
            'topic': attrs[b'Topic'],
            'thing': attrs[b'Thing'],
            'msg': attrs[b'message'],
            'subs_addr': attrs[b'Subscriber_addr']
        }
        return AmotEngine.attached(self).run(message_obj)

from amot import Amot

class Marshaller():
    def __init__(self):
        super().__init__()

    def run(self, invArg):
        if invArg.get('DATA') is None: # complex data
            invocation = self.marshaller(invArg)
            response = Amot.attached(self).run(invocation)
            if type(response) != dict:
                return False
            return self.unmarshaller(response)
        else: # bytes
            invocation = self.unmarshaller(invArg)
            response = Amot.attached(self).run(invocation)
            if type(response) != dict:
                return False
            return self.marshaller(response)

    def marshaller(self, invArg):
        def toBytes(data):
            return bytes(repr(data), 'utf-8')
    
        invArg = {k: toBytes(v) for k, v in invArg.items()}

        op = invArg['OP']
        thing_id = invArg['THING_ID']
        topics = invArg.get('TOPICS')
        msg = invArg.get('MSG')

        serialized = b'OP:' + op + b'\n'
        serialized += b'THING_ID:' + thing_id + b'\n'
        serialized += b'TOPICS:' + topics + b'\n' if topics is not None else b''
        serialized += b'\n'
        serialized += msg if msg is not None else b''

        invocation = {
            'DATA': serialized
        }
        return invocation

    def unmarshaller(self, invArg):
        def fromBytes(data):
            if data is None or data == b'':
                return data
            return eval(str(data, 'utf-8'))
        
        data = invArg.get('DATA')

        attrs = {
            b'OP': None,
            b'TOPICS': None,
            b'THING_ID': None,
            b'MSG': None,
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
        attrs[b'MESSAGE'] = b''
        byte += 1
        while byte < len(data):
            attrs[b'MESSAGE'] += bytes([data[byte]])
            byte += 1

        attrs = {k: fromBytes(v) for k, v in attrs.items()}
        
        return {
            'OP': attrs[b'OP'],
            'TOPICS': attrs[b'TOPICS'],
            'THING_ID': attrs[b'THING_ID'],
            'MSG': attrs[b'MESSAGE']
        }
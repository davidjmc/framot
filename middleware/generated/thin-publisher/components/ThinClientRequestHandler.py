from amot import Amot

import socket
import select

import time

try:
    import utime
except:
    pass


class ClientRequestHandler():

    def __init__(self):
        super().__init__()
        self.socks = {}

    def run(self, invData):
        data = invData
        #data = invData['DATA']
        print(data)
        host = Amot.configEnv('broker_host')
        port = int(Amot.configEnv('broker_port'))

        addr = b':'.join([bytes(host, 'ascii'), bytes([port & 0xff]), bytes([(port >> 8) & 0xff])])
        poll = select.poll()

        if self.socks.get(addr) is None:
            self.socks[addr] = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            if port == 0:
                port = 60000
            try:
                self.socks[addr].connect(socket.getaddrinfo(host, port)[0][-1])
                if Amot.configEnv('await_broker_response') == '1':
                    self.socks[addr].setblocking(True)
                else:
                    self.socks[addr].setblocking(False)
                # if Amot.env('BROKER_TIMEOUT') is not None:
                #     print('set polling', int(Amot.env('BROKER_TIMEOUT')))
                #     self.socks[addr].setblocking(False)
                #     poll.register(self.socks[addr])

            except OSError as e:
                print('Error: ' + str(e) + 'Couldnt connect with socket-server')

        self.send(addr, data)

        # if Amot.env('BROKER_TIMEOUT') is not None:
        #     poll.poll(int(Amot.env('BROKER_TIMEOUT')))

        response = self.receive(addr)
        #self.socks[addr].close() # uncomment if you use deep sleep

        return response

    def send(self, addr, data):
        try:
            l = bytes(('0' * 10 + str(len(data)))[-10:], 'ascii')
            self.socks[addr].sendall(l + data)
        except OSError as e:
            print('Cant send data')
            self.socks[addr].close()
            self.socks[addr] = None
            return False

    def receive(self, addr):
        buffer_size = 536
        response = b''
        try:
            while True:
                part = self.socks[addr].recv(buffer_size)
                response += part
                if len(part) < buffer_size:
                    break
            if response == b'0':
                return True
            elif response == b'':
                # TODO look for a better exception
                # raise OSError
                return False
        except:
            return False
        return {'DATA': response}
import socket, select

from amot import Amot

class ServerRequestHandler():
    def __init__(self):
        super().__init__()
        self.server_sock = None
        self.address = None
        self.connection = None
        self.message = None
        self.sources = []
        self.destinations = []
        self.messages_queues = {}
        self.ip = None

    def run(self):
        try:
            if self.server_sock is None:
                self.server_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                self.server_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                self.server_sock.settimeout(None)
                self.address = socket.getaddrinfo(Amot.configEnv('broker_host'), Amot.configEnv('broker_port'))[0][-1]

                try:
                    self.server_sock.bind(self.address)
                    print('[ Starting up on {} port {} ] >'.format(*self.address))
                    self.server_sock.listen(5)
                    self.sources = [self.server_sock]

                except OSError as e:
                    print('ServerRequestHandler Bind Error: ', e)

        except OSError as e:
            print('ServerRequestHandler Socket Error: ', e)

        readable, writeable, exceptional = select.select(self.sources, [], [])

        for s in readable:
            if s is self.server_sock:
                try:
                    connection, device = self.server_sock.accept()
                    self.server_sock.setblocking(False)
                    self.sources.append(connection)
                    readable.append(connection)
                except OSError as e:
                    print('Error when receiving data on the ServerRequestHandler: ', e)
            elif s:
                buffer_size = 536
                data = b''
                try:
                    l = s.recv(10)
                    if l == b'':
                        continue
                    l = int(l)
                    while True:
                        part = s.recv(min(l, buffer_size))
                        data += part
                        l -= buffer_size
                        if len(part) < buffer_size:
                            break
                except OSError as e:
                    print('LOGGGGGGGGGGGGGG = {0}'.format(e))
                    self.sources.remove(s)
                    continue

                if data:
                    response = Amot.attached(self).run({
                        'DATA': data
                    })
                    if not response: 
                        response = {'DATA' : b'0'} # response = b'0'
                    try:
                        s.sendall(response['DATA']) # response['DATA']
                    except:
                        pass
                else:
                    self.sources.remove(s)
                    
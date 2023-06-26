import socket, select

from datetime import datetime
import time


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

    def run(self, *args):
        try:
            if self.server_sock is None:
                self.server_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                self.server_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                timeout = AmotEngine._listen['timeout']
                if timeout is not None:
                    timeout = timeout / 1000.0
                self.server_sock.settimeout(timeout)
                self.address = socket.getaddrinfo(AmotEngine.ip, AmotEngine._listen['port'])[0][-1]

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
                # print(':::T0:::', datetime.now().timestamp())
                buffer_size = 536
                data = b''
                try:
                    while True:
                        part = s.recv(buffer_size)
                        data += part
                        if len(part) < buffer_size:
                            break
                except OSError as e:
                    self.sources.remove(s)
                    continue

                if data:
                    self.message = data
                    # print(self.message, 'aqui!!')
                    response = AmotEngine.attached(self).run(self.message)
                    if not response:
                        response = b'0'
                    s.sendall(response)
                else:
                    self.sources.remove(s)


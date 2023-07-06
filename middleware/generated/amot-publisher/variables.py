app = {
    # 'mode': 'publisher', # or subscriber or sublish_subscriber or broker
    'interval': 1,
    'topics': ['temperature', 'temp'] # and/or other topics
}

env = {
    'broker_host':'172.22.64.193',
    'broker_port': 60000,
    'await_broker_response': 1
    }

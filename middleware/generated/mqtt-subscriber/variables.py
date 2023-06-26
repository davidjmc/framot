app = {
    # 'mode': 'publisher', # or subscriber or sublish_subscriber or broker
    'interval': 2,
    'publish_in': 'notification', # and/or other topics
    'subscribe_to': 'temperature'
}

mote = {
    'id': 'pmqtt',
    'location': '',
    'deep_sleep_interval': 10000
}

env = {
    'broker_host':'10.103.189.172',
    'broker_port': 60000,
    'await_broker_response': 1
    }


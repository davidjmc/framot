app = {
    # 'mode': 'publisher', # or subscriber or sublish_subscriber or broker
    'interval': 2,
    'publish_in': ['temperature'], # and/or other topics
    'subscribe_to': ['notification']
}

mote = {
    'id': 'pmqtt',
    'location': ''
}

env = {
    'broker_host':'10.103.189.172',
    'broker_port': 60000
}
adl = {
    'components': {
        'BrokerProxy': 'NewBrokerProxy', 'ServerRequestHandler': 'ThinServerRequestHandler', 'BrokerEngine': 'ThinBrokerEngine'
    },
    'attachments': {
        'BrokerProxy':'ServerRequestHandler','ServerRequestHandler':'BrokerEngine'
    },
    'adaptability': {
        'type': '',
        'timeout': 30
    },
    'configuration': {
        'start': 'BrokerProxy',
        'otherConfigs': {}
    }
}
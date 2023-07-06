adl = {
    'components': {
        'BrokerProxy': 'NewBrokerProxy', 'Marshaller': 'NewMarshaller', 'ServerRequestHandler': 'NewServerRequestHandler', 'BrokerEngine': 'NewBrokerEngine'
    },
    'attachments': {
        'BrokerProxy':'ServerRequestHandler','ServerRequestHandler':'Marshaller','Marshaller':'BrokerEngine'
    },
    'adaptability': {
        'type': 'None',
        'timeout': None
    },
    'configuration': {
        'start': 'BrokerProxy',
        'otherConfigs': {}
    }
}
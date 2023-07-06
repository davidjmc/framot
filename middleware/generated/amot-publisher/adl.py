adl = {
    'components': {
        'QueueProxy': 'NewQueueProxy', 'Marshaller': 'NewMarshaller', 'ClientRequestHandler': 'NewClientRequestHandler'
    },
    'attachments': {
        'QueueProxy':'Marshaller','Marshaller':'ClientRequestHandler'
    },
    'adaptability': {
        'type': 'parametric',
        'timeout': 1200
    },
    'configuration': {
        'start': 'QueueProxy',
        'otherConfigs': {}
    }
}
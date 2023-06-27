adl = {
    'components': {
        'QueueProxy': 'NewQueueProxy', 'Marshaller': 'NewMarshaller', 'ClientRequestHandler': 'NewClientRequestHandler'
    },
    'attachments': {
        'QueueProxy':'Marshaller','Marshaller':'ClientRequestHandler'
    },
    'adaptability': {
        'type': 'parametric',
        'timeout': 30
    },
    'configuration': {
        'start': 'QueueProxy',
        'otherConfigs': {}
    }
}
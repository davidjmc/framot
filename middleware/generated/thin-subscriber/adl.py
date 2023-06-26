adl = {
    'components': {
        'QueueProxy': 'NewQueueProxy', 'Marshaller': 'NewMarshaller', 'ClientRequestHandler': 'NewClientRequestHandler'
    },
    'attachments': {
        'QueueProxy':'Marshaller','Marshaller':'ClientRequestHandler'
    },
    'adaptability': {
        'type': '',
        'timeout': 5
    },
    'configuration': {
        'start': 'QueueProxy',
        'otherConfigs': {}
    }
}
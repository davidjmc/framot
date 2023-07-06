adl = {
    'components': {
        'QueueProxy': 'ThinQueueProxy', 'ClientRequestHandler': 'ThinClientRequestHandler'
    },
    'attachments': {
        'QueueProxy':'ClientRequestHandler'
    },
    'adaptability': {
        'type': '',
        'timeout': 30
    },
    'configuration': {
        'start': 'QueueProxy',
        'otherConfigs': {}
    }
}
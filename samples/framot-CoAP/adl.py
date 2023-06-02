adl = {
    'components': {
        'QueueProxy': 'NewQueueProxy', 'CoAPProxy': 'CoAPClient'
    },
    'attachments': {
        'QueueProxy':'CoAPProxy'
    },
    'adaptability': {
        'type': '',
        'timeout': 1200
    },
    'configuration': {
        'start': 'QueueProxy',
        'otherConfigs': {}
    }
}
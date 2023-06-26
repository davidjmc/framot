adl = {
    'components': {
        'QueueProxy': 'NewQueueProxy', 'CoAPProxy': 'CoAPClient'
    },
    'attachments': {
        'QueueProxy':'CoAPProxy'
    },
    'adaptability': {
        'type': '',
        'timeout': 60
    },
    'configuration': {
        'start': 'QueueProxy',
        'otherConfigs': {}
    }
}
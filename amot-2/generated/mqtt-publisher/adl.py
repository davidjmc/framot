adl = {
    'components': {
        'QueueProxy': 'NewQueueProxy', 'MQTTProxy': 'MQTTClient'
    },
    'attachments': {
        'QueueProxy':'MQTTProxy'
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
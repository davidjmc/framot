adl = {
    'components': {
        'QueueProxy': 'NewQueueProxy', 'MQTTProxy': 'MQTTClient'
    },
    'attachments': {
        'QueueProxy':'MQTTProxy'
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
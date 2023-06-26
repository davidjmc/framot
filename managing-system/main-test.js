const net = require('net')

const self_port = 60010

// load classes
const Request = require('./classes/Request')
const Response = require('./classes/Response')
const ThingController = require('./classes/ThingController')


;

(async () => {
    // let request = new Request('START\nThing:1')
    let request = new Request('START_NEW\nThing:1-new\ntemperature:30')
    let response = await ThingController.getResponseFor(request)
    console.log(response.toString())
    process.exit()
})()


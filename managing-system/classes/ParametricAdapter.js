const Adapter = require('./Adapter')
const Adaptation = require('./Adaptation')
const {Engine} = require('json-rules-engine')

class ParametricAdapter extends Adapter {
    constructor(thing) {
        super(thing)
    }

    async adaptFor(request) {
        console.log(request)
        let variables = await this.monitor(request)

        let changes = await this.analyzer(variables)

        let adaptation = this.planner(changes)
        return adaptation
    }

    // return variables used in condition from request
    // TODO - be generic
    async monitor(request) {
        return {
            volume: parseFloat(request.headers['fluid_volume']),
            capacity: parseFloat(request.headers['reservoir_capacity'])
        }
    }

    // return the "command" for the correct condition based on variables
    // TODO - be generic
    async analyzer(variables) {
        const engine = new Engine()

        const dangerLevel = {
            conditions: {
                all: [{
                    fact: 'volumeInformation',
                    operator: 'lessThanInclusive',
                    value: 25
                }]
            },
            event: {
                type: 'change-collection-frequency',
                params: {
                    loop_interval: 5 //min
                }
            }
        }
        engine.addRule(dangerLevel)


        const notsafeLevel = {
            conditions: {
                all: [{
                    fact: 'volumeInformation',
                    operator: 'greaterThan',
                    value: 25
                }, {
                    fact: 'volumeInformation',
                    operator: 'lessThanInclusive',
                    value: 50
                }]
            },
            event: {
                type: 'change-collection-frequency',
                params: {
                    loop_interval: 10 //min
                }
            }

        }
        engine.addRule(notsafeLevel)


        const safeLevel = {
            conditions: {
                all: [{
                    fact: 'volumeInformation',
                    operator: 'greaterThan',
                    value: 50
                }, {
                    fact: 'volumeInformation',
                    operator: 'lessThanInclusive',
                    value: 75
                }]
            },
            event: {
                type: 'change-collection-frequency',
                params: {
                    loop_interval: 15 //min
                }
            }

        }
        engine.addRule(safeLevel)


        const peaceLevel = {
            conditions: {
                all: [{
                    fact: 'volumeInformation',
                    operator: 'greaterThan',
                    value: 75
                }]
            },
            event: {
                type: 'change-collection-frequency',
                params: {
                    loop_interval: 30 //min
                }
            }
        }
        engine.addRule(peaceLevel)


        let fact = ( (variables.volume * 100.0) / variables.capacity )

        let facts = {volumeInformation: fact}
        var ret = await engine.run(facts)
        console.log(ret.events[0])
        return ret.events[0].params

    }

    planner(changes) {
        let adaptation = new Adaptation()
        //adaptation.appVars = changes
        adaptation.configurations = changes

        return adaptation
    }
}

module.exports = ParametricAdapter
const EvolutiveAdapter = require('./EvolutiveAdapter')
const ParametricAdapter = require('./ParametricAdapter')
const ParametricsAdapter = require('./ParametricsAdapter')

class AdapterFactory {
    static for(thing, type) {
        if (type == 'evolutive') {
            return new EvolutiveAdapter(thing)
        }
        if (type == 'parametric') {
            return new ParametricAdapter(thing)
        }
        if (type == 'parametrics') {
            return new ParametricsAdapter(thing)
        }        
        return null
    }
}

module.exports = AdapterFactory
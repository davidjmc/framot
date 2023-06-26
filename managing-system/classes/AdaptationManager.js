const Adaptation = require('./Adaptation')
const AdapterFactory = require('./AdapterFactory')

class ThingAdaptation {
    constructor(thing) {
        this.thing = thing
        this.adapters = this.loadAdapters()
    }

    loadAdapters() {
        // check thing adaptation type(s)
        let adapters = this.thing.adaptability.type.map(type => {
            return AdapterFactory.for(this.thing, type)
        }).filter(adapter => !!adapter)

        // return a list of Adapter objects
        return adapters
    }

    with(request) {
        if (!this.adapters.length) {
            return null
        }
        
        let adapter = this.adapters.pop()
        let adaptation = adapter.adaptFor(request)

        this.adapters.map(adapter => {
            adaptation.merge(adapter.adaptFor(request))
        })

        return adaptation
    }
}

class AdaptationManager {
    static adapt(thing) {
        return new ThingAdaptation(thing)
    }
}

module.exports = AdaptationManager
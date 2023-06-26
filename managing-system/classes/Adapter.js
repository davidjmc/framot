// Interface (or abstract class?)
class Adapter {
    constructor(thing) {
        this.thing = thing
    }

    adaptFor(request) {
        // this must be implemented by subclasses
        // return Adaptation object
    }
}

module.exports = Adapter
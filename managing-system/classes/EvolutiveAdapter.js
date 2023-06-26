const Adapter = require('./Adapter')
const Component = require('./Component')
const Adaptation = require('./Adaptation')

class EvolutiveAdapter extends Adapter {
    constructor(thing) {
        super(thing)
        // this.knowledge = ...
    }

    async adaptFor(request) {
        let components = await this.monitor()
        let newComponents = await this.analyzer(components)
        // console.log(newComponents)
        // process.exit()
        // let unusedComponents = this.planner(newComponents)
        let adaptation = this.planner(newComponents)
        // let [newComponents, unusedComponents] = this.planner(newComponents)
        // let adaptation = this.executor(this.thing.adl(), newComponents, unusedComponents)
        return adaptation
    }

    // return thing components with multiple versions in database
    async monitor() {
        let components = {}
        // @TODO improve this call to make it more readable
        for (let comp of this.thing.components.components) {
            let versions = await comp.loadVersions()
            if (versions.length < 2) {
                continue
            }
            if (!components[comp.name]) {
                components[comp.name] = []
            }
            components[comp.name].push(...versions)
        }
        return components
    }

    // return components that should be evolved
    // this method analyze also the ignored versions
    async analyzer(availableComponents) {
        let newComponents = []
        for (let compName in availableComponents) {
            let versions = availableComponents[compName]
            versions.sort((c1, c2) => c2.version - c1.version) // sorted from most recent

            for (let component of versions) {
                // console.log(component)
                // console.log(this.thing.components.getByType(component.type))
                let isVersionGreater = component.version > this.thing.components.getByType(component.type).version
                if (!isVersionGreater) {
                    break
                }
                let isRolledBackVersion = false // @TODO (Knowledge)
                if (isVersionGreater && !isRolledBackVersion) {
                    newComponents.push(await Component.load(component._id))
                    break
                }
            }
        }
        return newComponents
    }

    // generate an "Adaptation" object with actions that should be executed by the AmotAgent on the thing
    // plan which components should be deleted from the thing
    planner(newComponents) {
        let unusedComponents = []
        this.thing.components.map(comp => {
            if (newComponents.find(c => c.type == comp.type)) {
                unusedComponents.push(comp)
            }
        })

        let adaptation = new Adaptation(newComponents, unusedComponents)
        return adaptation
    }

}

module.exports = EvolutiveAdapter
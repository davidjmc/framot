const Component = require('./Component')

class ComponentsCollection {
    constructor(components) {
        this.components = components
    }

    static async load(componentsIds) {
        let components = []
        for (let compId of componentsIds) {
            components.push(await Component.load(compId))
        }
        return new ComponentsCollection(components)
    }

    replaceByName(newComponent) {
        let compIndex = this.components.findIndex(comp => comp.name == newComponent.name)
        if (compIndex == -1) {
            // component doesn't exist
        }
        this.components[compIndex] = newComponent
    }

    getByType(type) {
        return this.components.find(c => c.type == type)
    }

    map(fn) {
        return this.components.map(fn)
    }

    // async mapAsync(fn) {
    //     return await this.components.map(fn)
    // }
}

module.exports = ComponentsCollection
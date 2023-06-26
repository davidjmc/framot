class Adaptation {
    constructor(componentsToAdd = [], componentsToRemove = [], appVars = null, configurations = '') {
        this.adl = ''
        this.componentsToAdd = componentsToAdd
        this.componentsToRemove = componentsToRemove
        this.appVars = appVars
        this.configurations = configurations
        // this.newAdl = ''
    }

    merge(adaptation) {
        // TODO
    }

    hasChanges() {
        return this.componentsToAdd.length > 0 || this.componentsToRemove.length > 0 || this.appVars != null || this.configurations != ''
    }
}

module.exports = Adaptation
const { components, things } = require('../firebase')
const fs = require('fs')

class DB {
    static async getComponent(id) {
        let component = await components().doc(id).get()
        if (!component.exists) {
            throw `Component ${id} does not exist`
        }
        return component.data()
    }

    static async getComponentsByName(name) {
        // console.log('getting components for ' + name)
        let snapshot = await components().where('name', '==', name).get()
        // console.log(snapshot)
        let list = []
        await snapshot.forEach(c => {
            let component = c.data()
            component._id = c.id
            list.push(component)
        })
        return list
    }

    static async getThing(id) {
        let thing = await things().doc(id).get()
        if (!thing.exists) {
            throw `Thing ${id} does not exist`
        }
        return thing.data()
    }

    // static async getThingRolledBack(id) {
    //     let thingDoc = await things().doc(id)
    //     if (!(await thingDoc.get()).exists) {
    //         throw `Thing ${id} does not exist`
    //     }
    //     let rolledBack = thingDoc.collection('rolledBack')
    //     console.log((await rolledBack.get()))
    // }

    static async saveThing(thing) {
        console.log('Save thing')
        console.log(thing.configurations)
        await things().doc(thing.id).update({
            components: thing.components.map(c => c.id),
            attachments: thing.attachments.map(a => ({
                from: a.from.type,
                to: a.to.type
            })),
            starter: thing.starter.map(c => c.type),
            trialMode: thing.trialMode,
            vars: thing.vars,
            'configurations': {
                'application': thing.configurations.application,
                'device': thing.configurations.device,
                'environment': thing.configurations.environment
            }
        }, { depth: 4 })
    }

    static async backupThing(id) {
        let thingDoc = await things().doc(id)
        if (!(await thingDoc.get()).exists) {
            throw `Thing ${id} does not exist`
        }
        let thing = (await thingDoc.get()).data()
        await things().doc(id).update({
            'backup': {
                'components': thing.components,
                'attachments': thing.attachments,
                'starter': thing.starter
            }
        })
    }

    static async rollbackThing(id) {
        let thingDoc = await things().doc(id)
        if (!(await thingDoc.get()).exists) {
            throw `Thing ${id} does not exist`
        }
        let thing = (await thingDoc.get()).data()

        // saving current version to rolledBack
        let rolledBack = thingDoc.collection('rolledBack')
        await rolledBack.doc('' + new Date().getTime()).set({
            'components': thing.components,
            'attachments': thing.attachments,
            'starter': thing.starter
        })

        if (!thing.backup) {
            throw `Cannot rollback without a backup (thing ${id})`
        }
        await thingDoc.update({
            'components': thing.backup.components,
            'attachments': thing.backup.attachments,
            'starter': thing.backup.starter,
            'trialMode': false
        })
    }

    static async getFile(filename, path = 'components') {
        // DEBUG
        let bases = ['../library', './library']
        for (let base of bases) {
            if (fs.existsSync(`${base}/${path}/${filename}.py`)) {
                return fs.readFileSync(`${base}/${path}/${filename}.py`)
            }
        }
        throw `File ${filename}.py does not exists`
    }
}

module.exports = DB

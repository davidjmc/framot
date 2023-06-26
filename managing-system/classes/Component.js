const DB = require('./DB')
const Dependency = require('./Dependency')

class Component {
    constructor(id, name, version, type, filename) {
        this.id           = id
        this.name         = name
        this.version      = version
        this.type         = type
        this.filename     = filename
        this.file         = null
        this.dependencies = []
    }

    static async load(id) {
        let componentDoc = await DB.getComponent(id)
        let component = new Component(
            id,
            componentDoc.name,
            componentDoc.version,
            componentDoc.type,
            componentDoc.file
        )
        await component.loadFile()
        await component.loadDependencies()
        return component
    }

    async loadVersions() {
        // console.log('loadVersions')
        return await DB.getComponentsByName(this.name)
        // console.log('loaded')
        // return comps
    }

    async loadFile() {
        this.file = await DB.getFile(this.filename)
    }

    async loadDependencies() {
        await (''+this.file).split('\n').forEach(async loc => {
            let _import = null
            let dependency = ''

            _import = loc.match(/import (.*)/)
            if (_import) {
                dependency = _import[1]
            }

            _import = loc.match(/from (?:.*)? import (.*)/)
            if (_import) {
                dependency = _import[1]
            }

            if (!dependency) {
                return
            }
            let data = null
            try {
                data = await DB.getFile(dependency, 'classes')
            } catch (e) {
                // console.log(e)
            }
            if (data) {
                this.dependencies.push(new Dependency(dependency, data))
            }
        })
    }
}

module.exports = Component

// (async () => {
//     // console.dir(await Component.load('NotificationConsumer-1.0'), {depth: 2})
//     let c = await Component.load('TemperatureChecker-1.0')
//     console.log(c)
//     console.dir(await c.loadVersions(), {depth: 2})
//     process.exit()
// })()
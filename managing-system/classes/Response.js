const Thing = require('./Thing')

class Response {
    constructor(headers = '', body = '') {
        this.headers = headers
        this.body = body

        this.files = []
        this.functions = []
    }

    addFile(filename, data) {
        this.files.push({
            filename,
            data
        })
    }

    addFunction(fn, parameters) {
        this.functions.push({
            name: fn,
            parameters: parameters
        })
    }

    toString() {
        this.headers = this.functions.map(fn => {
            return `${fn.name}:${fn.parameters}`
        }).join('\n')

        this.body = this.files.map(file => {
            return `${file.filename}${String.fromCharCode(0x1d)}${file.data}`
        }).join(String.fromCharCode(0x1c))

        return `${this.headers}${String.fromCharCode(0x1e)}${this.body}`
    }

    static from(some) {
        if (some instanceof Thing) {
            return Response.fromThing(some)
        }
    }

    static fromThing(thing) {
        let response = new Response()
        response.addFile('adl', thing.adl())
        // response.addFile('appVars', thing.appVars())
        response.addFile('configurations', thing.configuration()) // add now
        thing.components.map(component => {
            response.addFile('components/' + component.filename, component.file.toString())
            component.dependencies.map(dep => {
                response.addFile(dep.filename, dep.file)
            })
        })
        return response
    }

    static fromAdaptation(thing, adaptation) {
        let response = new Response()
        if (!adaptation) {
            return response
        }
        // response.addFile('adl', thing.adl())
        // response.addFile('appVars', adaptation.appVars)
        response.addFile('configurations', thing.configuration())
        adaptation.componentsToAdd.map(component => {
            response.addFile('components/' + component.filename, component.file.toString())
        })
        adaptation.componentsToRemove.map(component => {
            response.addFunction('rm', 'components/' + component.filename + '.py')
        })

        // response.addFile('config', adaptation.configFile())

        return response
    }
}

module.exports = Response
const fs = require('fs')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

let loadThing = thing_id => {
    let thing = db.get('things').find({"id": thing_id}).value()

    if (true || !thing._components?.[0]?.type) {
        thing._components = thing.components.map(c => db.get('components').find({'id': c}).value())
    }
    if (true || !thing._attachments?.[0]?.type) {
        thing._attachments = thing.attachments.map(a => {
            return {
                "from": thing._components.find(c => c.type == a.from),
                "to": thing._components.find(c => c.type == a.to)
            }
        })
    }
    if (true || !thing._starter?.[0]?.length) {
        thing._starter = thing.starter.map(s => thing._components.find(c => c.type == s))
    }
    db.write()
    return thing
}

readComponents = components => {
    let response = []
    components.forEach(comp => {
        // console.log(comp)
        if (!fs.existsSync(`./library/components/${comp.file}.py`))
            return
        let data = fs.readFileSync(`./library/components/${comp.file}.py`)
        response.push('components/' + comp.file + String.fromCharCode(0x1d) + data);

        (''+data).split('\n').forEach(loc => {
            let _import = null
            let dependency = ''

            _import = loc.match(/import (.*)/)
            // console.log(_import)
            if (_import) {
                dependency = _import[1]
            }

            _import = loc.match(/from (?:.*)? import (.*)/)
            if (_import) {
                dependency = _import[1]
            }
            if (dependency) {
                console.log('dep: ' + dependency)
            }

            if (!fs.existsSync(`./library/classes/${dependency}.py`))
                return

            let data = fs.readFileSync(`./library/classes/${dependency}.py`)
            response.push(dependency + String.fromCharCode(0x1d) + data);
        })
    })
    return response
}

let buildAdl = (thing, new_components = []) => {
    let adl_components = thing._components
        .map(c => {
            if (new_components.map(new_c => new_c.type).includes(c.type)) {
                return new_components.find(new_c => new_c.type == c.type)
            }
            return c
        })
        .map(c => `'${c.type}': '${c.file}'`)
    // console.log(adl_components)
    // TODO => change attachments based on parameters of method
    let adl_attachments = thing._attachments.map(a => `'${a.from.type}': '${a.to.type}'`)
    // console.log(adl_attachments)
    let adl_starters = thing._starter.map(c => `'${c.type}'`)
    let adaptability = `'${thing.adaptability?.type ?? 'None'}'`

    adl = `
Components = {
    ${adl_components.join(",\n    ")}
}

Attachments = {
    ${adl_attachments.join(",\n    ")}
}

Starter = {
    ${adl_starters.join(",\n    ")}
}

Adaptability = {
    'type': ${thing.adaptability?.type ?? false ? `'${thing.adaptability.type}'` : 'None'},
    'timeout': ${thing.adaptability?.timeout ?? 'None'}
}
`
    return adl
}

let startThing = (headers) => {
    if (!headers['Thing']) {
        return '0'
    }
    let thing_id = headers['Thing']
    let thing = loadThing(thing_id)

    /*
     * TODO
     * - Erase 'current' version
     */
     if (thing._trial?.length > 0) {
        if (!thing._ignored) {
            thing._ignored = []
        }
        thing._ignored.push(...thing._trial)
        thing._trial = []
         db.write()
     }


    // fs.readFile(`./components/${components[0]}.py`, 'ascii', (err, data) => {
    //     socket.write(String.fromCharCode(0x1c))
    // })
    let response = ['adl' + String.fromCharCode(0x1d) + buildAdl(thing)]

    response.push(...readComponents(thing._components))
    return response.join(String.fromCharCode(0x1c))
}

let evolveThing = (headers) => {
    if (!headers['Thing']) {
        return false
    }
    let thing_id = headers['Thing']
    let thing = loadThing(thing_id)

    /*
     * TODO
     * - Commit 'trial' version (check if there is any "trial version" and update the "original" versions)
     */
     if (thing._trial?.length > 0) {
        thing._trial.map(trial_comp => {
            let comp = thing._components.find(c => c.type == trial_comp.type)
            let comp_index = thing.components.findIndex(c => c == comp.id)

            console.log(comp_index)
            thing.components[comp_index] = trial_comp.id
            loadThing(thing_id)
        })
        thing._trial = []
        db.write()
     }

    let newVersions = (component, ignored) => {
        return db.get('components').filter(comp => {
            let being_ignored = !!ignored.find(c => c.id == comp.id) // check if component is in the "ignored" list of the thing
            return comp.name == component.name && comp.version > component.version && !being_ignored
        }).sort((c1, c2) => c2.version - c1.version).value()
    }

    let new_components = thing._components.filter(comp => {
        return newVersions(comp, thing._ignored).length > 0
    }).map(comp => {
        console.log(newVersions(comp, thing._ignored));
        return newVersions(comp, thing._ignored)[0]
    })

    let files = []
    if (new_components.length > 0) {
        files = [
            'adl' + String.fromCharCode(0x1d) + buildAdl(thing, new_components),
            ...readComponents(new_components)
        ]
    }

    let unused_components = thing._components.filter(
        c => !!new_components.find(nc => nc.type == c.type && nc.file != c.file)
    )

    // TODO
    /*
     * - Update database entry for the thing with the 'trial version'
     */
    thing._trial = new_components
    db.write()

    let response = ''
    response += unused_components.map(c => `rm:components/${c.file}.py`).join('\n')
    return response + String.fromCharCode(0x1e) + files.join(String.fromCharCode(0x1c))
}

module.exports = {
    startThing,
    evolveThing
}
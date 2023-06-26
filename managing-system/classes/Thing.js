const fs = require('fs')
const path = require('path')
const DB = require('./DB')
const ComponentsCollection = require('./ComponentsCollection')

class Thing {
    constructor(id, components, attachments, starter, adaptability, trialMode, vars, configurations) {
        this.id           = id
        this.adaptability = adaptability
        this.attachments  = attachments
        this.components   = components
        this.starter      = starter
        this.trialMode    = trialMode
        this.rolledBack   = false
        this.vars         = vars
        this.configurations = configurations
        this.isNewModel   = false // @TODO - remove this
    }

    adl() {
        let adl = fs.readFileSync(path.join(__dirname, 'adl.new.template')).toString()
        /* @TODO - remove this */
        if (this.isNewModel) {
            adl = fs.readFileSync(path.join(__dirname, 'adl.new.template')).toString()
        }
        /* END*/
        let components_str = this.components.map(c => `'${c.type}': '${c.filename}'`).join(', ')
        let attachments_str = this.attachments.map(a => `'${a.from.type}':'${a.to.type}'`).join(',')
        let starter_str = `'${this.starter[0].type}'`
        let adapt_type = this.adaptability?.type ?? false ? `'${this.adaptability?.type}'` : 'None'
        let adapt_timeout = this.adaptability?.timeout ?? 'None'

        return adl
            .replace('__COMPONENTS__', components_str)
            .replace('__ATTACHMENTS__', attachments_str)
            .replace('__STARTER__', starter_str)
            .replace('__ADAPT_TYPE__', adapt_type)
            .replace('__ADAPT_TIMEOUT__', adapt_timeout)
    }

    // possible data types: object
    appVars() {
        let vars = ''
        for (let v in this.vars) {
            let data = this.vars[v]
            if (typeof data == 'string') {
                data = `'${data}'`
            }
            vars += `${v} = ${data}`
        }
        return vars
    }

    configuration(options = {}) {
        let configuration = fs.readFileSync(path.join(__dirname, "configurations.template")).toString()

        // let configs_app = {}
        // for (let a in this.configurations.application) {
        //     let data = this.configurations.application[a]
        //     if (typeof data == 'string') {
        //         data = `'${data}'`
        //     }
        //     configs_app += `${a} = ${data}`
        // }
        
        // configurations of application
        let loop_interval = options.loop_interval ?? this.configurations?.application?.loop_interval ?? 'None' 
        let publish_in = this.configurations?.application?.publish_in ?? false ? `"${this.configurations?.application?.publish_in}"` : 'None'
        let subscribe_to = this.configurations?.application?.subscribe_to ?? false ? `"${this.configurations?.application?.subscribe_to}"` : 'None'

        // configurations of device
        let device_id = this.configurations?.device?.id ?? false ? `"${this.configurations?.device?.id}"` : 'None'
        let device_location = this.configurations?.device?.location ?? false ? `"${this.configurations?.device?.location}"` : 'None'

        // configurations of environment
        let broker_host = this.configurations?.environment?.broker_host ?? false ? `"${this.configurations?.environment?.broker_host}"` : 'None'
        let broker_port = this.configurations?.environment?.broker_port ?? 'None'
        let await_broker_response = this.configurations?.environment?.await_broker_response ?? 'None'

        return configuration
            .replace("__APP_INTERVAL__", loop_interval)
            .replace("__APP_PUBLISH_IN__", publish_in)
            .replace("__APP_SUBSCRIBE_TO__", subscribe_to)
            .replace("__THING_ID__", device_id)
            .replace("__THING_LOCAL__", device_location)
            .replace("__ENV_BROKER_HOST__", broker_host)
            .replace("__ENV_BROKER_PORT__", broker_port)
            .replace("__ENV_RESPONSE__", await_broker_response)
    }

    // async getRolledBackVersions() {
    //     if (this.rolledBack === false) {
    //         this.loadRolledBack()
    //     }
    // }

    // async loadRolledBack() {
    //     await DB.getThingRolledBack(this.id)
    // }

    // save thing data to an internal backup collection
    // set thing to "trial" version
    async backup() {
        await DB.backupThing(this.id)
    }

    async setTrial() {
        this.trialMode = true
        await this.update()
    }

    isInTrial() {
        return this.trialMode
    }

    // remove the backup version and mark the current as "stable"
    async commit() {
        this.trialMode = false
        await this.update()
    }

    // return thing data to its backup data and mark current components as "unstable" (ignored?)
    async rollback() {
        await DB.rollbackThing(this.id)
    }

    async update() {
        await DB.saveThing(this)
    }

    async apply(adaptation) {
        var partes = []
        var configs
        for (let component of adaptation.componentsToAdd) {
            this.components.replaceByName(component)
        }
        for (let appVar in adaptation.appVars) {
            this.vars[appVar] = adaptation.appVars[appVar]
        }
        try{
            for (let config in adaptation.configurations) {
                this.configurations.application[config] = adaptation.configurations[config]
            }
            //console.log("Parte 2 = ")
            //console.log(JSON.stringify(adaptation.configurations, this.replacer, 2))
            //console.log(typeof(adaptation.configurations))
            //console.log(this.configurations)
            //console.log(typeof(this.configurations))
            //console.log({configs})
            //console.log(JSON.stringify(adaptation.configurations).split(':'))
            //partes.push(adaptation.configurations.split('= ')[0])
            //partes.push(JSON.parse(JSON.stringify(adaptation.configurations)).split(': ')[0])
            //partes.push(this.configurations.split('= ')[0])
            //partes.push(adaptation.configurations.substring(partes[0].length + 1).replace(/None/g, '""'))
            //this.configurations = JSON.parse(JSON.stringify(partes[1]))
            //console.log('Apply: ')
            // console.log(adaptation)
            // console.log(partes)            
            // var newConf = JSON.parse(partes[1])
            // console.log(this.configurations)
            // console.log(newConf)
        } catch (err) {
            console.log('Error: ', err.message)
        }
        
        // console.log('this.configurations')
        // console.log(this.configurations)
        // console.log(typeof(this.configurations))
        // console.log(this.configuration())
        await this.update()

        // adaptation.adl = this.adl()
        //adaptation.appVars = this.appVars()
        adaptation.configurations = this.configuration()
        console.dir({adaptation}, {depth:5})
    }

    static async load(id) {
        let thing = await DB.getThing(id)
        let collection = await ComponentsCollection.load(thing.components)
        let starter = thing.starter.map(s => collection.getByType(s))
        let attachments = thing.attachments.map(att => ({
            'from': collection.getByType(att.from),
            'to': collection.getByType(att.to)
        }))
        let obj = new Thing(
            id,
            collection,
            attachments,
            starter,
            thing.adaptability,
            thing.trialMode,
            thing.vars,
            thing.configurations
        )
        return obj
        // return new Component(
        //     id,
        //     component.name,
        //     component.version,
        //     component.type,
        //     component.file
        // )
    }

    stringToJson(input) {
        var result = [];

        // Replace leading and trailing [], if present
        input = input.replace(/^\[/, '');
        input = input.replace(/\]$/, '');

        // Change the delimiter to
        input = input.replace(/},{/g, '};;;{');

        // Preserve newlines, etc. - use valid JSON
        //https://stackoverflow.com/questions/14432165/uncaught-syntaxerror-unexpected-token-with-json-parse
        input = input.replace(/\\n/g, "\\n")
               .replace(/\\'/g, "\\'")
               .replace(/\\"/g, '\\"')
               .replace(/\\&/g, "\\&")
               .replace(/\\r/g, "\\r")
               .replace(/\\t/g, "\\t")
               .replace(/\\b/g, "\\b")
               .replace(/\\f/g, "\\f");

        // Remove non-printable and other non-valid JSON characters
        input = input.replace(/[\u0000-\u0019]+/g, "");

        input = input.split(';;;');

        input.forEach(function(element) {
        //console.log(JSON.stringify(element));

            result.push(JSON.parse(element));
        }, this);

        return result;
    }

    replacer(key, value) {
        console.log(typeof value);
        if (key === 'email') {
          return undefined;
        }
        return value;
      }
}

// (async () => {
//     let t = await Thing.load('1')
//     // await t.rollback()
//     // await t.loadRolledBack()
//     // console.dir(t.rolledBack, {depth: 3})
//     // console.log(t.components)
//     // for (let c of t.components.components) {
//     //     await c.loadVersions()
//     // }
//     // t.components.map(async c => {
//     //     console.log(await c.loadVersions())
//     // })
//     // console.dir(t, {depth: 3})
//     // await t.backup()
//     // await t.setTrial()
//     // await t.rollback()

//     process.exit()
// })()

module.exports = Thing
const ThingLoader = require('./ThingLoader')
const AdaptationManager = require('./AdaptationManager')
const Response = require('./Response')


class ThingController {
    static async getResponseFor(request) {
        console.log(`Loading thing ${request.getThingId()}`)
        let thing = await ThingLoader.load(request.getThingId())

        /* @TODO - remove this */
        if (request.isNewModel()) {
            thing.isNewModel = true
        }
        /* END */

        console.log(`Thing loaded, Preparing response...`)

        if (request.isStart()) {
            return ThingController.startThingResponse(thing)
        } else if (request.isAdapt()) {
            return ThingController.adaptThingResponse(thing, request)
            // let response = AdaptationManager(thing, request).adapt()
            // MAPE-K
            // let response = mapek_manager(thing, request)
        }
    }

    static async startThingResponse(thing) {
        // if thing is in trial mode, then rollback
        if (thing.isInTrial()) {
            await thing.rollback()
        }
        let response = Response.fromThing(thing)
        console.log(`Response sent.`)
        return response
    }

    static async adaptThingResponse(thing, request) {
        // if thing is in trial mode, then commit
        if (thing.isInTrial()) {
            await thing.commit()
        }

        await thing.backup()
        let adaptation = await AdaptationManager.adapt(thing).with(request)
        console.dir(adaptation, {depth:5})

        if (!adaptation.hasChanges()) {
            return new Response()
        }

        await thing.setTrial()
        await thing.apply(adaptation)

        
        let response = Response.fromAdaptation(thing, adaptation)
        console.log(`Adaptation sent.`)
        return response

    }
}

module.exports = ThingController
const { things, components } = require('./firebase')

;

const c1 = 'TemperatureChecker-1.0'
const c2 = 'TemperatureChecker-2.0'

;

(async () => {
    let thing = await things.doc('1')
    thing.onSnapshot(async snapshot => {
        let comps = snapshot.data().components
        if (comps.includes(c2)) {
            comps[comps.indexOf(c2)] = c1
            thing.update({
                components: comps
            })

            let comp1 = await components.doc(c1)
            let comp2 = await components.doc(c2)

            let file1 = (await comp1.get()).data().file
            let file2 = (await comp2.get()).data().file

            comp1.update({
                file: file2
            })

            comp2.update({
                file: file1
            })
            console.log('updated')
        }
    })
})()

setInterval(() => {

}, 100)

// setInterval(async () => {
//     let thing = await things.doc('1').get()
//     console.log(thing)
// }, 1000)
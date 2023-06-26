const firebase = require('firebase')
// const firestore = require('firebase/app/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyBKX2OfHmeEntaYPaMkbkd1n-I0Waaf-gI",
    authDomain: "asw-solution.firebaseapp.com",
    projectId: "asw-solution",
    storageBucket: "asw-solution.appspot.com",
    messagingSenderId: "797971068282",
    appId: "1:797971068282:web:2d0961eac69d8b7bfb92c3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const our = require('./db2.json')
// console.log(our)

const db = firebase.firestore()
const _things = db.collection('things')
const _components = db.collection('components')

for (component of our.components) {
    let { version, name, type, file } = component
    _components.doc(component.id).set({
        version, name, type, file
    })
    console.log('added')
}
for (thing of our.things) {
    let { components, attachments, starter } = thing
    // console.log(thing)
    adaptability = {'adaptability': {}}
    if (thing.adaptability) {
        adaptability = thing.adaptability
        adaptability.type = [adaptability.type]
    }
    // console.log(thing.id, components, attachments, starter, adaptability)
    _things.doc(thing.id).set({
        components, attachments, starter, adaptability
    })
    console.log('thing updated')
    // break
}
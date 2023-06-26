const { components } = require('../firebase')

;

(async () => {
    let snapshot = await components.where('name', '==', 'Marshaller').get()
    let groups = {}
    await snapshot.forEach(c => {
        let component = c.data()
        if (!groups[component.name]){
            groups[component.name] = []
        }
        component._id = c.id
        groups[component.name].push(component)
    })
    console.dir(groups, { depth: 1 })
})()
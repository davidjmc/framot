const net = require('net')

const self_port = 60010

const functions = require('./functions')

const server = new net.Server()
server.listen(self_port, '0.0.0.0', 5, () => {
    console.log(`listening on ${self_port}`)
})

server.on('connection', socket => {
    console.log('connected')
    socket.on('data', data => {
        data = data.toString('ascii')
        console.log(data)
        data_lines = data.split('\n')
        method = data_lines.shift()
        headers = {}
        for (line of data_lines) {
            if (line == '') {
                break
            }
            var [header, value] = line.split(':')
            headers[header] = value
        }


        // console.log('thing: ' + thing_id)
        // console.log('components: ' + components)

        let response = '0'
        switch(method) {
            case 'START':
                response = functions.startThing(headers)
                if (!response) {
                    response = "ERROR"
                }
                socket.write(response)
                require('fs').writeFileSync('old.response', response)
                break
            case 'ADAPT':
                response = functions.evolveThing(headers)
                socket.write(response)
                break
        }





        // fs.readFile('/Users/joe/test.txt', 'utf8' , (err, data) => {
        //   if (err) {
        //     console.error(err)
        //     return
        //   }
        //   console.log(data)
        // })

    })
})

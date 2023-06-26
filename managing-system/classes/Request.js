class Request {
    constructor(data) {
        [this.method, this.headers] = this.process(data)
    }

    process(data) {
        let data_lines = data.split('\n')
        let method = data_lines.shift()
        let headers = {}
        for (let line of data_lines) {
            if (line == '') {
                break
            }
            var [header, value] = line.split(':')
            headers[header] = value
        }
        return [method, headers]
    }

    /* @TODO - remove this */
    isNewModel() {
        return this.method == 'START_NEW'
    }
    /* END */

    isStart() {
        return this.method == 'START' || this.method == 'START_NEW'
    }

    isAdapt() {
        return this.method == 'ADAPT'
    }

    getThingId() {
        return this.headers['Thing'] ?? false
    }
}

module.exports = Request
import camelize from '../utils/camelize'
import stringifyCircularJSON from '../utils/stringify'

class StoreLogger {

    constructor(Alpine){
        this.Alpine = Alpine
        this.Alpine.store('log', {
            entries: [],
            add(e) {
                if(this.entries.length>= 1000){ //TODO config limit
                    this.entries.shift()
                }
                this.entries.push(e)
            }
        })
    }

    _log(i, t, m, d){
        this.Alpine.store('log').add(i + '\t' + t + '\t' + m + '\t' + stringifyCircularJSON(d))
    }

    debug(i, t, m, d){ this._log(i, t, m, d) }
    info(i, t, m, d){ this._log(i, t, m, d) }
    warn(i, t, m, d){ this._log(i, t, m, d) }
    error(i, t, m, d){ this._log(i, t, m, d) }
}

export class Logger {

    constructor(Alpine){
        this.Alpine = Alpine
        this.console = console
        this.store = new StoreLogger(this.Alpine)
        this.remote = null //TODO
    }

    get(name) {
        return this[camelize(name)]
    }
    set(name, logger){
        this[camelize(name)] = logger
    }

}
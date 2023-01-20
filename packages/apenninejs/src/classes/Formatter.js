import { camelize } from "../utils/camelize"

export class Formatter {

    constructor(Alpine){
        this.Alpine = Alpine
    }

    get(name){
        return this[camelize(name)].bind(this)
    }
    set(name, formatter){
        if(name && formatter){
            Formatter.prototype[camelize(name)] = formatter
        }
    }
    format(name, content, params){
        return this.get(name)(content, params)
    }

    uppercase(content, params){
        return (''+content).toUpperCase()
    }
    lowercase(content, params){
        return (''+content).toLowerCase()
    }
    camelize(content, params){
        return camelize(content)
    }
    bold(content, params){
        return '<strong>'+content+'</strong>'
    }
    prefix(content, prefix){
        return prefix + content
    }
    postfix(content, postfix){
        return content + postfix
    }
}
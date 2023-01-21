import { camelize } from "../utils/camelize"

export class Template{

    constructor(Alpine){
        this.Alpine = Alpine
        this.templates = {}
        this.baseUrl = null
    }

    async get(name){
        name = camelize(name)
        let tpl = this.templates[name]
        if(!tpl){
            if(!this.baseUrl){
                this.baseUrl = new URL(
                    this.Alpine.store('app').urls.templates, 
                    this.Alpine.store('app').urls.base)
            }
            let response = await fetch(new URL(name + '.html', this.baseUrl.href), {
                    method: 'GET',
                    cache: 'no-cache'
                })
            if(response.ok){
                tpl = await response.text()
                this.set(name, tpl)
                return tpl
            } else {
                throw new Error('Error in loading template ' + name)
            }
        } else {
            return tpl
        }
    }
    set(name, tpl){
        this.templates[camelize(name)] = tpl
    }
}
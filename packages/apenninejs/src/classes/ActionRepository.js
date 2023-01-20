import { camelize } from "../utils/camelize"

export class ActionRepository{

    constructor(Alpine){
        this.Alpine = Alpine
        this.priorities = {}
    }

    get(n){
        return this[camelize(n)]
    }

    set(v) {
        if(v.name && v.fn){
            ActionRepository.prototype[camelize(v.name)] = v.fn
            this.priorities[camelize(v.name)] = v.priority || 1000
        } else {
            throw new Error('Action is not valid')
        }
    }

    priority(name){
        return this.priorities[camelize(name)]
    }
    
}
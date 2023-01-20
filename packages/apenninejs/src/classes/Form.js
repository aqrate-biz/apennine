export class Form{
    
    constructor(){ 
        this._initializing = 1
        this._executingActions = 0
        this._submitting = 0
        this._submitResult = {}
        this._actions = {}
    }

    get initializing() { return this._initializing > 0 }
    get executingActions() { return this._executingActions > 0 }
    get submitting() { return this._submitting > 0 }

    initStart() { this._initializing++ }
    initEnd() { this._initializing-- }
    actionStart() { this._executingActions++ }
    actionEnd() { this._executingActions-- }
    submitStart() { this._submitting++ }
    submitEnd() { this._submitting-- }
    submitResult(r) { this._submitResult = r }

    valid(fields){
        let v = true
        for(let key of Object.keys(fields)){
            let field = fields[key]
            field.touched = true
            if(field.available && !field.valid){
                v = false
            }
        }
        return v
    }

    get actions() { return this._actions }
    connectAction(a){
        this.disconnectAction(a)
        for(let ev of a.events){
            if(!this._actions[ev]) { this._actions[ev] = [] }
            this._actions[ev].push(a)
        }
    }
    disconnectAction(a){
        for(let ev of a.events){
            if(!this._actions[ev]) { this._actions[ev] = [] }
            this._actions[ev] = this._actions[ev].filter(u => !u.equalTo(a))
        }
    }
    getActions(event){
        return this._actions[event] || []
    }

    execActions(event, context, el){
        return new Promise((resolve, reject) => {
            this.actionStart()
            let promises = []
            for(let action of this.getActions(event)){
                promises.push(action.run(context, el))
            }
            Promise.all(promises) //every action should return an object (or an array of) for updateField
                .then((results) => {
                    this.actionEnd()
                    resolve(results)
                })
                .catch((error) => {
                    this.actionEnd()
                    reject(error)
                })
        })
    }

}
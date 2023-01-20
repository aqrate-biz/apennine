
export class Action{

    constructor(options){
        this._name = options.name
        this._priority = options.priority
        this._field = options.field
        this._params = options.params

        this._events = (options.events ? options.events : ['field-change']).sort()
        this._fn = options.fn
        
        this._runs = 0
        this._errors = 0

        this._enabled = true
    }

    equalTo(t){
        return this.name === t.name && this.field === t.field //&& this.events.join(',') === t.events.join(',')
    }

    get name() { return this._name }

    get priority() { return this._priority }
    
    get field() { return this._field }
    
    get params() { return this._params }
    
    get events() { return this._events }
    
    get runs() { return this._runs }
    
    get errors() { return this._errors }

    get enabled() { return this._enabled }
    
    run(context, el){
        return new Promise((resolve, reject) => {
            try{
                //dispatch(el, 'log', new Log('d', '📦 ' + el.tagName + '#' + el.id, '*️⃣ ' + this.name, context))
                let result = this._fn(el, context, this.params)
                this._runs++
                if(result){
                    if(!result.then){
                        resolve(result)
                    } else {
                        result
                            .then(r => resolve(r))
                            .catch(e => { this._errors++; reject(e) })
                    }
                } else {
                    resolve(result)
                }
            } catch(err){
                this._errors++
                reject(err)
            }
            
        })
    }
}
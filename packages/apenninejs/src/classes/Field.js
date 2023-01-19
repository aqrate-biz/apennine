export class FieldType {
    static TEXT = new FieldType('text')
    static DECIMAL = new FieldType('decimal', '$decimal($input, \'.\', config.thousandsDelimiter, 3)')
    static INTEGER = new FieldType('integer', '$integer($input, config.thousandsDelimiter, false)')
    static UINTEGER = new FieldType('uinteger', '$integer($input, config.thousandsDelimiter, true)')
    static DATE = new FieldType('date')
    static DATETIME = new FieldType('datetime')
    static BOOLEAN = new FieldType('boolean')
    static SELECT = new FieldType('select')
    static SET = new FieldType('set')
    static ARRAY = new FieldType('array')
    static BUTTON = new FieldType('button')
    static MONEY = new FieldType('money', '$money($input)')

    constructor(name, mask){
        this.name = name
        this.mask = mask
    }
}
export class Field {
    
    constructor(name, Alpine){
        this.Alpine = Alpine
        this._name = name
        this._type = undefined
        this._originalValue = undefined
        this._available = false
        this._touched = false
        this._dirty = false
        this._value = undefined
        this._oldValue = undefined
        this._valid = true
        this._invalidRules = []
        this._actions = {}
        this._executingActions = 0
        this._options = {}
        this._raw = undefined
    }

    toObject(){
        return {
            name: this.name,
            type: this.type,
            touched: this.touched,
            originalValue: this.originalValue,
            dirty: this.dirty,
            value: this.value,
            oldValue: this.oldValue,
            valid: this.valid,
            invalidRules: this.invalidRules,
            raw: this.raw,
            executingActions: this.executingActions,
        }
    }

    get name() { return this._name }

    get type() { return this._type }
    set type(v) { this._type = v }
    
    get originalValue() { return this._originalValue }
    set originalValue(v) { if(this._originalValue===undefined) this._originalValue = v }

    get initialized() { return this.originalValue!==undefined }

    get available() { return this._available }
    set available(v) { this._available = v }

    get touched() { return this._touched }
    set touched(v) { this._touched = v }
    
    get dirty() { return this._dirty }
    set dirty(v) { this._dirty = (this.originalValue!==undefined && this.value!==this.originalValue) }

    get value() { return this._value }
    set value(v) { 
        this.originalValue = v //doesn't change if already set
        this.oldValue = this.value 
        this._value = v 
        this.dirty = v 
        this.raw = v
    }

    get oldValue() { return this._oldValue }
    set oldValue(v) { this._oldValue = this.value }

    get valid() { return this._valid }
    set valid(v) { this._valid = v && this.valid } //if false remain false
    resetValid() { this._valid = true; this._invalidRules = [] }

    get invalidRules() { return this._invalidRules }
    set invalidRules(v) { this._invalidRules.push(v) }

    get options() { return this._options }
    set options(v) { 
        this._options = {
            converter: {
                name: v.converter && (v.converter.name || v.converter),
                fn: v.converter ? Alpine.Converter[v.converter.name || v.converter].bind(Alpine.Converter) : v => v,
                params: v.converter && v.converter.params
            },
            mask: v.mask
        } 
    }
    
    get raw() { return this._raw }
    set raw(v) {
        if(this.options.converter){
            this._raw = this.options.converter.fn(v, this.options.converter.params)
        } else {
            this._raw = (''+v).trim()
        }
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

    get executingActions() { return this._executingActions > 0 }

    actionStart() { this._executingActions++ }
    actionEnd() { this._executingActions-- }

    execActions(event, context, el){
        return new Promise((resolve, reject) => {
            this.actionStart()
            let promises = []
            for(let action of this.getActions(event)){
                promises.push(action.run(context, el))
            }
            Promise.all(promises)
                .then((results) => {
                    this.actionEnd()
                    resolve(this)
                })
                .catch((error) => {
                    this.actionEnd()
                    reject(error)
                })
        })
        
    }
}
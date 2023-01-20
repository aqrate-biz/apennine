export class FieldType {
    static TEXT = new FieldType('string', 'text')
    static DECIMAL = new FieldType('number', 'decimal', '$decimal($input, \'.\', config.thousandsDelimiter, 3)')
    static INTEGER = new FieldType('number', 'integer', '$integer($input, config.thousandsDelimiter, false)')
    static UINTEGER = new FieldType('number', 'uinteger', '$integer($input, config.thousandsDelimiter, true)')
    static DATE = new FieldType('time', 'date')
    static DATETIME = new FieldType('time', 'datetime')
    static BOOLEAN = new FieldType('boolean', 'boolean')
    static SELECT = new FieldType('set', 'select')
    static SET = new FieldType('set', 'set')
    static ARRAY = new FieldType('array', 'array')
    static BUTTON = new FieldType('misc', 'button')
    static MONEY = new FieldType('number', 'money', '$money($input)')

    constructor(group, name, mask){
        this.group = group
        this.name = name
        this.mask = mask
    }

    static get(name){
        return FieldType[name.toUpperCase()]
    }

    isOf(group){
        return this.group === group
    }
    is(type){
        return this.name === type
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
        }
    }

    get name() { return this._name }
    set name(v) { }

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
        this.raw = v //TODO call converters?
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
            mask: v.mask
        } 
    }
    
    get raw() { return this._raw }
    set raw(v) { this._raw = v }

    get actions() { return this._actions }
    connectAction(a){
        this.disconnectAction(a)
        for(let ev of a.events){
            if(!this._actions[ev]) { this._actions[ev] = [] }
            this._actions[ev].push(a)
            this._actions[ev].sort((a, b) => {
                return this.Alpine.actions.priority(a.name) > this.Alpine.actions.priority(b.name) ? 1 : -1
            })
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
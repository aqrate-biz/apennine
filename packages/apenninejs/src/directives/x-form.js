
/**
 * Directive: x-form
 *  <tag x-form:value.[modifiers]="{expression}"></tag>
 *  value:
 *  modifiers: 
 *  expression: 
 */
export default function (Alpine) {
    Alpine.directive('form', (el, { value, expression, modifiers }, { Alpine, effect, evaluate, evaluateLater, cleanup }) => {
        
        Alpine.bind(el, {
            'x-id'() { return ['form','field'] },
            ':id'() { return this.$id('form') },
            'x-data'() {
                return {
                    init() {
                        this.$data.fields = {}
                        this.$data.model = {}
                        this.$data.form = new Alpine.Form()
                        this.$data.pojos = {}

                    }
                }
            },
            '@field-add.stop'(e){
                let f = fieldFromEvent(e)
                updateField(this, f.name, { available: true, type: f.type, options: f.options }, Alpine)
                addEffect(this, f , effect)
            },
            '@field-remove.stop'(e){
                let f = fieldFromEvent(e)
                updateField(this, f.name, { available: false }, Alpine)
            },
            '@action-connect.stop'(e){
                let a = e.detail
                if(a.field){
                    getField(this, a.field).connectAction(a)
                } else {
                    getForm(this).connectAction(a)
                }
            },
            '@action-disconnect.stop'(e){
                let a = e.detail
                if(a.field){
                    getField(this, a.field).disconnectAction(a)
                } else {
                    getForm(this).disconnectAction(a)
                }
            },
            
            '@data-store.stop'(e) {
                this.$data.model = e.detail.data
                for(let key of Object.keys(model)){
                    updateField(this, key, { value: model[key] }, Alpine)
                }
                execActions(el, null, 'data-store')
                getForm(this).initEnd()
            }, 
            '@field-focus.stop'(e){
                let f = fieldFromEvent(e)
                execActions(this, f.name, 'field-focus')
            }, 
            '@field-blur.stop'(e){
                let f = fieldFromEvent(e)
                updateField(this, f.name, { touched: true }, Alpine)
                execActions(this, f.name, 'field-blur')
            }, 
            '@field-change.stop'(e){
                let f = fieldFromEvent(e)
                updateField(this, f.name, { value: f.value }, Alpine)
                getField(this, f.name).resetValid()
                execActions(this, f.name, 'field-change')
            },
            
            '@submit.prevent.stop'(e){
                if(getForm(this).valid(getFields(this))){
                    getForm(this).submitStart()
                    this.$dispatch('form-submit', getRawModel(el)) 
                }
            },
            '@form-submitted.stop'(e){
                let r = e.detail
                getForm(this).submitResult({ success: r.success, response: r })
                getForm(this).submitEnd()
            },
            '@error.stop'(e){
                getForm(this).submitResult({ success: false, response: e.detail })
                getForm(this).submitEnd()
            }
        })
    })
}

function fieldFromEvent(e){
    return e.detail
}

function hasField(el, name){
    return !!el.$data.fields[name]
}

function addField(el, name, Alpine){
    el.$data.fields[name] = new Alpine.Field(name, Alpine)
}

function getField(el, name){
    return el.$data.fields[name]
}

function updateField(el, name, obj, Alpine){
    if(!hasField(el, name)) addField(el, name, Alpine)
    let field = getField(el, name)
    for(let key of Object.keys(obj)){
        field[key] = obj[key]
    }
    el.$data.pojos[name] = field.toObject()
}

function getFieldOldValue(el, field){
    return getField(el, field.name).oldValue
}

function dispatchFieldChange(el, field, value){
    el.$dispatch('field-change', {
        name: field.name,
        value: value,
    })
}

function addEffect(el, field, effect) {
    effect(() => { 
        let newValue = el.$data.model[field.name]
        if(newValue!==undefined && newValue!==getFieldOldValue(el, field)){
            dispatchFieldChange(el, field, newValue)
        }
    })
}

function getFields(el){
    return el.$data.fields
}

function getModel(el){
    return el.$data.model
}
function getRawModel(el){
    let model = {}
    for(let key of Object.keys(getModel(el))){
        model[key] = getField(el, key).raw
    }
}

function getForm(el){
    return el.$data.form
}

function execActions(el, name, event){
    el.$nextTick(() => {
        if(name) {
            getField(el, name).execActions(event, { fields: getFields(el), model: getModel(el), fieldName: name }, el)
                .then(() => {
                    el.$nextTick(() => {
                        getForm(el).execActions(event, { fields: getFields(el), model: getModel(el) }, el)            
                    })
                })
                .catch((err) => {
                    //TODO
                })
        } else {
            getForm(el).execActions(event, { fields: getFields(el), model: getModel(el) }, el)
        }
    })
}
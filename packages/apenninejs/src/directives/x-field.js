
import { xAttribute } from '../utils/xattribute'
import { last } from '../utils/last'
import { dispatch } from '../../../alpinejs/src/utils/dispatch'
import { scope } from '../../../alpinejs/src/scope'
import { modifierBooleanValue, modifierIntValue } from "../utils/modifier-value"
/**
 * Directive: x-field
 *  <tag x-field:value.[modifiers]="{expression}"></tag>
 *  value: field type
 *  modifiers: field type options
 *  expression: configuration
 */
export default function (Alpine) {
    Alpine.directive('field', (el, { value, expression, modifiers }, { Alpine, effect, evaluate, evaluateLater, cleanup }) => {
        
        let modelAttribute = xAttribute(el, 'x-model')
        if(!modelAttribute) { throw new Error('Missing attribute x-model in x-field') }

        let fieldName = last(modelAttribute.split('.')) 
        let type = value || el.getAttribute('type') || 'text'
        let fieldType = Alpine.FieldType[type.toUpperCase()]
        if(!fieldType) { throw new Error('Unknown field type ' + type) }

        let options = evaluate(expression || '{}')
        if(xAttribute(el, 'x-mask')){
            options.mask = xAttribute(el, 'x-mask')
        } else {
            if(fieldType.defaults.mask){
                modifiers.push(fieldType.defaults.mask)
            }
            let mask = getMask(modifiers)
            if(mask){
                Alpine.bind(el, {
                    'x-mask:dynamic': mask
                })
            }
            options.mask = mask
        }

        Alpine.bind(el, {
            ':id'() { return this.$id('form') + '-' + this.$id('field') },
            ':name'() { return fieldName },
            '@focus.stop'(e) { this.$dispatch('field-focus', { name: fieldName })},
            '@blur.stop'(e) { this.$dispatch('field-blur', { name: fieldName })},
        })

        let evaluateField = evaluateLater('pojos[\'' + fieldName + '\']')
        effect(() => {
            evaluateField((field) => {
                if(field){
                    for(let k of Object.keys(field)){
                        scope(el)[k] = field[k]
                    }
                }
            })
        })

        dispatch(el, 'field-add', { name: fieldName, type: fieldType.name, mask: options.mask })
        
        if(fieldType.defaults.converter){
            modifiers.push(fieldType.defaults.converter)
        }
        let toBeBound = getConverters(modifiers)
        if(Object.keys(toBeBound).length > 0){
            Alpine.bind(el, toBeBound)
        }

        toBeBound = getValidators(modifiers)
        if(Object.keys(toBeBound).length > 0){
            Alpine.bind(el, toBeBound)
        }

        cleanup(() => {
            dispatch(el, 'field-remove', { name: fieldName })
        })
    }).before('mask')

    Alpine.data('_field_', () => ( new Alpine.Field().toObject() ))

}



function getMask(modifiers){
    if(modifierBooleanValue('decimal', modifiers)){
        let decimals = modifierIntValue('decimals', modifiers, 2)
        let unsigned = modifierBooleanValue('unsigned', modifiers)
        return `$decimal($input, $app.formats.decimal, $app.formats.thousands, ${decimals}, ${unsigned})`
    }
    if(modifierBooleanValue('integer', modifiers)){
        let unsigned = modifierBooleanValue('unsigned', modifiers)
        return `$integer($input, $app.formats.thousands, ${unsigned})`
    }
    if(modifierBooleanValue('money', modifiers)){
        let decimals = modifierIntValue('decimals', modifiers, 2)
        let unsigned = modifierBooleanValue('unsigned', modifiers)
        return `$money($input, $app.formats.decimal, $app.formats.thousands, ${decimals}, ${unsigned})`
    }
}

function getConverters(modifiers){
    let converters = {}
    if(modifierBooleanValue('to-decimal', modifiers)){
        converters['x-action:convert-to-decimal'] = ''
    }
    return converters
}

function getValidators(modifiers){
    let validators = {}
    if(modifierBooleanValue('required', modifiers)){
        validators['x-action:validate-required'] = ''
    }
    return validators
}
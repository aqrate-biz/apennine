
import { xAttribute } from '../utils/xattribute'
import { last } from '../utils/last'
import { dispatch } from '../../../alpinejs/src/utils/dispatch'
import { scope, refreshScope } from '../../../alpinejs/src/scope'
/**
 * Directive: x-field
 *  <tag x-field:value.[modifiers]="{expression}"></tag>
 *  value: field type
 *  modifiers: 
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
            if(fieldType.mask){
                Alpine.bind(el, {
                    'x-mask:dynamic': fieldType.mask
                })
            }
            options.mask = fieldType.mask
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

        dispatch(el, 'field-add', { name: fieldName, type: fieldType.name, options: options })
        
        cleanup(() => {
            dispatch(el, 'field-remove', { name: fieldName })
        })
    })

    Alpine.data('_field_', () => ( new Alpine.Field().toObject() ))
}


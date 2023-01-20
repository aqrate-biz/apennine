import { modifierBooleanValue, modifierIntValue } from '../utils/modifier-value';
import { stringifyCircularJSON } from '../utils/stringify';

/**
 * Directive: x-json
 *  <tag x-json.{modifiers}="{expression}"></tag>
 *  modifiers: [n] = stringify option (spaces)
 *  expression: value to be stringified
 */
export default function (Alpine) {
    Alpine.directive('json', (el, { value, expression, modifiers }, { effect, evaluateLater }) => {
        let evaluate = evaluateLater(expression)
        
        let options = {
            spaces: modifierIntValue('spaces', modifiers, 0),
            notAlpine: modifierBooleanValue('not-alpine', modifiers),
            functions: modifierBooleanValue('functions', modifiers)
        }
        
        effect(() => {
            evaluate(value => {
                Alpine.mutateDom(() => {
                    value = stringifyCircularJSON(value, options, options.spaces)
                    if(options.spaces > 0 && el.tagName.toLowerCase()!='pre'){
                        value = '<pre>' + value + '</pre>'
                    }
                    el.innerHTML = value
    
                    el._x_ignoreSelf = true
                    Alpine.initTree(el)
                    delete el._x_ignoreSelf
                })
            })
        })
    })

    Alpine.magic('json', () => { 
        return (o, options, s) => { 
            return stringifyCircularJSON(o, options, s)
        }
    })
}



import stringifyCircularJSON from '../utils/stringify';

/**
 * Directive: x-json
 *  <tag x-json.{modifiers}="{expression}"></tag>
 *  modifiers: [n] = stringify option (spaces)
 *  expression: value to be stringified
 */
export default function (Alpine) {
    Alpine.directive('json', (el, { value, expression, modifiers }, { effect, evaluateLater }) => {
        let evaluate = evaluateLater(expression)
        
        let spaces = 0
        if(modifiers && modifiers.length){
            for(let m of modifiers){
                if(parseInt(m)>0) spaces = parseInt(m)
            }
        }
    
        effect(() => {
            evaluate(value => {
                Alpine.mutateDom(() => {
                    value = stringifyCircularJSON(value, null, spaces)
                    if(spaces > 0 && el.tagName.toLowerCase()!='pre'){
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
}



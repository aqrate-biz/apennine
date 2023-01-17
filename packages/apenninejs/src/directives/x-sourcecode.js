
import { warn } from '../utils/warn'
/**
 * Directive: x-sourcecode
 *  <code x-sourcecode:value.{modifiers}="{expression}"></code>
 *  value: lang
 *  modifiers: 
 *  expression: queryselector
 */
export default function (Alpine) {
    Alpine.directive('sourcecode', (el, { value, expression, modifiers }, { effect, evaluateLater }) => {
        if(el.tagName.toLowerCase()!='code'){
            warn('Tag for x-sourcecode should be <code></code>')
        }
        let lang = value || 'html'
        let evaluate = evaluateLater(expression || 'undefined')
        
        effect(() => {
            evaluate(value => {
                Alpine.mutateDom(() => {
                    let element = null
                    let content = ''
                    if(value===undefined){
                        element = el.nextElementSibling
                    } else {
                        if(typeof value === 'object'){
                            if(value.id){ value = '#' + value.id}
                        }
                        element = document.querySelector(value)
                    }
                    if(lang=='html'){
                        content = element.outerHTML
                    } else {
                        content = element.innerText
                    }

                    el.innerText = content
    
                    el._x_ignoreSelf = true
                    Alpine.initTree(el)
                    delete el._x_ignoreSelf
                })
            })
        })
    })
}



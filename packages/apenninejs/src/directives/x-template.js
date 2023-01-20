
import { domEl } from '../utils/dom-el'
/**
 * Directive: x-template
 *  <template x-template:value.[modifiers]="{expression}"></template>
 *  value: template name
 *  modifiers: 
 *  expression: template name if dynamic
 */
export default function (Alpine) {
    Alpine.directive('template', (el, { value, expression, modifiers }, { effect, evaluateLater, cleanup }) => {
        if(value){
            handleTemplate(value)
        } else {
            let evaluate = evaluateLater(expression)
            effect(() => {
                evaluate(handleTemplate)
            })
        }
        
        async function handleTemplate(tpl){
            let template = await Alpine.templates.get(tpl)
            Alpine.mutateDom(async () => {
                if(el._x_currentTemplate){
                    el._x_removeTemplate()
                }
                
                let newEl = domEl(template)
    
                Alpine.addScopeToNode(newEl, {}, el)
                
                el._x_currentTemplate = newEl
    
                el.after(newEl)
    
                Alpine.initTree(newEl)
    
                el._x_removeTemplate = () => {
                    walk(clone, (node) => {
                        if (!!node._x_effects) {
                            node._x_effects.forEach(dequeueJob)
                        }
                    })
                    
                    newEl.remove();
        
                    delete el._x_currentTemplate
                }
    
                return newEl
            })
        }
    
        
    
        cleanup(() => el._x_removeTemplate && el._x_removeTemplate())
    })

    Alpine.magic('template', () => { 
        return Alpine.templates.get.bind(Alpine.templates)
    }) 
}



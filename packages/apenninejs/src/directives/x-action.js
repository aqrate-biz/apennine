
import { last } from "../utils/last"
import { xAttribute } from "../utils/xattribute"
import { dispatch } from "../../../alpinejs/src/utils/dispatch"
/**
 * Directive: x-action
 *  <tag x-action:value.[modifiers]="{expression}"></tag>
 *  value: action name
 *  modifiers: events
 *  expression: params
 */
export default function (Alpine) {
    Alpine.directive('action', (el, { value, expression, modifiers }, { Alpine, effect, evaluate, evaluateLater, cleanup }) => {
        let actionName = value 
        let actionFunction = Alpine.actions.get(actionName).bind(Alpine.actions)
        
        let fieldAttribute = xAttribute(el, 'x-field') !== null
        let fieldName = null
        if(fieldAttribute){
            let modelAttribute = xAttribute(el, 'x-model')
            fieldName = last(modelAttribute.split('.'))   
            if(modifiers.length===0){
                modifiers = ['field-change']
            }
        }

        let evalParams = evaluateLater(expression || '{}')

        effect(() => {
            evalParams(params => {
                let options = {
                    name: actionName,
                    fn: actionFunction,
                    params: params,
                    field: fieldName,
                    events: modifiers
                }
                dispatch(el, 'action-connect', new Alpine.Action(options))
            })
        })
        
        cleanup(() => {
            let options = {
                name: actionName,
                fn: actionFunction,
                field: fieldName,
                events: modifiers
            }
            dispatch(el, 'action-disconnect', new Alpine.Action(options))
        })
    })
}

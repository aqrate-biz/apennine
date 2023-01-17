
import { dispatch } from '../../../alpinejs/src/utils/dispatch'
/**
 * Directive: x-dispatch
 *  <tag x-dispatch:value.[modifiers]="{expression}"></tag>
 *  value: event name
 *  modifiers: options ?
 *  expression: event detail
 */
export default function (Alpine) {
    Alpine.directive('dispatch', (el, { value, expression, modifiers }, { effect, evaluateLater }) => {
        let evaluate = evaluateLater(expression)
        
        effect(() => {
            evaluate(detail => {
                dispatch(el, value, detail)
            })
        })
    })
}



import { setData } from "../utils/set-data"

/**
 * Directive: x-store
 *  <tag x-store:value.[modifiers]="{expression}"></tag>
 *  value: store name
 *  modifiers: 
 *  expression: configuration
 */
export default function (Alpine) {
    Alpine.directive('store', (el, { value, expression, modifiers }, { Alpine, effect, evaluate, evaluateLater, cleanup }) => {
        Alpine.bind(el, {
            '@data-store.stop'(e){
                let storeName = value || 'x-data'
                let options = evaluate(expression || '{}')
                let response = e.detail
                let key = options.key || response.id
                
                if(storeName!=='x-data'){
                    let store = Alpine.store(storeName)
                    let obj = {}
                    obj[key] = response.data
                    if(!store){
                        Alpine.store(storeName, obj)
                    } else {
                        Alpine.store(storeName)[key] = response.data
                    }
                } else {
                    setData(el, key, response.data, Alpine)
                }
            }
        })
    })
}

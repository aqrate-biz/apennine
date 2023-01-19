import { addScopeToNode, refreshScope, scope } from '../../../alpinejs/src/scope'
import { initInterceptors } from '../../../alpinejs/src/interceptor'

export function setData(el, key, data, Alpine){
    let obj = scope(el)
    if(obj[key]===undefined) throw new Error('Key not present in scope')
    obj[key] = data
    //TODO if key is not already present
    /*let obj = {}
    obj[key] = data
    let reactiveObj = Alpine.reactive(obj)
    initInterceptors(reactiveObj)
    addScopeToNode(el, reactiveObj)
    refreshScope(el, scope(el))*/

}
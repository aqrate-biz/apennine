import { refreshScope } from '../../../alpinejs/src/scope'

export function setData(el, key, data){
    let obj = {}
    obj[key] = data
    refreshScope(el, obj)
}
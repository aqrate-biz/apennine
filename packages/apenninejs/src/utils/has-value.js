export function hasValue(value, type){
    return value!==null && value!==undefined && (''+value).trim()!==''
}
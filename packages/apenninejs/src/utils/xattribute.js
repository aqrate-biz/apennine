export function xAttribute(el, name, withValue) {
    let attributes = el.getAttributeNames()
    if(!name.startsWith('x-')) name = 'x-' + name
    if(withValue) name = name + ':' + withValue
    for(let a of attributes){
        if(a == name || a.startsWith(name + '.') || a.startsWith(name + ':')){
            return el.getAttribute(a)
        }
    }
    return null
}
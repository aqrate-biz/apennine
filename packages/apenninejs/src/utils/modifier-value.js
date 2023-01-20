export function modifierIntValue(name, modifiers, def){
    let index = modifiers.indexOf(name)
    if(index>=0){
        let next = modifiers[index + 1]
        if(next){
            return parseInt(next)
        } else {
            return def || null
        }
    } else {
        return def || null
    }
}

export function modifierTimeValue(name, modifiers, def){
    let index = modifiers.indexOf(name)
    if(index>=0){
        let next = modifiers[index + 1]
        if(next){
            let multiplier = null
            switch(next.replace(/[0-9]/g, '')){
                case 'm': multiplier = 1000 * 60; break
                case 'ms': multiplier = 1; break
                case 's': multiplier = 1000; break
            }
            if(multiplier===null){
                return def || null
            }
            return parseInt(next) * multiplier
        } else {
            return def || null
        }
    } else {
        return def || null
    }
}

export function modifierBooleanValue(name, modifiers){
    return modifiers.includes(name) || false
}

export function modifierInArrayValue(array, modifiers, def){
    for(let a of array){
        if(modifiers.includes(a)) return a
    }
    return def || null
}
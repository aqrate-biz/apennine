
import { FieldType } from '../classes/Field'

export const convertToDecimal = {
    priority: 100,
    name: 'convertToDecimal',
    fn: (el, context, params) => {
        let result = {}
        let field = context.fields[context.fieldName]
        let value = (''+field.value)
            .replace(new RegExp('\\' + context.Alpine.store('app').formats.thousands, 'g'), '')
            .replace(new RegExp('\\' + context.Alpine.store('app').formats.decimal, 'g'), '.')
        
        result.name = context.fieldName
        result.raw = parseFloat(value)
            
        return result
    }
}
import { hasValue } from '../utils/has-value'

export const validateRequired = {
    priority: 200,
    name: 'validateRequired',
    fn: (el, context, params) => {
        let field = context.fields[context.fieldName]
        let value = field.raw
        let result = {}
        if(!hasValue(value, field.type)){
            result.name = context.fieldName
            result.valid = false
            result.invalidRules = 'required'
        }
        return result
    }
}
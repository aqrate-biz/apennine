
import { FieldType } from '../classes/Field'

export const convertTrim = {
    priority: 100,
    name: 'convertTrim',
    fn: (el, context, params) => {
        let result = {}
        let field = context.fields[context.fieldName]
        let value = field.value
        if(FieldType.get(field.type).isOf('string')){
            if(value){
                result.name = context.fieldName
                result.raw = value.trim()
            }
        }
        return result
    }
}
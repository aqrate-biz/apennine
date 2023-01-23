import { convertToDecimal } from './convert-to-decimal'
import { convertToInt } from './convert-to-int'
import { convertTrim } from './convert-trim'

import { validateRequired } from "./validate-required"

export default function(Alpine){
    Alpine.actions.set(convertToDecimal)
    Alpine.actions.set(convertToInt)
    Alpine.actions.set(convertTrim)
    
    Alpine.actions.set(validateRequired)
}
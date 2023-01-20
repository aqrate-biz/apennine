import { convertTrim } from './convert-trim'

import { validateRequired } from "./validate-required"

export default function(Alpine){
    Alpine.actions.set(convertTrim)
    
    Alpine.actions.set(validateRequired)
}
export function camelize(s) {
    return s.replace(/-./g, x=>x[1].toUpperCase())
}
/**
 * Directive: x-format
 *  <tag x-format:value.[modifiers]="{expression}"></tag>
 *  value: html|text
 *  modifiers: formatters
 *  expression: value to be formatted, if undefined => innerHtml is formatted
 */
export default function (Alpine) {
    Alpine.directive('format', (el, { value, expression, modifiers }, { effect, evaluateLater }) => {
        
        let isHtml = value === 'html'
        let evaluate = evaluateLater(expression!==undefined && expression!=='' ? expression : '\'' + el.innerHTML + '\'')
        let formatters = modifiers.map((m) => Alpine.formatter.get(m))

        effect(() => {
            evaluate(value => {
                Alpine.mutateDom(() => {
                    if(!isHtml){
                        el.textContent = formatters.reduce((formatted, currentFormatter) => currentFormatter(formatted, el.$data), value)
                    } else {
                        el.innerHTML = formatters.reduce((formatted, currentFormatter) => currentFormatter(formatted, el.$data), value)

                        el._x_ignoreSelf = true
                        Alpine.initTree(el)
                        delete el._x_ignoreSelf
                    }
                })
            })
        })
    })

    Alpine.magic('format', () => { 
        return Alpine.formatter.format.bind(Alpine.formatter)
    }) 
}



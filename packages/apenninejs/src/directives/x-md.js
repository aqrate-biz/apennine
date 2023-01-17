import { parseMarkdownAsHtml } from 'md-json-parser'
/**
 * Directive: x-md
 *  <tag x-md:value.[modifiers]="{expression}"></tag>
 *  value:
 *  modifiers: 
 *  expression: markdown text to be converted to html
 */
export default function (Alpine) {
    Alpine.directive('md', (el, { value, expression, modifiers }, { effect, evaluateLater }) => {
        let evaluate = evaluateLater(expression)
        
        effect(() => {
            evaluate(value => {
                Alpine.mutateDom(async () => {
                    const {data, htmlBody} = await parseMarkdownAsHtml(value, {})
                    el.innerHTML = htmlBody
    
                    el._x_ignoreSelf = true
                    Alpine.initTree(el)
                    delete el._x_ignoreSelf
                })
            })
        })
    })
}



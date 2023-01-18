
/**
 * Directive: x-translate
 *  <tag x-translate:value.[modifiers]="{expression}"></tag>
 *  value: label key
 *  modifiers: optional lang
 *  expression: optional params (with _label if key is dynamic, _lang if lang is dynamic)
 */
export default function (Alpine) {
    Alpine.directive('translate', (el, { value, expression, modifiers }, { Alpine, effect, evaluate, evaluateLater, cleanup }) => {
        
        function getLang(current, modifier, param){
            let l = Alpine.i18n.getLanguage(current)
            if(modifier){
                l = Alpine.i18n.getLanguage(modifier, l)
            }
            if(param){
                l = Alpine.i18n.getLanguage(param, l)
            }
            return l
        }

        function getKey(value, param){
            let k = value
            if(param){
                k = param
            }
            return k
        }

        let evaluateLang = evaluateLater(`$config.languages.current`)
        let evaluateExp = evaluateLater(expression || '{}')
        
        function translate(lang, key, params){
            Alpine.mutateDom(() => {
                
                let content = Alpine.i18n.getLabel(lang, key, params)
                if(content!==null && content!==undefined){
                    el.innerHTML = content

                    el._x_ignoreSelf = true
                    Alpine.initTree(el)
                    delete el._x_ignoreSelf
                }
                
            })
        }

        effect(() => {
            evaluateLang(currentLang => {
                let m = modifiers[0] || null
                let params = expression ? evaluate(expression) : null
                let lang = getLang(currentLang, m, params ? params._lang : null)
                let key = getKey(value, params ? params._label : null)
                translate(lang, key, params)
            })
        })
        effect(() => {
            evaluateExp(params => {
                let m = modifiers[0] || null
                let lang = getLang(Alpine.store('config').languages.current, m, params ? params._lang : null)
                let key = getKey(value, params ? params._label : null)
                translate(lang, key, params)
            })
        })
    })
}


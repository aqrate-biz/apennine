
import { dispatch } from '../../../alpinejs/src/utils/dispatch'
import { modifierTimeValue, modifierInArrayValue } from '../utils/modifier-value'
/**
 * Directive: x-fetch
 *  <tag x-fetch:value.[modifiers]="{expression}"></tag>
 *  value: source
 *  modifiers: wait, refresh, auto, method (get,put,post,delete)
 *  expression: configuration
 *      {
 *          url
 *          callback
 *      }
 */
function fetchFn(el, connector, config, options){
    connector.fetch(config, options)
        .then(response => {
            response.setCaller(el)
            dispatch(el, 'data-fetched', response)
            if(options.method==='get' || !options.method){
                dispatch(el, 'data-store', response)
            }
        })
        .catch(response => {
            dispatch(el, 'error', response)
        })
}



export default function (Alpine) {
    Alpine.directive('fetch', (el, { value, expression, modifiers }, { Alpine, effect, evaluate, evaluateLater, cleanup }) => {
        let source = value

        let connector = source ? Alpine.connector[source] : null

        let evaluateExp = evaluateLater(expression || '{}')

        let options = {
            wait: modifierTimeValue('wait', modifiers, 0),
            refresh: modifierTimeValue('refresh', modifiers, 0),
            auto: !modifiers.includes['stop'],
            method: modifierInArrayValue(['get','put','post','delete'], modifiers, 'get')
        }
        if(options.method!=='get') options.auto = false

        let refreshInterval = null

        Alpine.bind(el, {
            '@data-fetch.stop'(e){
                fetchFn(el, connector, evaluate(expression), options)
            }
        })

        effect(() => {
            evaluateExp(config => {
                if(options.auto!==false){
                    setTimeout(() => {
                        fetchFn(el, connector, config, options)
                    }, options.wait || 0)
                    clearInterval(refreshInterval)
                    if(options.refresh>0){
                        refreshInterval = setInterval(() => { 
                            fetchFn(el, connector, evaluate(expression), options) 
                        }, options.refresh)
                    }
                }
            })
        })

        cleanup(() => {
            clearInterval(refreshInterval)
        })
    })

    Alpine.magic('fetch', (el, {Alpine}) => { 
        return (source, config, options) => { 
            let connector = source ? Alpine.connector[source] : null
            fetchFn(el, connector, config, options = { method: 'get'})
        }
    })
}

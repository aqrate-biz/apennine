
import { dispatch } from '../../../alpinejs/src/utils/dispatch'
import { setData } from '../utils/set-data'
/**
 * Directive: x-d
 *  <tag x-d:value.[modifiers]="{expression}"></tag>
 *  value: source
 *  modifiers: actions
 *  expression: configuration
 */
export default function (Alpine) {
    Alpine.directive('d', (el, directive, functions) => {
        let source = directive.value
        let actions = directive.modifiers

        let connector = source ? Alpine.connector[source] : null

        if(actions.includes('fetch')) handleFetch(el, directive, functions, connector)
        if(actions.includes('take')) handleTake(el, directive, functions, connector)
        if(actions.includes('send')) handleSend(el, directive, functions, connector)
    })
}

function handleFetch(el, { value, expression }, { Alpine, effect, evaluate, evaluateLater, cleanup }, connector){
    let evaluateExp = evaluateLater(expression || '{}')

    let refreshInterval = null

    let fetchFn = (options) => {
        connector.fetch(options)
            .then(response => {
                dispatch(el, 'data-fetched', response)
            })
            .catch(response => {
                dispatch(el, 'error', response)
            })
    }

    Alpine.bind(el, {
        '@data-fetch.stop'(e){
            fetchFn(evaluate(expression))
        }
    })

    effect(() => {
        evaluateExp(options => {
            options.wait = options.wait || 0
            if(options.auto!==false){
                setTimeout(() => {
                    fetchFn(options)
                }, options.wait)
                clearInterval(refreshInterval)
                if(options.refresh>0){
                    refreshInterval = setInterval(() => { fetchFn(options) }, options.refresh)
                }
            }
        })
    })

    cleanup(() => {
        clearInterval(refreshInterval)
    })
}

function handleTake(el, { value, expression }, { Alpine, effect, evaluate, evaluateLater, cleanup }, connector){
    
    Alpine.bind(el, {
        '@data-fetched.stop'(e){
            let options = evaluate(expression)
            let response = e.detail
            
            if(options.key){
                queueMicrotask(() => { setData(el, options.key, response.data) })
            }
            if(options.store){
                Alpine.store('data')[options.store] = response.data
            }
            if(options.callback){
                options.callback(response.data)
            }
            if(options.event){
                dispatch(el, options.event, response.data)
            }
            if(options.redirect){
                dispatch(el, '') //TODO
            }

        }
    })
}

function handleSend(el, { value, expression }, { Alpine, effect, evaluate, evaluateLater, cleanup }, connector){

    let sendFn = (options) => {
        connector.send(options)
            .then(response => {
                dispatch(el, 'data-sent', response)
            })
            .catch(response => {
                dispatch(el, 'error', response)
            })
    }

    Alpine.bind(el, {
        '@data-send.stop'(e){
            sendFn(evaluate(expression))
        }
    })
}
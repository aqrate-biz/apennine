
/**
 * Directive: x-logger
 *  <tag x-logger:value.[modifiers]="{expression}"></tag>
 *  value: logger type
 *  modifiers: level
 *  expression: what to log
 * 
 *  eventListener: log
 */
export default function (Alpine) {
    Alpine.directive('logger', (el, { value, expression, modifiers }, { Alpine, effect, evaluateLater }) => {
        
        let logger = Alpine.logger.get(value || 'console')
        let evaluate = evaluateLater(expression || 'undefined')
        let configLevel = modifiers[0] || 'error'
        
        effect(() => {
            evaluate(value => {
                
            })
        })

        function log(l){
            if(Alpine.Log.isToLog(l.level, configLevel) || l.forceLog){
                let t = Date.now() //- el._$('boot').time
                let _logger = logger
                if(l.logger) _logger = Alpine.logger.get(l.logger)
                _logger[Alpine.Log.getLevel(l.level)](Alpine.Log.getIcon(l.level), `{${t}}`, l.message, l.data || '')
            }
        }

        Alpine.bind(el, {
            '@log.stop'(e){
                log(e.detail)
            },
        })
    })
}



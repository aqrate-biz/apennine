import { merge } from "../utils/merge"
/**
 * Directive: x-app
 *  <body x-app:value.[modifiers]="{expression}"></body>
 *  value: app name
 *  modifiers: 
 *  expression: config
 */
export default function (Alpine) {

    Alpine.store('config', {
        init() {
            this.languages.browser = navigator.languages
        },
        change(obj){
            merge(this, obj)
        },

        languages: {
            browser: [],
            default: '',
            current: '',
            availables: []
        },
        urls: {
            session: '',
            labels: '',
            api: '',
            base: ''
        },
        defaults: {
            account: {},
            page: ''
        },
        states: {
            boot: 0
        }
    })

    Alpine.directive('app', (el, { value, expression, modifiers }, { effect, evaluateLater }) => {
        let evaluate = evaluateLater(expression)

        Alpine.store('config').change({ name: value })
        
        effect(() => {
            evaluate(value => {
                Alpine.store('config').change(value)
            })
        })
    })
}



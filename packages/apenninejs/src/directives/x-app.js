import { merge } from "../utils/merge"
/**
 * Directive: x-app
 *  <body x-app:value.[modifiers]="{expression}"></body>
 *  value: app name
 *  modifiers: 
 *  expression: config
 */
export default function (Alpine) {

    Alpine.store('app', {
        init() {
            this.boot.time = Date.now()
            this.languages.browser = navigator.languages
        },
        change(obj){
            merge(this, obj)
            if(!this.languages.current){
                this.languages.current = Alpine.i18n.getLanguage(this.languages.browser)
            }
        },
        changePage(page){
            this.routing.page = page
        },
        changeRoute(route){
            this.routing.route = route
        },

        routing: {
            routes: null,
            route: {},
            page: {}
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
            base: '',
            routes: '',
            templates: 'templates/'
        },
        boot: {
            time: 0,
            counter: 0,
            steps: {},
            success: null
        },
        session: {
            auth: false,
            account: {},
            defaultAccount: {}
        }
    })

    Alpine.directive('app', (el, { value, expression, modifiers }, { evaluateLater, effect, Alpine}) => {
        let app = Alpine.store('app')
        app.change({ name: value })

        let evaluateExp = evaluateLater(expression)
        let evaluateApp = evaluateLater('$store.app')
        
        window.addEventListener('error', (ev) => {
            ev.preventDefault()
            handleError(ev.error)
        })

        Alpine.bind(el, {
            '@error.stop'(e){
                handleError(e.detail)
            },
            '@route-change'(e){
                app.changeRoute(e.detail)
            },
            '@page-change'(e){
                app.changePage(e.detail)
            },
            '@authstate-change'(e){
                let account = e.detail
                app.change({ session: { auth: !!account.id, account: account }})
            }
        })

        effect(() => {
            evaluateExp(val => {
                app.change(val)
            })
        })

        let currentValues = {
            lang: null,
            routes: null,
            routesUrl: null,
            auth: null
        }
        effect(() => {
            evaluateApp(val => {
                if(val.languages.current!==currentValues.lang){
                    currentValues.lang = val.languages.current
                    bootStep(app, { name: 'loadLanguage', fn: Alpine.i18n.loadLanguage.bind(Alpine.i18n, val.languages.current) }, Alpine)
                }
                if(val.urls.routes!==currentValues.routesUrl){
                    currentValues.routesUrl = val.urls.routes
                    bootStep(app, { name: 'loadRoutes', fn: Alpine.router.loadRoutes.bind(Alpine.router) }, Alpine)
                }
                if(val.routing.routes!==currentValues.routes){
                    currentValues.routes = val.routing.routes
                    bootStep(app, { name: 'setRoutes', fn: fAlpine.router.init.bind(Alpine.router, routes) }, Alpine)
                }
                if(val.session.auth!==currentValues.auth){
                    currentValues.auth = val.session.auth
                    Alpine.router.resolve()
                }

            })
        })

        

    })

    Alpine.magic('app', () => { 
        return Alpine.store('app')
    }) 
}



function bootStep(app, step, Alpine){ //{name, fn}
    let obj = {
        boot: {
            counter: app.boot.counter,
            steps: {}
        }
    }
    obj.boot.steps[step.name] = { success: null }
    obj.boot.counter++
    if(app.boot.success!==false){
        obj.boot.success = null
    }
    app.change(obj)
    step.fn(app, Alpine).then((result) => {
        console.log(result)
        let obj = {
            boot: {
                counter: app.boot.counter-1,
                steps: {}
            }
        } 
        obj.boot.steps[step.name] = { success: true }
        if(app.boot.success===null && obj.boot.counter===0){
            obj.boot.success = true
        }
        app.change(obj)
    }).catch((err) => {console.error(err)
        let obj = {
            boot: {
                steps: {}
            }
        }
        obj.boot.steps[step.name] = {}
        obj.boot.steps[step.name].success = false
        obj.boot.steps[step.name].error = err
        obj.boot.success = false
        app.change(obj)
    })
}

function handleError(err){
    console.error(err)
}



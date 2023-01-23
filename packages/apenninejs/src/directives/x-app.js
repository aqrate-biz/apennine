import { merge } from "../utils/merge"
import { getDiff } from 'recursive-diff'
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
            base: '/',
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
            config: '',
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
        },
        formats: {
            decimal: ',',
            thousands: '_',
            date: 'dd/mm/yyyy'
        }
    })

    Alpine.directive('app', (el, { value, expression, modifiers }, { evaluate, evaluateLater, effect, Alpine}) => {
        let app = Alpine.store('app')
        let currentApp = JSON.parse(JSON.stringify(app))
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
            },
        })

        effect(() => {
            evaluateExp(val => {
                app.change(val)
            })
        })

        
        effect(() => {
            evaluateApp(val => {
                let newApp = JSON.parse(JSON.stringify(val))
                let mutations = getDiff(currentApp, newApp)
                currentApp = newApp
                //console.log(mutations)
                for(let mutation of mutations){
                    if(mutation.val && ['update','add'].indexOf(mutation.op)>=0){
                        let path = mutation.path.join('.')
                        //console.log(path)
                        switch(path){
                            case 'urls.config': //load configuration
                                bootStep(app, { name: 'LoadConfig', fn: loadConfig.bind(this, app) }, Alpine)
                                break
                            case 'languages.current': //load current language
                                bootStep(app, { name: 'LoadLanguage', fn: Alpine.i18n.loadLanguage.bind(Alpine.i18n, app.languages.current) }, Alpine)            
                                break
                            case 'routing.base': //init router
                                bootStep(app, { name: 'InitRouter', fn: Alpine.router.init.bind(Alpine.router, app.routing.base) }, Alpine)
                                break
                            case 'urls.routes': //load routes
                                bootStep(app, { name: 'LoadRoutes', fn: Alpine.router.loadRoutes.bind(Alpine.router) }, Alpine)
                                break
                            case 'routing.routes': //set routes
                                bootStep(app, { name: 'SetRoutes', fn: Alpine.router.initRoutes.bind(Alpine.router, app.routing.routes) }, Alpine)
                                break
                            case 'session.auth': //changes auth state
                                Alpine.router.resolve()
                                break 
                        }
                    }
                }

            })
        })

        

    })

    Alpine.magic('app', () => { 
        return Alpine.store('app')
    }) 
}

async function loadConfig(app){
    return new Promise(async (resolve, reject) => {
        let response = await fetch(new URL(
                app.urls.config, 
                app.urls.base
                ), 
            {
                method: 'GET',
                cache: 'no-cache'
            })
        if(response.ok){
            let json = await response.json()
            app.change(json)
            resolve(true)
        } else {
            reject()
        }
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
    }).catch((err) => {
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



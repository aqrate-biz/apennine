import Navigo from 'navigo'

export class Router {

    constructor(Alpine){
        this.Alpine = Alpine
        this.router = null;
        this.loginPage = null
        this.errorPage = null
        this.notFoundPage = null
    }

    async init(base){
        this.router = new Navigo(base)
        return Promise.resolve(true)
    }
    
    async initRoutes(pages){
        for(const [name, page] of Object.entries(pages)){
            switch(page.role){
                case 'normal': this.setRoute(name, page); break
                case 'splash': this.setPage(page); break
                case 'login': this.loginPage = page; break
                case 'error': this.errorPage = page; break
                case 'notFound': this.notFoundPage = page; break
            }
        }
        return Promise.resolve(true)
    }

    async loadRoutes(){
        return new Promise(async (resolve, reject) => {
            let response = await fetch(new URL(
                    this.Alpine.store('app').urls.routes, 
                    this.Alpine.store('app').urls.base
                    ), 
                {
                    method: 'GET',
                    cache: 'no-cache'
                })
            if(response.ok){
                let routes = await response.json()
                this.Alpine.store('app').routing.routes = routes
                resolve(true)
            } else {
                reject()
            }
        })
    }

    resolve(){
        this.router.resolve()
    }

    setPage(page){
        this.Alpine.store('app').changePage(page)
    }

    setRoute(name, page){
        /*
            type Match = {
                url: string;
                queryString: string;
                hashString: string;
                route: Route;
                data: Object | null;
                params: Object | null;
                };
            */
        this.router.on(page.route, (match) => {
            if(page.authentication && (!this.Alpine.store('session') || !this.Alpine.store('session').auth)) {
                this.setPage(this.loginPage)
            } else {
                this.setPage(page)
            }
        },{
            before(done, match){
                done()
            },
            after(match){
                this.Alpine.store('app').changeRoute(match)
            },
            leave(done, match) {
                done()
            },
            already(match){
                
            }
        })
    }

}

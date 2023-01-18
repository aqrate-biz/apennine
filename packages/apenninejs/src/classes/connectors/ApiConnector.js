import { ConnectorResponse } from "./ConnectorResponse"

export class ApiConnector{
    
    constructor(Alpine){
        this.Alpine = Alpine
    }

    getUrl(options) {
        let s = options.url
        let params = options.params
        if(params && Object.keys(params).length>0){
            s = s + '?' + new URLSearchParams(params).toString()
        }
        let url = new URL(s, this.Alpine.store('config').urls.api)
        let referer = window.location.origin
        return {
            url: url,
            cors: url.origin!==referer
        }
    }

    async fetch(options){
        return new Promise((resolve, reject) => {
            let Url = this.getUrl(options)
            fetch(Url.url, {
                method: 'GET',
                mode: Url.cors ? 'cors' : 'same-origin',
                credentials: 'include',
                cache: 'no-store', //TODO
            })
            .then(async (response) => { 
                if (!response.ok) {
                    reject(new ConnectorResponse(response.status, null, response))
                }
                let json = await response.json()
                resolve(new ConnectorResponse(response.status, json, response)) 
            })
            .catch(err => {
                reject(new ConnectorResponse(response.status, null, err))
            })
        })
    }
    async send(options){
        return new Promise((resolve, reject) => {
            let Url = this.getUrl(options)
            fetch(Url.url, {
                method: options.method || (options.data.id || options.data.Id ? 'PUT' : 'POST'), //can be DELETE also
                body: data,
                mode: Url.cors ? 'cors' : 'same-origin',
                credentials: 'include',
                cache: 'no-store', //TODO
            })
            .then(async (response) => { 
                if (!response.ok) {
                    reject(new ConnectorResponse(response.status, null, response))
                }
                let json = await response.json()
                resolve(new ConnectorResponse(response.status, json, response)) 
            })
            .catch(err => {
                reject(new ConnectorResponse(response.status, null, err))
            })
        })
    }
}
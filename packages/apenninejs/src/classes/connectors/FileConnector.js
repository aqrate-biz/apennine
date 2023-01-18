import { ConnectorResponse } from "./ConnectorResponse"

export class FileConnector{
    
    constructor(Alpine){
        this.Alpine = Alpine
    }

    getUrl(options) {
        let s = options.url
        let params = options.params
        if(params && Object.keys(params).length>0){
            s = s + '?' + new URLSearchParams(params).toString()
        }
        let url = new URL(s, this.Alpine.store('config').urls.base)
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
                let data = null
                if(response.headers.get('Content-Type').indexOf('json')>=0){
                    data = await response.json()
                } else {
                    data = await response.text()
                }
                resolve(new ConnectorResponse(response.status, data, response)) 
            })
            .catch(err => {
                reject(new ConnectorResponse(500, null, err))
            })
        })
    }
    async send(options){
        return Promise.reject(new ConnectorResponse(405, null, options))
    }
}
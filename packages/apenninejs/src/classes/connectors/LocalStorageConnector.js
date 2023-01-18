import { ConnectorResponse } from "./ConnectorResponse"

export class LocalStorageConnector{
    constructor(Alpine){
        this.Alpine = Alpine
    }

    async fetch(options){
        return new Promise((resolve, reject) => {
            let data = window.localStorage.getItem(options.key || options.url)
            if(data!==null) {
                resolve(new ConnectorResponse(true, JSON.parse(data), data))
            } else {
                reject(new ConnectorResponse(404, null, options))
            }
        })
    }
    async send(options){
        return new Promise((resolve, reject) => {
            try{
                window.localStorage.setItem(options.key || options.url, JSON.stringify(options.data))
                resolve(new ConnectorResponse(201, window.localStorage.getItem(options.key || options.url), options))
            } catch(err){
                reject(new ConnectorResponse(500, null, err))
            }
        })
    }
}
import { ConnectorResponse } from "./ConnectorResponse"

export class LocalStorageConnector{
    constructor(Alpine){
        this.Alpine = Alpine
    }

    async fetch(config, options){
        if(options.method==='get' || !options.method){
            return new Promise((resolve, reject) => {
                let data = window.localStorage.getItem(config.key || config.url)
                if(data!==null) {
                    resolve(new ConnectorResponse(true, JSON.parse(data), data))
                } else {
                    reject(new ConnectorResponse(404, null, config))
                }
            })
        } else if(options.method==='delete'){
            return new Promise((resolve, reject) => {
                window.localStorage.removeItem(config.key || config.url)
                resolve(new ConnectorResponse(true, null, config))
            })
        } else {
            return new Promise((resolve, reject) => {
                try{
                    window.localStorage.setItem(config.key || config.url, JSON.stringify(config.data))
                    resolve(new ConnectorResponse(201, window.localStorage.getItem(config.key || config.url), options))
                } catch(err){
                    reject(new ConnectorResponse(500, null, err))
                }
            })
        }
    }
}
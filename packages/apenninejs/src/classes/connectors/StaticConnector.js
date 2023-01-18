import { ConnectorResponse } from "./ConnectorResponse"

export class StaticConnector{
    constructor(Alpine){
        this.Alpine = Alpine
    }

    async fetch(options){
        return Promise.resolve(new ConnectorResponse(true, options, options))
    }
    async send(options){
        return Promise.reject(new ConnectorResponse(405, null, options))
    }
}
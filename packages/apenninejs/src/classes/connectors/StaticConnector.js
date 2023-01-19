import { ConnectorResponse } from "./ConnectorResponse"

export class StaticConnector{
    constructor(Alpine){
        this.Alpine = Alpine
    }

    async fetch(config, options){
        return Promise.resolve(new ConnectorResponse(true, config, options))
    }
}
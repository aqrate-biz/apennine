import { camelize } from "../utils/camelize"

import { ApiConnector } from "./connectors/ApiConnector"
import { FileConnector } from "./connectors/FileConnector"
import { LocalStorageConnector } from "./connectors/LocalStorageConnector"
import { StaticConnector } from "./connectors/StaticConnector"

export class Connector{

    constructor(Alpine){
        this.Alpine = Alpine
        
        this.static = new StaticConnector(this.Alpine)
        this.api = new ApiConnector(this.Alpine)
        this.local = new LocalStorageConnector(this.Alpine)
        this.file = new FileConnector(this.Alpine)
    }

    get(name){
        return this[camelize(name)].bind(this)
    }
    set(name, cls){
        if(name && cls){
            Connector.prototype[camelize(name)] = new cls(this.Alpine)
        }
    }

    
}

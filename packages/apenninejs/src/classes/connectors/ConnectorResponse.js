export class ConnectorResponse{
    constructor(result, data, response){
        this.status = result===true ? 200 : result
        this.data = data
        this.response = response
    }

    get success() { return this.status>=200 && this.status<=299 }

    setCaller(el){
        this.caller = el
        this.id = el.id
    }
}
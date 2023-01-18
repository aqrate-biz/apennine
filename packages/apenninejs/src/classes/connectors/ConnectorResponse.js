export class ConnectorResponse{
    constructor(result, data, response){
        this.status = result===true ? 200 : result
        this.data = data
        this.response = response
    }
}
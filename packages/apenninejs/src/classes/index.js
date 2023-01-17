import { Formatter } from './Formatter'
import { Log } from './Log'
import { Logger } from './Logger'


export default function (Alpine) {
    Alpine.formatter = new Formatter(Alpine)
    Alpine.Log = Log
    Alpine.logger = new Logger(Alpine)
    
}

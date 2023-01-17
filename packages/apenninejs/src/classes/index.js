import { Formatter } from './Formatter'
import { Log } from './Log'
import { Logger } from './Logger'
import { Template } from './Template'


export default function (Alpine) {
    Alpine.formatter = new Formatter(Alpine)
    Alpine.Log = Log
    Alpine.logger = new Logger(Alpine)
    Alpine.templates = new Template(Alpine)
}

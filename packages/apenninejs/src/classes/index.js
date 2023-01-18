import { Formatter } from './Formatter'
import { I18n } from './I18n'
import { Log } from './Log'
import { Logger } from './Logger'
import { Template } from './Template'


export default function (Alpine) {
    Alpine.formatter = new Formatter(Alpine)
    Alpine.i18n = new I18n(Alpine)
    Alpine.Log = Log
    Alpine.logger = new Logger(Alpine)
    Alpine.templates = new Template(Alpine)
}

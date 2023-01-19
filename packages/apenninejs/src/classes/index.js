import { Connector } from './Connector'
import { Field, FieldType } from './Field'
import { Form } from './Form'
import { Formatter } from './Formatter'
import { I18n } from './I18n'
import { Log } from './Log'
import { Logger } from './Logger'
import { Template } from './Template'


export default function (Alpine) {
    Alpine.connector = new Connector(Alpine)
    Alpine.formatter = new Formatter(Alpine)
    Alpine.i18n = new I18n(Alpine)
    Alpine.logger = new Logger(Alpine)
    Alpine.templates = new Template(Alpine)

    Alpine.Log = Log
    Alpine.Field = Field
    Alpine.FieldType = FieldType
    Alpine.Form = Form
}

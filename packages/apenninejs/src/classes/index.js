import { Action } from './Action'
import { ActionRepository } from './ActionRepository'
import { Connector } from './Connector'
import { Field, FieldType } from './Field'
import { Form } from './Form'
import { Formatter } from './Formatter'
import { I18n } from './I18n'
import { Log } from './Log'
import { Logger } from './Logger'
import { Router } from './Router'
import { Template } from './Template'

import actions from '../actions/index'

export default function (Alpine) {
    Alpine.actions = new ActionRepository(Alpine)
    Alpine.connector = new Connector(Alpine)
    Alpine.formatter = new Formatter(Alpine)
    Alpine.i18n = new I18n(Alpine)
    Alpine.logger = new Logger(Alpine)
    Alpine.router = new Router(Alpine)
    Alpine.templates = new Template(Alpine)

    actions(Alpine)

    Alpine.Action = Action
    Alpine.Log = Log
    Alpine.Field = Field
    Alpine.FieldType = FieldType
    Alpine.Form = Form
}

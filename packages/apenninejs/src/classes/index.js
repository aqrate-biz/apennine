import { Logger } from './Logger'
import { Log } from './Log'

export default function (Alpine) {
    Alpine.logger = new Logger(Alpine)
    Alpine.Log = Log
}

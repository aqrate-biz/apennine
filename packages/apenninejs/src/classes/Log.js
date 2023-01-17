export class Log {
    constructor(level, source, location, data){
        this.time = Date.now()
        this.level = Log.getLevel(level)
        this.message = source + ' ' + location
        this.data = data
    }

    static levelValue(l){
        switch(l){
            case 'error': return 40
            case 'warn': return 30
            case 'info': return 20
            case 'debug':
            default: return 10
        }
    }

    static isToLog(logLevel, configLevel){
        return Log.levelValue(Log.getLevel(logLevel)) >= Log.levelValue(Log.getLevel(configLevel))
    }

    static getLevel(s){
        switch(s){
            case 'debug':
            case 'd':
            case '⚪️':
                return 'debug'
            case 'info':
            case 'i':
            case '🔵':
                return 'info'
            case 'warn':
            case 'w':
            case '🟡':
                return 'warn'
            case 'error':
            case 'e':
            case '🔴':
                return 'error'
        }
    }

    static getIcon(l){
        l = Log.getLevel(l)
        switch(l){
            case 'error': return '🔴'
            case 'warn': return '🟡'
            case 'info': return '🔵'
            case 'debug': return '⚪️'
        }
    }
}
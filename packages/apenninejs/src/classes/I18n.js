import { camelize } from "../utils/camelize"

export class I18n{

    constructor(Alpine){
        this.Alpine = Alpine
        this.labels = {}
    }

    _n(s, onlyL){
        let l = s.replace(/\_/g, '-').toLowerCase()
        if(onlyL){
            l = l.split('-')[0]
        }
        return l
    }

    setLanguage(lang, labels){
        lang = this._n(lang)
        this.labels[lang] = labels
    }

    getLanguage(langs, def){
        let langConfig = this.Alpine.store('config').languages
        if(typeof langs === 'string') langs = [langs]
        for(let lang of langs){
            for(let l of langConfig.availables){
                if(this._n(lang)===this._n(l)) return this._n(l)
            }
        }
        for(let lang of langs){
            for(let l of langConfig.availables){
                if(this._n(lang, true)===this._n(l, true)) return this._n(l)
            }
        }
        return this._n(def || langConfig.default)
    }

    getLabel(lang, key, params){
        if(!lang) lang = Alpine.store('config').languages.current
        lang = this._n(lang)
        key = camelize(key)
        let label = ''
        if(!this.labels[lang]){
            lang = this.Alpine.store('config').languages.default
        }
        label = this.labels[lang][key]!==undefined ? this.labels[lang][key] : key
        if(params){
            for(let k of Object.keys(params)){
                label = label.replace(new RegExp('\\$\\{' + k + '\\}', 'g'), params[k])
            }
        }
        return label
    }
}
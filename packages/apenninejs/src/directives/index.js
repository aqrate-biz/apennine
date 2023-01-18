import xApp from './x-app'
import xD from './x-d'
import xDispatch from './x-dispatch'
import xFormat from './x-format'
import xJson from './x-json'
import xLogger from './x-logger'
import xMd from './x-md'
import xSourcecode from './x-sourcecode'
import xTemplate from './x-template'
import xTranslate from './x-translate'


export default function (Alpine) {
    xApp(Alpine)
    xD(Alpine)
    xDispatch(Alpine)
    xFormat(Alpine)
    xJson(Alpine)
    xLogger(Alpine)
    xMd(Alpine)
    xSourcecode(Alpine)
    xTemplate(Alpine)
    xTranslate(Alpine)
}

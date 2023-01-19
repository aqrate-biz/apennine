import xApp from './x-app'
import xDispatch from './x-dispatch'
import xFetch from './x-fetch'
import xFormat from './x-format'
import xJson from './x-json'
import xLogger from './x-logger'
import xMd from './x-md'
import xSourcecode from './x-sourcecode'
import xStore from './x-store'
import xTemplate from './x-template'
import xTranslate from './x-translate'


export default function (Alpine) {
    xApp(Alpine)
    xDispatch(Alpine)
    xFetch(Alpine)
    xFormat(Alpine)
    xJson(Alpine)
    xLogger(Alpine)
    xMd(Alpine)
    xSourcecode(Alpine)
    xStore(Alpine)
    xTemplate(Alpine)
    xTranslate(Alpine)
}

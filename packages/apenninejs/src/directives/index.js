import xApp from './x-app'
import xDispatch from './x-dispatch'
import xJson from './x-json'
import xLogger from './x-logger'
import xMd from './x-md'
import xSourcecode from './x-sourcecode'


export default function (Alpine) {
    xApp(Alpine)
    xDispatch(Alpine)
    xJson(Alpine)
    xLogger(Alpine)
    xMd(Alpine)
    xSourcecode(Alpine)
}

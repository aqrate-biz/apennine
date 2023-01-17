import xJson from './x-json'
import xSourcecode from './x-sourcecode'
import xMd from './x-md'
import xDispatch from './x-dispatch'
import xLogger from './x-logger'

export default function (Alpine) {
    xJson(Alpine)
    xSourcecode(Alpine)
    xMd(Alpine)
    xDispatch(Alpine)
    xLogger(Alpine)
}

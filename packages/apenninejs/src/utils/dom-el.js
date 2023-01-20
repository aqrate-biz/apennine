
export function domEl(html) {
    let dom = document.createElement('div')
    dom.innerHTML = html
    return dom.firstChild
}

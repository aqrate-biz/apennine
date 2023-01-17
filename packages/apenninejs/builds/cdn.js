import classes from '../src/classes/index'
import directives from '../src/directives/index'

document.addEventListener('alpine:init', () => {
    classes(window.Alpine)
    window.Alpine.plugin(directives)
})
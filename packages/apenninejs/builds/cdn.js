import directives from '../src/directives/index.js'

document.addEventListener('alpine:init', () => {
    window.Alpine.plugin(directives)
})
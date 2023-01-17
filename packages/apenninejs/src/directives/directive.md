

export default function (Alpine) {
    Alpine.directive('[name]', (el, { value, modifiers, expression }, { Alpine, effect, cleanup, evaluate, evaluateLater }) => {

        [...code...]

    })
}
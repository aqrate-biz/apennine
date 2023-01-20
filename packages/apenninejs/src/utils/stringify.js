export function stringifyCircularJSON(obj, options, spaces) {
    const seen = new WeakSet();
    return JSON.stringify(obj, (k, v) => {
        if(options.notAlpine && k==='Alpine') return undefined
        if (v !== null && typeof v === 'object') {
            if (seen.has(v)) return;
            seen.add(v);
        }
        if(options.functions && typeof v === 'function'){
            return 'Function'
        }
        return v;
    }, spaces);
};

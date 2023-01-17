export default function stringifyCircularJSON(obj, f, spaces) {
    const seen = new WeakSet();
    return JSON.stringify(obj, (k, v) => {
        if (v !== null && typeof v === 'object') {
            if (seen.has(v)) return;
            seen.add(v);
        }
        return v;
    }, spaces);
};

function tryargs(o, p){
    if (o.args) {
        let val = Object.assign({}, o)
        val.args = p.split('/').filter(x => x !== '' && !isNaN(x)).map(x => Number(x))
        return val
    }
    return false
}

function buildresolver(schema) {
    let f = (o, p, m) => {
        if(o.$count){
            oc = JSON.parse(JSON.stringify(o))
            delete oc.$count
            for(let i=0; i < o.$count; i++){
                f(oc, `${p}/${i}`, m)
            }
            return
        }
        if( o.$type ) {
            let val = tryargs(o,p)
            if ( val ){
                map.set(p,val)
            }
            return
        }
        for ( let [key,value] of Object.entries(o) ) {
            if ( value.$type ) {
                let val = tryargs(value,p)
                if ( val ){
                    map.set(p,val)
                }
            }
            f(value, `${p}/${key}`, m)
        }
    }
    let map = new Map()
    f(schema, '', map)
    return x => map.get(x)
}

module.exports = buildresolver
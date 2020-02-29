const express = require('express')
const config = require('./config.json');
const schema = require('./schema.json')
const buildresolver = require('./utility')
const app = express()
const args = process.argv.slice(2)
console.log(config)
const settings = ( args.length ) ? config[args[0]] : config.production

let resolve = buildresolver(schema)

function doget(req,res){
    if (req.originalUrl == '/schema'){
        res.status(200).json(schema)
    }
    let props = resolve(req.originalUrl)
    if (props && props.r) {
        res.status(200).json({ path: req.originalUrl, data: controller[props.r]()}) 
    } else {
        res.json({error: 'Bad request'})
    } 
}

function dopatch(req,res){
    let rs = (req.body.path) ? [req.body] : req.body
    let responses = []
    for (r of rs){
        let props = resolve(r.path)
        if (props && props.w) {
            responses.push(
                {
                    path: r.path, 
                    data:controller[props.w](...props.args, r.value)
                }
            ) 
        } else {
            res.json({error:'Bad Request'})
        }
    }
    res.json(responses)
     
}

// mock controller for playing
let controller = {
    getFirmwareVersion : () => {
        return '6.6.6'
    },
    setRelay : (index, state) => state
}

app.use(express.static('dist'))
app.use(express.json())
app.get('/*', doget)
app.patch('/*', dopatch)
app.post('/*', dopatch)
console.log(settings.http.port)
app.listen(settings.http.port, () => console.log(`BOOM!`))


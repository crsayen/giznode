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
    let props = resolve(req.originalUrl)
    if (props && props.r) {
        res.status(200).json(controller[props.r]()) 
    } else {
        res.status(400).send('Bad Request')
    } 
}

function dopatch(req,res){
    let props = resolve(req.body.path)
    if (props && props.w) {
        res.status(200).json(
            {
                path: req.body.path, 
                data:controller[props.w](...props.args, req.body.value)
            }
        ) 
    } else {
        res.status(400).send('Bad Request')
    } 
}

// mock controller for playing
let controller = {
    getFirmwareVersion : () => {
        console.log('666!!!')
        return { path: req.originalUrl, data: '6.6.6' }
    },
    setRelay : (index, state) => {
        console.log(state)
        return {relay: index, state: state} 
    }
}


app.use(express.json())
app.get('/*', doget)
app.patch('/*', dopatch)
app.post('/*', dopatch)
console.log(settings.http.port)
app.listen(settings.http.port, () => console.log(`BOOM!`))


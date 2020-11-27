const iterator = require("./faucet")
const env = require('dotenv').config()

const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')

app.use(cors())
app.use(express.json());       // to support JSON-encoded bodies
app.post('/faucetRequest', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log(req.body.address)
    const response = iterator.handleFaucetRequest(req.body.address)
    res.send(response)
})

iterator.runner()

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
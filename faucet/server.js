const iterator = require("./faucet")
const env = require('dotenv').config()

const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')

app.use(cors())
app.options('*', cors());
app.use(express.json());       // to support JSON-encoded bodies
app.post('/faucetRequestred'res) => {

    console.log(req.body.address)
    const response = iterator.handleFaucetRequest(req.body.address)
    res.send(response)
})

iterator.runner()

app.listen(port, "0.0.0.0",() => {
    console.log(`Example app listening at http://localhost:${port}`)
})
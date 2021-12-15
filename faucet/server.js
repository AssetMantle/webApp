const iterator = require("./faucet")
const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')
const rateLimit = require("express-rate-limit")
const constants = require("./constants")

const limiter = rateLimit({
    windowMs: constants.IP_WINDOW, // 24 hours
    max: constants.IP_DRIP_LIMIT, // limit each IP to 10 requests per windowMs
    message: "Too many drip requested from this IP, please try again in 24Hrs"
});


app.use(cors())
app.use(express.json());       // to support JSON-encoded bodies
app.post('/faucetRequest', limiter, (req, res) => {
    const response = iterator.handleFaucetRequest(req.body.address)
    res.send(response)
})

iterator.runner()

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
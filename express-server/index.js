const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000
const Nexmo = require('nexmo');
const config = require('./nexmoapis');           //import keys 

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

const nexmo = new Nexmo({
    apiKey: config.apiKey /*process.env.NEXMO_API_KEY*/,
    apiSecret: config.apiSecret /*process.env.NEXMO_API_SECRET*/,
});

app.get('/', (req, res) => {
    res.send({message: "Hello, world!"});
});

app.post('/request', (req, res) => {     //this will be called when send otp api is called
    
    if (!req.body.number) {            //if request body doesn't have number
        res.status(400).send({message: "You must supply a `number` prop to send the request to"})
        return;
    }
    //console.log(req);
    nexmo.verify.request({
        number: req.body.number,
        brand: 'TapToTalk Auth',
        // We could put `'6'` instead of `'4'` if we wanted a longer verification code
        code_length: '4'
    }, (err, result) => {
        if (err) {
        
            // If there was an error, return it to the client
            res.status(500).send(err.error_text);
            return;
        }
        //console.log(result);
        // Otherwise, send back the request id. This  data is integral to the next step
        const requestId = result.request_id;
        console.log(requestId);
        res.send({requestId});
    });
})

app.post('/verify', (req, res) => {        //we be called when verify otp api is called 
    // We require clients to submit a request id (for identification) and a code (to check)

    if (!req.body.requestId || !req.body.code) {
        res.status(400).send({message: "You must supply a `code` and `request_id` prop to send the request to"})
        return;
    }
    
    // Run the check against Vonage's servers
    nexmo.verify.check({
        request_id: req.body.requestId,
        code: req.body.code
    }, (err, result) => {
        if (err) {
            res.status(500).send(err.error_text);
            return;
        }
        res.send(result);
    });
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))


/*
{
    "request_id": "0f55bff6d0a44ea494ec8e608c751d23",
    "status": "16",
    "error_text": "The code provided does not match the expected value"
}
*/

/* 
{
    "request_id": "0f55bff6d0a44ea494ec8e608c751d23",
    "status": "0",
    "event_id": "130000012D206340",
    "price": "0.05000000",
    "currency": "EUR",
    "estimated_price_messages_sent": "0.01550000"
}
*/

/* 
{
    "status": "6",
    "error_text": "The Nexmo platform was unable to process this message for the following reason: Request '0f55bff6d0a44ea494ec8e608c751d23' was not found or it has been verified already."
}
*/

/*
{}  without +91 or wrong number
*/

/*
{
    "requestId": "287e69afbfa54839953aae741365467d"
}       
*/
//correct


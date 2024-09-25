// import express from 'express';
// import axios from 'axios';
const express = require("express");
const axios = require("axios");
const winston = require("winston");
const { resolve } = require("path");
const { rejects } = require("assert");
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

const app = express();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Replace with your actual token and chat ID
const TELEGRAM_TOKEN = '7515756008:AAHbStxPySuqNam2QBnlTruRjCwjDjn1Ssk';
const CHAT_ID = '-4540754160'; // You can get this by sending a message to your bot and checking the updates
const PORT = 3000;

// Define the function to send messages to Telegram
async function sendTelegramMessage(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    const payload = {
        chat_id: CHAT_ID,
        text: message,
    };

    logger.info(payload);

    try {
        await axios.post(url, payload);
        console.log('Message sent successfully');
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

async function generateTime(times) {
    return new Promise((resolve, rejects) => {
        let unix_timestamp = times;

        // // Create a new JavaScript Date object based on the timestamp
        // // multiplied by 1000 so that the argument is in milliseconds, not seconds
        // var date = new Date(unix_timestamp * 1000);
        
        // // Hours part from the timestamp
        // var hours = date.getHours();
        
        // // Minutes part from the timestamp
        // var minutes = "0" + date.getMinutes();
        
        // // Seconds part from the timestamp
        // var seconds = "0" + date.getSeconds();
        
        // // Will display time in 10:30:23 format
        // var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

        const date = new Date(unixTimestamp * 1000);
        const formattedTime = date.toLocaleTimeString();
        
        resolve(formattedTime);
    });
}

app.get("/", (req, res) => {
    // const message = req.params.text;
    // sendTelegramMessage(message);
    logger.info('running index');
    return res.send("What the hell")
});

app.post("/sendError", async (req, res) => {
    // {
    //     "level":"info",
    //     "message": {
    //         "issue": {
    //             "availabilityZone":"not available",
    //             "container":"not available",
    //             "containerNames":[],
    //             "customZone":"not available",
    //             "description":"It works!",
    //             "end":1727238428982,
    //             "entity":"not available",
    //             "entityLabel":"not available",
    //             "fqdn":"not available",
    //             "id":"TG3-bq2zSW6vpJKF5OQeuQ",
    //             "link":"https://www.ibm.com/docs/obi/current?topic=alerting-webhooks",
    //             "manualCloseReason":"test-reason",
    //             "manualCloseTimestamp":"1727238418982",
    //             "manualCloseUsername":"test-username",
    //             "metricNames":[],
    //             "service":"not available",
    //             "start":1727238418982,
    //             "tags":"not available",
    //             "text":"Alert Channel test",
    //             "type":"change",
    //             "zone":"not available"
    //         }
    //     }
    // }
    const data = req.body.issue;
    const start = await generateTime(data.start);
    const end = await generateTime(data.end);

    const message = "Event Id: "+data.id+ "\n"
                    +"Zone: "+data.zone+ "\n"
                    +"Host: "+data.customPayloads+ "\n"
                    +"State: "+data.state+ "\n"
                    +"Type: "+data.type+ "\n"
                    +"Text: "+data.text+ "\n"
                    +"Suggestion: "+data.suggestion +"\n"
                    +"Start: "+start +"\n"
                    +"End: "+end+"\n"
                    +"Link: "+data.link+ "\n"
    await sendTelegramMessage(message);

    return res.send("second");
});

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
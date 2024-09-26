// import express from 'express';
// import axios from 'axios';
const express = require("express");
const axios = require("axios");
const winston = require("winston");
const moment = require("moment");

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

    // logger.info(payload);

    try {
        await axios.post(url, payload);
        console.log('Message sent successfully');
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

async function generateTime(times) {
    return new Promise((resolve, rejects) => {
        // The Unix timestamp in milliseconds
        const unixTimestamp = times;

        // Create a Date object from the timestamp
        const date = new Date(unixTimestamp);

        // Define options for formatting
        const options = {
            timeZone: 'Asia/Jakarta', // Indonesian timezone
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // 24-hour format
        };

        // Format the date
        const formatter = new Intl.DateTimeFormat('id-ID', options);
        const formattedDate = formatter.format(date);

        // console.log(formattedDate);
        
        resolve(formattedDate);
    });
}

app.get("/", (req, res) => {
    // const message = req.params.text;
    // sendTelegramMessage(message);
    logger.info('running index');
    return res.send("What the hell")
});

app.get("/test", (req, res) => {
    // // Sample JSON object
    // const jsonData = {
    //     "customPayloads": {
    //     "custom:host": [
    //         "ipm-ibm-lab-dem"
    //     ],
    //     "custom:message": [
    //         "Tes kirim notif error"
    //     ]
    //     }
    // };
    
    // // Access the custom:host value
    // const customHost = jsonData.customPayloads['custom:host'];
    
    // // Log the value
    // console.log('Custom Host:', customHost[0]); // Output: ipm-ibm-lab-dem

    // The Unix timestamp in milliseconds
    const unixTimestamp = 1727319831623;

    // Create a Date object from the timestamp
    const date = new Date(unixTimestamp);

    // Define options for formatting
    const options = {
        timeZone: 'Asia/Jakarta', // Indonesian timezone
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24-hour format
    };

    // Format the date
    const formatter = new Intl.DateTimeFormat('id-ID', options);
    const formattedDate = formatter.format(date);

    console.log(formattedDate);

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
    logger.info(req.body);
    const data = req.body.issue;
    const start = await generateTime(data.start);
    const end = data.end === undefined ? undefined : await generateTime(data.end);

    const host = data.customPayloads === undefined ? undefined : data.customPayloads['custom:host'];

    const message = "Event Id: "+data.id+ "\n"
                    +"Zone: "+data.zone+ "\n"
                    +"Host: "+host+ "\n"
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
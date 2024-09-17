// import express from 'express';
// import axios from 'axios';
const express = require("express");
const axios = require("axios");

const app = express();
const ax = axios();

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

    try {
        await ax.post(url, payload);
        console.log('Message sent successfully');
    } catch (error) {
        console.error('Error sending message:', error);
    }
}
app.use(express.static('public'));
app.get("/", (req, res) => {
    const errorMessage = 'Hello Bimo';
    sendTelegramMessage(errorMessage);
    
    res.json([
        {
            code: 200,
            message: 'Success'
        }
    ])
 });

app.listen(3000, () => console.log("Server ready on port 3000."));

// export default app;

module.exports = app;
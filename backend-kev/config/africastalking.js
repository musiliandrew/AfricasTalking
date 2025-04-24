// config/africastalking.js
require('dotenv').config();

const credentials = {
  apiKey: process.env.AT_API_KEY, // Sandbox API key
  username: 'sandbox' // Literal string 'sandbox'
};

const AfricasTalking = require('africastalking')(credentials);
module.exports = AfricasTalking.SMS;
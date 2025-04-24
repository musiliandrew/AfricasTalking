const sms = require('../config/africastalking');

const sendSMS = async (phoneNumber, message) => {
  try {
    const options = {
      to: [phoneNumber],
      message: message
    };

    const response = await sms.send(options);
    return { success: true, response };
  } catch (error) {
    console.error('SMS sending error:', error);
    return { success: false, error };
  }
};

module.exports = { sendSMS };
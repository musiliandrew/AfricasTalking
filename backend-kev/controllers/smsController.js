const sms = require('../config/africastalking');

exports.sendProjectSMS = async (req, res) => {
  try {
    const { customer, projectSummary } = req.body;
    
    if (!customer?.phone || !customer?.name) {
      return res.status(400).json({
        success: false,
        message: 'Customer name and phone are required'
      });
    }

    // Format the SMS message
    const message = `New Project Inquiry from ${customer.name}\n\n` +
      `Selected Services:\n${
        projectSummary.items.map(item => 
          `- ${item.milestone} (${item.provider}): ${item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`
        ).join('\n')
      }\n\n` +
      `Total: ${projectSummary.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}\n\n` +
      `Contact: ${customer.phone}${customer.email ? ` | Email: ${customer.email}` : ''}`;

    // Send SMS with your approved sender ID
    const response = await sms.send({
      to: [customer.phone],
      message: message,
      from: '12220' // Your approved sender ID goes here
    });

    res.status(200).json({
      success: true,
      message: 'SMS sent successfully',
      smsResponse: response
    });

  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send SMS',
      error: error.message
    });
  }
};
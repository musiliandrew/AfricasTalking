const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Send SMS endpoint
app.post("/send-sms", async (req, res) => {
  const { recipientPhone, totalPayment, refNumber, paymentMethod, formattedDate } =
    req.body;

  // Validate request body
  if (
    !recipientPhone ||
    !totalPayment ||
    !refNumber ||
    !paymentMethod ||
    !formattedDate
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Construct SMS message (matching frontend format)
  const message = `Payment Receipt\n\n` +
    `Amount: ${totalPayment}\n` +
    `Ref: ${refNumber}\n` +
    `Method: ${paymentMethod}\n` +
    `Date: ${formattedDate}\n\n` +
    `Thank you for your payment!`;

  try {
    const sms = africasTalking.SMS;
    const response = await sms.send({
      to: recipientPhone,
      message,
      from: "12220", // Your shortcode
    });

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("SMS sending error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send SMS",
    });
  }
});

// Database connection
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('MongoDB connected successfully'))
// .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/sms', require('./routes/smsRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});


const port = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
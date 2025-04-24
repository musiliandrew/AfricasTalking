const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String }
  },
  milestones: [{
    name: { type: String, required: true },
    provider: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  totalCost: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
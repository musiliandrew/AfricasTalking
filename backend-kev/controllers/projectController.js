const Project = require('../models/Project');
const { sendSMS } = require('../services/smsService');

exports.submitProject = async (req, res) => {
  try {
    const { customer, projectSummary } = req.body;
    
    // Save to database
    const project = new Project({
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email
      },
      milestones: projectSummary.items.map(item => ({
        name: item.milestone,
        provider: item.provider,
        price: item.price
      })),
      totalCost: projectSummary.total
    });

    await project.save();

    // Send SMS confirmation
    const smsResponse = await sendSMS(
      customer.phone,
      `Thank you ${customer.name} for your construction project inquiry. ` +
      `Selected services: ${projectSummary.items.map(item => `${item.milestone} (${item.provider})`).join(', ')}. ` +
      `Total estimated cost: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(projectSummary.total)}. ` +
      `We'll contact you shortly to discuss next steps.`
    );

    if (!smsResponse.success) {
      console.warn('Project saved but SMS failed to send');
    }

    res.status(201).json({
      success: true,
      message: 'Project submitted successfully',
      data: project,
      smsStatus: smsResponse.success ? 'sent' : 'failed'
    });

  } catch (error) {
    console.error('Error submitting project:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting project',
      error: error.message
    });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message
    });
  }
};
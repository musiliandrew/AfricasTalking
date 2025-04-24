import React, { useState } from 'react';

const ContractorDashboard = () => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const milestones = [
    {
      id: 'planning',
      name: 'Planning and Setup',
      description: 'Initial project planning, permits, and site preparation',
      contractorPrice: 5000,
      externalVendor: {
        name: 'Smeazy Planning',
        url: 'https://smeazy.vercel.app/app',
        price: 4500
      }
    },
    {
      id: 'foundation',
      name: 'Foundation',
      description: 'Excavation, footings, and concrete work',
      contractorPrice: 15000,
      externalVendor: {
        name: 'Smeazy Foundations',
        url: 'https://smeazy.vercel.app/app',
        price: 13500
      }
    },
    {
      id: 'structure',
      name: 'Structure',
      description: 'Framing, walls, and structural components',
      contractorPrice: 25000,
      externalVendor: {
        name: 'Smeazy Structures',
        url: 'https://smeazy.vercel.app/app',
        price: 23000
      }
    },
    {
      id: 'roofing',
      name: 'Roofing',
      description: 'Roof installation and weatherproofing',
      contractorPrice: 12000,
      externalVendor: {
        name: 'Smeazy Roofing',
        url: 'https://smeazy.vercel.app/app',
        price: 11000
      }
    },
    {
      id: 'electrical',
      name: 'Electrical',
      description: 'Wiring, outlets, switches, and electrical panel',
      contractorPrice: 8000,
      externalVendor: {
        name: 'Smeazy Electrical',
        url: 'https://smeazy.vercel.app/app',
        price: 7500
      }
    },
    {
      id: 'interior',
      name: 'Interior',
      description: 'Drywall, flooring, paint, and finishes',
      contractorPrice: 18000,
      externalVendor: {
        name: 'Smeazy Interiors',
        url: 'https://smeazy.vercel.app/app',
        price: 16500
      }
    }
  ];

  //........................................
  const sendSMSViaAfricaTalking = async (phoneNumber, smsContent) => {
    try {
      const apiResponse = await fetch('https://api.africastalking.com/version1/messaging/api/sms/send-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'apiKey': 'atsk_8f6c2a2f26a948f13c4d9f409acb4411d27b38f788c3f5ef46723fc63d52cfd4b187c356', // Replace with your actual API key
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          username: 'sandbox', // Or your Africa's Talking username
          to: phoneNumber,
          message: smsContent,
          from: 'CONTRACT' // Your SMS shortcode or alphanumeric
        })
      });
  
      if (!apiResponse.ok) {
        throw new Error(`SMS API responded with status ${apiResponse.status}`);
      }
  
      return await apiResponse.json();
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw error;
    }
  };
  
  const handleFormSubmission = async (e) => {
    e.preventDefault();
    
    if (!customerInfo.phone || !customerInfo.name) {
      alert('Please provide both name and phone number');
      return;
    }
  
    setIsSubmitting(true);
    setSubmitSuccess(false);
  
    try {
      // Prepare project summary
      const projectSummary = Object.entries(selectedOptions).map(([id, option]) => {
        const milestone = milestones.find(m => m.id === id);
        return {
          service: milestone.name,
          provider: option === 'contractor' ? 'Our Contractor' : milestone.externalVendor.name,
          cost: option === 'contractor' ? milestone.contractorPrice : milestone.externalVendor.price
        };
      });
  
      const totalCost = projectSummary.reduce((sum, item) => sum + item.cost, 0);
      const formattedTotal = new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD' 
      }).format(totalCost);
  
      // Format SMS message
      const smsMessage = [
        `New Project Inquiry from ${customerInfo.name}`,
        '',
        'Selected Services:',
        ...projectSummary.map(item => `• ${item.service} (${item.provider}): ${item.cost}`),
        '',
        `Total: ${formattedTotal}`,
        `Contact: ${customerInfo.phone}${customerInfo.email ? ` | Email: ${customerInfo.email}` : ''}`
      ].join('\n');
  
      // Send SMS
      await sendSMSViaAfricaTalking(customerInfo.phone, smsMessage);
      
      setSubmitSuccess(true);
      console.log("succesful submission");
      
      // Reset form after successful submission
      setTimeout(() => {
        setSelectedOptions({});
        setCustomerInfo({ name: '', phone: '', email: '' });
        setShowSummary(false);
      }, 3000);
    }
    
    catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit your project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }; 
 //....................................................................................

  const handleOptionSelect = (milestoneId, option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [milestoneId]: option
    }));
  };

  const calculateTotal = () => {
    return Object.entries(selectedOptions).reduce((total, [id, option]) => {
      const milestone = milestones.find(m => m.id === id);
      return total + (option === 'contractor' ? milestone.contractorPrice : milestone.externalVendor.price);
    }, 0);
  };

  const toggleSummary = () => {
    setShowSummary(!showSummary);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const prepareSmsData = () => {
    const selectedItems = Object.entries(selectedOptions).map(([id, option]) => {
      const milestone = milestones.find(m => m.id === id);
      return {
        milestone: milestone.name,
        provider: option === 'contractor' ? 'Our Contractor' : milestone.externalVendor.name,
        price: option === 'contractor' ? milestone.contractorPrice : milestone.externalVendor.price
      };
    });

    return {
      customer: customerInfo,
      projectSummary: {
        items: selectedItems,
        total: calculateTotal()
      },
      smsDetails: {
        // Structure for Africa's Talking SMS API
        to: customerInfo.phone,
        message: `Thank you ${customerInfo.name} for your construction project inquiry. 
        Selected services: ${selectedItems.map(item => `${item.milestone} (${item.provider})`).join(', ')}.
        Total estimated cost: ${calculateTotal().toLocaleString('en-US', { style: 'currency', currency: 'USD' })}.
        We'll contact you shortly to discuss next steps.`
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const submissionData = prepareSmsData();
      
      // Call backend API
      const response = await fetch('http://localhost:5000/api/sms/send-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });
  
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit project');
      }
  
      setSubmitSuccess(true);
      setIsSubmitting(false);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowSummary(false);
        setSelectedOptions({});
        setCustomerInfo({ name: '', phone: '', email: '' });
      }, 3000);
      
    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
      alert(error.message || 'Failed to submit project');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Construction Project Planner
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Plan your project step by step and see the costs at each milestone
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">{milestone.name}</h2>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                    {milestone.contractorPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">{milestone.description}</p>
                
                <div className="mt-6 space-y-4">
                  <button
                    onClick={() => handleOptionSelect(milestone.id, 'contractor')}
                    className={`w-full px-4 py-2 rounded-lg font-medium ${selectedOptions[milestone.id] === 'contractor' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                  >
                    Use Our Contractor
                  </button>
                  
                  <a
                    href={milestone.externalVendor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-2 rounded-lg font-medium text-center bg-green-100 text-green-700 hover:bg-green-200"
                    onClick={() => handleOptionSelect(milestone.id, 'external')}
                  >
                    Use {milestone.externalVendor.name} ({milestone.externalVendor.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })})
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-6 right-6">
          <button
            onClick={toggleSummary}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M10 12a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Review Selections
          </button>
        </div>

        {showSummary && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Your Project Summary</h2>
                  <button onClick={toggleSummary} className="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {submitSuccess ? (
                  <div className="text-center py-8">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="mt-3 text-lg font-medium text-gray-900">Submission successful!</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      We've received your project details and will contact you shortly.
                    </p>
                  </div>
                ) : Object.keys(selectedOptions).length === 0 ? (
                  <p className="text-gray-500">You haven't selected any options yet.</p>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="overflow-x-auto mb-6">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Milestone</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Option</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {Object.entries(selectedOptions).map(([id, option]) => {
                            const milestone = milestones.find(m => m.id === id);
                            return (
                              <tr key={id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{milestone.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {option === 'contractor' ? 'Our Contractor' : milestone.externalVendor.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {option === 'contractor' 
                                    ? milestone.contractorPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                                    : milestone.externalVendor.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td colSpan="2" className="px-6 py-4 text-right text-sm font-medium text-gray-900">Total</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                              {calculateTotal().toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div className="space-y-4 mb-6">
                      <h3 className="text-lg font-medium text-gray-900">Your Information</h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={customerInfo.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            id="phone"
                            required
                            value={customerInfo.phone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={customerInfo.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={toggleSummary}
                        className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Continue Selecting
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Project Plan'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractorDashboard;
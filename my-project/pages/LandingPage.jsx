import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';


const LandingPage = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <span className="text-xl font-bold text-indigo-600">BuildTrack</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
                <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>
  
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Construction Project <span className="text-indigo-600">Tracking</span> Simplified
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Plan, budget, and track your construction projects with real-time SMS updates.
              Our system helps contractors and clients stay informed at every milestone.
            </p>
            <Link to="/register" className="px-8 py-3 bg-indigo-600 text-white text-lg font-medium rounded-md hover:bg-indigo-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
  
        {/* Features Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Milestone Tracking",
                  description: "Monitor project phases from planning to completion",
                  icon: "📊"
                },
                {
                  title: "SMS Notifications",
                  description: "Get real-time updates via Africa's Talking SMS",
                  icon: "📱"
                },
                {
                  title: "Budget Management",
                  description: "Track costs and expenses at each project stage",
                  icon: "💰"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-blue-50 p-6 rounded-lg text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>© {new Date().getFullYear()} BuildTrack. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  };
export default LandingPage;
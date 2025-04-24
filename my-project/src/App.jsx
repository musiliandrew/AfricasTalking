import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import './App.css'
import ContractorDashboard from '../pages/ContractorDashboard'
import LandingPage from '../pages/LandingPage';
import PaymentPage from '../pages/PaymentPage';

function App() {

  
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/projects" element={<ContractorDashboard />}></Route>
      <Route path="/payments" element={<PaymentPage />}></Route>
      </Routes>
    </Router>
  )
}

export default App

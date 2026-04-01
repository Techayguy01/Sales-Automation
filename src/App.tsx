import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ChevronDown, Lock, ArrowRight, Star, ShieldCheck, Shield } from 'lucide-react';
import Dashboard from './Dashboard';
import DashboardHome from './components/DashboardHome';
import EmailTemplates from './components/EmailTemplates';
import PipelineRunner from './components/PipelineRunner';
import Prospects from './components/Prospects';
import Campaigns from './components/Campaigns';
import FollowUps from './components/FollowUps';
import Inbox from './components/Inbox';
import Analytics from './components/Analytics';
import CRM from './components/CRM';
import Settings from './components/Settings';
import Help from './components/Help';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif] text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <img 
            src="https://www.atcgroup.co.in/assets/aarkay-logo-Cmuxygmp.png" 
            alt="Aarkay Logo" 
            className="h-8 cursor-pointer" 
            referrerPolicy="no-referrer" 
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-[15px] font-medium text-white bg-[#2563eb] rounded-md px-5 py-2 hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center max-w-4xl mx-auto">
        <p className="font-['Caveat',cursive] text-[32px] text-gray-400 mb-4 tracking-wide">
          your only sales automation software
        </p>
        
        <h1 className="text-[56px] md:text-[72px] font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-12">
          Send cold emails.<br />
          Take <span className="relative inline-block">
            <span className="relative z-10">follow up</span>
            <span className="absolute bottom-2 left-[-2%] w-[104%] h-5 bg-[#fef08a] -z-10 rounded-sm"></span>
          </span> every day.
        </h1>
      </main>

      {/* Social Proof Section */}
      <section className="max-w-5xl mx-auto px-4 pb-24 text-center">
        <p className="text-[17px] text-gray-600 mb-10">
          Trusted by <span className="font-bold text-gray-900">10,000+</span> businesses, agencies, and sales teams worldwide.
        </p>

        {/* Ratings */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-16">
          {/* G2 */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FF492C] rounded-full flex items-center justify-center text-white font-bold text-xs">
              G2
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900 text-lg">G2</span>
              <span className="font-bold text-gray-900 text-lg">4.6/5</span>
              <span className="text-gray-500 text-[15px]">(772)</span>
            </div>
          </div>

          <div className="hidden md:block w-px h-6 bg-gray-200"></div>

          {/* Trustpilot */}
          <div className="flex items-center gap-3">
            <div className="flex text-[#00B67A]">
              <Star className="w-7 h-7 fill-current" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900 text-lg">Trustpilot</span>
              <span className="font-bold text-gray-900 text-lg">4.7/5</span>
              <span className="text-gray-500 text-[15px]">(724)</span>
            </div>
          </div>

          <div className="hidden md:block w-px h-6 bg-gray-200"></div>

          {/* Google */}
          <div className="flex items-center gap-3">
            <svg className="w-7 h-7" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900 text-lg">Google</span>
              <span className="font-bold text-gray-900 text-lg">4.3/5</span>
              <span className="text-gray-500 text-[15px]">(192)</span>
            </div>
          </div>
        </div>

        {/* Company Logos */}
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-40 grayscale mb-16">
          <div className="text-2xl font-bold tracking-tighter">NetApp</div>
          <div className="text-2xl font-black border-2 border-current px-2 rounded">USI</div>
          <div className="text-2xl font-serif italic">Vedantu</div>
          <div className="text-2xl font-bold">GoDaddy</div>
          <div className="text-2xl font-bold tracking-widest">CLOUD</div>
        </div>

        {/* Certifications */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400 text-[15px] font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <span>SOC 2</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            <span>ISO 27001</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span>GDPR</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard><DashboardHome /></Dashboard>} />
        <Route path="/email-templates" element={<Dashboard><EmailTemplates /></Dashboard>} />
        <Route path="/pipeline-runner" element={<Dashboard><PipelineRunner /></Dashboard>} />
        <Route path="/prospects" element={<Dashboard><Prospects /></Dashboard>} />
        <Route path="/campaigns" element={<Dashboard><Campaigns /></Dashboard>} />
        <Route path="/follow-ups" element={<Dashboard><FollowUps /></Dashboard>} />
        <Route path="/inbox" element={<Dashboard><Inbox /></Dashboard>} />
        <Route path="/analytics" element={<Dashboard><Analytics /></Dashboard>} />
        <Route path="/crm" element={<Dashboard><CRM /></Dashboard>} />
        <Route path="/settings" element={<Dashboard><Settings /></Dashboard>} />
        <Route path="/help" element={<Dashboard><Help /></Dashboard>} />
      </Routes>
    </Router>
  );
}

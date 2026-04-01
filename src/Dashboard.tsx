import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, Users, Settings, Bell, ChevronDown, Play, Pause, 
  MoreVertical, Info, Zap, Headphones, Mail, CheckSquare, 
  Briefcase, Shield, FileText, BarChart2, MessageSquare, 
  Send, Inbox, Sparkles, Plus, MoreHorizontal, Edit3, LayoutDashboard
} from 'lucide-react';

const SidebarSection = ({ label }) => (
  <div className="px-3 py-2 mt-2 text-xs font-semibold text-gray-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
    {label}
  </div>
);

const SidebarItem = ({ icon: Icon, label, to = "#", badge = null, hasDropdown = false }) => {
  const location = useLocation();
  const active = location.pathname === to || (to !== "#" && location.pathname.startsWith(to));

  return (
    <Link to={to} className={`flex items-center w-full px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}>
      <Icon className="w-5 h-5 shrink-0" />
      <div className="flex items-center justify-between overflow-hidden transition-all duration-300 max-w-0 group-hover:max-w-[200px] group-hover:ml-3 opacity-0 group-hover:opacity-100 flex-1">
        <span className="font-medium text-[14px] text-left">{label}</span>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="bg-yellow-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              {badge}
            </span>
          )}
          {hasDropdown && (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>
    </Link>
  );
};

export default function Dashboard({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F9FAFB] font-['Inter',sans-serif]">
      {/* Sidebar */}
      <aside className="h-screen w-[60px] hover:w-[240px] bg-white border-r border-gray-200 flex flex-col py-4 transition-all duration-300 overflow-hidden group shrink-0">
        <div className="mb-6 px-4 flex items-center overflow-hidden whitespace-nowrap h-8">
          <img 
            src="https://www.atcgroup.co.in/assets/aarkay-logo-Cmuxygmp.png" 
            alt="Aarkay Logo" 
            className="h-8 w-auto object-contain" 
            referrerPolicy="no-referrer" 
          />
        </div>

        <div className="flex flex-col gap-1 w-full px-2 flex-1 overflow-y-auto no-scrollbar">
          <SidebarSection label="Main" />
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
          <SidebarItem icon={Search} label="Pipeline Runner (Lead Finder)" to="/pipeline-runner" />
          <SidebarItem icon={Briefcase} label="Prospects (Client Management)" to="/prospects" />

          <SidebarSection label="Outreach" />
          <SidebarItem icon={Send} label="Campaigns (Sequences)" to="/campaigns" />
          <SidebarItem icon={CheckSquare} label="Follow Ups (Tasks)" to="/follow-ups" />
          <SidebarItem icon={Inbox} label="Inbox (Unified Inbox)" to="/inbox" />

          <SidebarSection label="Tools" />
          <SidebarItem icon={FileText} label="Email Templates" to="/email-templates" />
          <SidebarItem icon={BarChart2} label="Analytics" to="/analytics" />
          <SidebarItem icon={Users} label="CRM" to="/crm" />
        </div>

        <div className="flex flex-col gap-1 w-full px-2 mt-auto pt-4 border-t border-gray-200">
          <SidebarSection label="System" />
          <SidebarItem icon={Settings} label="Settings" to="/settings" />
          <SidebarItem icon={MessageSquare} label="Help" to="/help" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <img 
              src="https://www.atcgroup.co.in/assets/aarkay-logo-Cmuxygmp.png" 
              alt="Aarkay Logo" 
              className="h-8 w-auto object-contain" 
              referrerPolicy="no-referrer" 
            />
          </div>

          <div className="flex items-center gap-6">
            {/* Icons */}
            <div className="flex items-center gap-4 text-gray-500">
              <button className="hover:text-gray-900"><Headphones className="w-5 h-5" /></button>
              <button className="hover:text-gray-900 relative">
                <Zap className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">3</span>
              </button>
              <button className="hover:text-gray-900"><Bell className="w-5 h-5" /></button>
            </div>

            {/* User Profile */}
            <button className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-md">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 font-semibold rounded-full flex items-center justify-center text-sm">
                TB
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        {children || (
          <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Aarkay Dashboard</h1>
            <p className="text-gray-500 max-w-md">
              Select an option from the sidebar to get started. Try navigating to Pipeline Runner or Email Templates.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

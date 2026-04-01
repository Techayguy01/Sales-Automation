import React from 'react';
import { Search, Filter, RefreshCw, Download, MoreVertical, ChevronRight, Activity, GitBranch } from 'lucide-react';

const emailsData = [
  {
    id: 1,
    prospectName: 'Richard Nolan',
    prospectEmail: 'richard.nolan1043@long.com',
    step: 'Step 3',
    variant: 'A',
    status: 'Sent',
    date: 'Thu, Sep 07, 2023 06:26 PM',
    opened: 1,
    clicked: 0,
    replied: '-',
    senderName: 'Demo User',
    senderEmail: 'demouser92@gmail.com'
  },
  {
    id: 2,
    prospectName: 'Diane Evans',
    prospectEmail: 'diane.evans1048@garcia-aguilar...',
    step: 'Step 1',
    variant: 'B',
    status: 'Sent',
    date: 'Thu, Sep 07, 2023 06:14 PM',
    opened: 1,
    clicked: 0,
    replied: '-',
    senderName: 'Demo User',
    senderEmail: 'demouser87@gmail.com'
  },
  {
    id: 3,
    prospectName: 'Richard Greene',
    prospectEmail: 'richard.greene1039@pace.net',
    step: 'Step 2',
    variant: 'A',
    status: 'Sent',
    date: 'Thu, Sep 07, 2023 06:14 PM',
    opened: 1,
    clicked: 0,
    replied: '-',
    senderName: 'Demo User',
    senderEmail: 'demouser70@gmail.com'
  },
  {
    id: 4,
    prospectName: 'Suzanne Young',
    prospectEmail: 'suzanne.young1040@lopez.com',
    step: 'Step 2',
    variant: 'A',
    status: 'Sent',
    date: 'Thu, Sep 07, 2023 06:12 PM',
    opened: 1,
    clicked: 0,
    replied: '-',
    senderName: 'Demo User',
    senderEmail: 'demouser90@gmail.com'
  },
  {
    id: 5,
    prospectName: 'Erin Torres',
    prospectEmail: 'erin.torres1046@west.info',
    step: 'Step 1',
    variant: 'B',
    status: 'Sent',
    date: 'Thu, Sep 07, 2023 06:09 PM',
    opened: 1,
    clicked: 0,
    replied: '-',
    senderName: 'Demo User',
    senderEmail: 'demouser98@gmail.com'
  }
];

const stats = [
  { label: 'Total', value: '13388', subtext: '' },
  { label: 'Scheduled', value: '2416', subtext: '' },
  { label: 'Delivered', value: '10972', subtext: '' },
  { label: 'Opened', value: '4396', subtext: '(40.07%)', active: true },
  { label: 'Clicked', value: '0', subtext: '(0%)' },
  { label: 'Replied', value: '557', subtext: '(5.08%)' },
  { label: 'Bounced', value: '0', subtext: '(0%)' },
  { label: 'Failed', value: '0', subtext: '(0%)' },
];

const steps = [
  { label: 'All Steps', count: '4396', active: true },
  { label: 'Step 1', count: '2163' },
  { label: 'Step 2', count: '1457' },
  { label: 'Step 3', count: '776' },
];

export default function FollowUps() {
  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50 h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 font-medium">Sequence</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-gray-900 text-lg">Saas Founder Outreach</span>
            <div className="ml-2 w-10 h-5 bg-green-500 rounded-full flex items-center px-1 cursor-pointer">
              <div className="w-3 h-3 bg-white rounded-full ml-auto"></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 border border-yellow-400 rounded-full px-3 py-1 bg-yellow-50">
              <span className="font-bold text-yellow-600">56</span>
              <span>Sequence Score</span>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="px-6 flex items-center gap-6 text-sm">
          <button className="py-3 text-gray-500 hover:text-gray-900 font-medium">Steps <span className="ml-1 bg-gray-100 px-2 py-0.5 rounded text-xs">3</span></button>
          <button className="py-3 text-gray-500 hover:text-gray-900 font-medium">Prospects <span className="ml-1 bg-gray-100 px-2 py-0.5 rounded text-xs">5490</span></button>
          <button className="py-3 text-blue-600 border-b-2 border-blue-600 font-medium">Emails</button>
          <button className="py-3 text-gray-500 hover:text-gray-900 font-medium">Settings</button>
          <button className="py-3 text-gray-500 hover:text-gray-900 font-medium flex items-center gap-1">
            <GitBranch className="w-4 h-4" /> Subsequence <span className="ml-1 bg-gray-100 px-2 py-0.5 rounded text-xs">1</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-[1400px] mx-auto">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md border border-transparent hover:border-gray-200">
                <Filter className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md">
                <Activity className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="flex items-center justify-between mb-6 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col items-center justify-center px-4 py-3 rounded-md flex-1 cursor-pointer ${stat.active ? 'bg-white border border-gray-200 shadow-sm' : 'hover:bg-gray-50 border border-transparent'}`}
              >
                <div className="flex items-baseline gap-1">
                  <span className={`text-xl font-semibold ${stat.active ? 'text-gray-900' : 'text-gray-900'}`}>{stat.value}</span>
                  {stat.subtext && <span className="text-xs text-gray-500 font-medium">{stat.subtext}</span>}
                </div>
                <span className="text-xs text-gray-600 mt-1 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Split View: Sidebar + Table */}
          <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {/* Left Sidebar (Steps) */}
            <div className="w-32 border-r border-gray-200 bg-white flex flex-col">
              {steps.map((step, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col items-center justify-center py-5 border-b border-gray-100 cursor-pointer relative ${step.active ? 'bg-white' : 'hover:bg-gray-50'}`}
                >
                  {step.active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>}
                  <span className={`text-xl font-semibold ${step.active ? 'text-blue-600' : 'text-gray-900'}`}>{step.count}</span>
                  <span className={`text-xs mt-1 font-medium ${step.active ? 'text-blue-600' : 'text-gray-500'}`}>{step.label}</span>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-xs text-gray-500 bg-white border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Prospect</th>
                    <th className="px-6 py-4 font-medium">Step</th>
                    <th className="px-6 py-4 font-medium">Scheduled/Sent</th>
                    <th className="px-6 py-4 font-medium">Opened <span className="text-[10px] ml-1">↑↓</span></th>
                    <th className="px-6 py-4 font-medium">Clicked <span className="text-[10px] ml-1">↑↓</span></th>
                    <th className="px-6 py-4 font-medium">Replied</th>
                    <th className="px-6 py-4 font-medium">Sender Email</th>
                    <th className="px-6 py-4 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {emailsData.map((email) => (
                    <tr key={email.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{email.prospectName}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{email.prospectEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{email.step}</div>
                        <div className={`inline-flex items-center justify-center w-5 h-5 rounded text-xs font-medium mt-1 ${email.variant === 'A' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {email.variant}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{email.status}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{email.date}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{email.opened}</td>
                      <td className="px-6 py-4 text-gray-900">{email.clicked}</td>
                      <td className="px-6 py-4 text-gray-900">{email.replied}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{email.senderName}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{email.senderEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Star, Mail, Reply, Clock, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Play, CheckCircle2, 
  XCircle, AlertCircle, Send, Users, Sparkles, MoreHorizontal, Plus, Search, Settings, FileText, Headphones
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

// Fake Data
const statsData = [
  { id: 1, label: 'Total Prospects', value: '12,450', icon: Building2, color: 'text-gray-600', bgColor: 'bg-gray-100', trend: '+12%', trendUp: true },
  { id: 2, label: 'High Fit Companies', value: '3,210', icon: Star, color: 'text-green-600', bgColor: 'bg-green-100', trend: '+5%', trendUp: true },
  { id: 3, label: 'Emails Sent', value: '45,890', icon: Mail, color: 'text-blue-600', bgColor: 'bg-blue-100', trend: '+22%', trendUp: true },
  { id: 4, label: 'Replies Received', value: '4,120', icon: Reply, color: 'text-purple-600', bgColor: 'bg-purple-100', trend: '+8%', trendUp: true },
  { id: 5, label: 'Follow Ups Pending', value: '845', icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-100', trend: '-2%', trendUp: false },
  { id: 6, label: 'Success Rate', value: '8.9%', icon: TrendingUp, color: 'text-teal-600', bgColor: 'bg-teal-100', trend: '+1.2%', trendUp: true },
];

const barChartData = [
  { date: 'Mon', Sent: 4000, Replied: 400 },
  { date: 'Tue', Sent: 3000, Replied: 350 },
  { date: 'Wed', Sent: 5000, Replied: 550 },
  { date: 'Thu', Sent: 4500, Replied: 480 },
  { date: 'Fri', Sent: 6000, Replied: 700 },
  { date: 'Sat', Sent: 2000, Replied: 150 },
  { date: 'Sun', Sent: 1500, Replied: 100 },
];

const pieChartData = [
  { name: 'High Fit', value: 45, color: '#16a34a' }, // green-600
  { name: 'Medium Fit', value: 35, color: '#eab308' }, // yellow-500
  { name: 'Low Fit', value: 20, color: '#ef4444' }, // red-500
];

const recentRuns = [
  { id: 1, company: 'TechCorp Solutions', fit: 'High', time: '10 mins ago', status: 'Completed' },
  { id: 2, company: 'Global Industries', fit: 'Medium', time: '1 hour ago', status: 'Completed' },
  { id: 3, company: 'Apex Manufacturing', fit: 'High', time: '2 hours ago', status: 'Failed' },
  { id: 4, company: 'Nexus Logistics', fit: 'Low', time: '5 hours ago', status: 'Completed' },
  { id: 5, company: 'Quantum Robotics', fit: 'High', time: '1 day ago', status: 'Completed' },
];

const recentEmails = [
  { id: 1, company: 'TechCorp Solutions', status: 'Sent', time: '5 mins ago', replied: false },
  { id: 2, company: 'Global Industries', status: 'Opened', time: '15 mins ago', replied: true },
  { id: 3, company: 'Apex Manufacturing', status: 'Bounced', time: '1 hour ago', replied: false },
  { id: 4, company: 'Nexus Logistics', status: 'Sent', time: '2 hours ago', replied: false },
  { id: 5, company: 'Quantum Robotics', status: 'Opened', time: '3 hours ago', replied: true },
];

export default function DashboardHome() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-auto bg-[#F9FAFB] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Overview of your ATC Sales Intelligence outreach.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Row */}
          
          {/* Card 1: Total Prospects & AI */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">12,450</h2>
                <p className="text-sm text-gray-500 mt-1">Total Prospects</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Compared to last month</p>
                <p className="text-sm font-semibold text-green-600">+12.4%</p>
              </div>
            </div>
            <div className="mt-auto bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-5 border border-blue-100 relative overflow-hidden">
              <div className="relative z-10 text-center">
                <h3 className="text-sm font-semibold text-blue-900 mb-1">AI Assistant</h3>
                <p className="text-xs text-blue-700 mb-4">is analyzing your prospect list...</p>
                <div className="h-24 flex items-center justify-center">
                   <Sparkles className="w-12 h-12 text-blue-400 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Outreach Metrics */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-semibold text-gray-900">Outreach Metrics</h3>
              <button className="p-1.5 hover:bg-gray-100 rounded-full"><MoreHorizontal className="w-4 h-4 text-gray-500"/></button>
            </div>
            
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">45,890</h2>
              <p className="text-sm text-gray-500 mt-1">Total Emails Sent</p>
              <p className="text-xs text-gray-400 mt-2">AI-powered outreach and follow-up insights</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div>
                <h4 className="text-xl font-bold text-gray-900">4,120</h4>
                <p className="text-xs text-gray-500">Replies Received</p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">8.9%</h4>
                <p className="text-xs text-gray-500">Success Rate</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-medium text-blue-600">TB</div>
                <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-xs font-medium text-green-600">JD</div>
                <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-xs font-medium text-purple-600">AM</div>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100"><Plus className="w-4 h-4 text-gray-600"/></button>
              </div>
            </div>
          </div>

          {/* Card 3: Fit Score & Trends */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold text-gray-900">Fit Score Distribution</h3>
              <select className="text-xs bg-gray-50 border border-gray-200 rounded-md px-2 py-1 outline-none">
                <option>Monthly</option>
              </select>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">45%</p>
                  <p className="text-[10px] text-gray-500">High Fit</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">35%</p>
                  <p className="text-[10px] text-gray-500">Medium Fit</p>
                </div>
              </div>
            </div>

            <div className="h-24 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={barChartData}>
                  <Line type="monotone" dataKey="Sent" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Replied" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Row */}

          {/* Card 4: Pipeline Tracking */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-semibold text-gray-900">Pipeline Tracking</h3>
              <button className="p-1.5 hover:bg-gray-100 rounded-full"><MoreHorizontal className="w-4 h-4 text-gray-500"/></button>
            </div>
            
            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-1">Follow Ups Pending</p>
              <div className="flex items-end gap-3">
                <h2 className="text-3xl font-bold text-gray-900">845</h2>
                <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full mb-1 border border-orange-100">High Priority</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs font-medium text-gray-700 mb-3">Prospect Engagement</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Opened</span>
                    <span className="font-medium text-gray-900">40%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[40%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Clicked</span>
                    <span className="font-medium text-gray-900">25%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[25%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Replied</span>
                    <span className="font-medium text-gray-900">15%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[15%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Bounced</span>
                    <span className="font-medium text-gray-900">5%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-[5%]"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-auto">
              <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-500">Insights</span>
                <span className="text-xs font-medium text-gray-900">70% Positive, 20% Neutral</span>
                <Sparkles className="w-3 h-3 text-blue-500" />
              </div>
              <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100" onClick={() => navigate('/pipeline-runner')}>
                <span className="text-xs text-gray-500">Action</span>
                <span className="text-xs font-medium text-gray-900">Run New Pipeline</span>
                <Play className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Card 5: Recent Activity Table */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-6 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
              <Search className="w-4 h-4 text-gray-400 ml-2" />
              <input type="text" placeholder="Search prospects..." className="bg-transparent border-none outline-none text-sm w-full text-gray-900 placeholder-gray-400" />
              <button className="p-1.5 bg-white rounded-lg shadow-sm border border-gray-200"><Settings className="w-3.5 h-3.5 text-gray-500"/></button>
            </div>

            <div className="flex gap-4 border-b border-gray-100 mb-4 pb-2">
              <button className="text-xs font-semibold text-gray-900 border-b-2 border-gray-900 pb-2 -mb-[9px]">All Records</button>
              <button className="text-xs font-medium text-gray-500 hover:text-gray-700 pb-2">Pending Follow Ups</button>
              <button className="text-xs font-medium text-gray-500 hover:text-gray-700 pb-2">Completed</button>
            </div>

            <div className="flex-1 overflow-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="text-[11px] font-medium text-gray-400 pb-3 font-normal">Company</th>
                    <th className="text-[11px] font-medium text-gray-400 pb-3 font-normal">Fit Score</th>
                    <th className="text-[11px] font-medium text-gray-400 pb-3 font-normal text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentRuns.map((run, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="py-3 text-gray-900 font-medium">{run.company}</td>
                      <td className="py-3 text-gray-500">{run.fit}</td>
                      <td className="py-3 text-right">
                        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          run.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-200' :
                          run.status === 'Failed' ? 'bg-red-50 text-red-700 border border-red-200' :
                          'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        }`}>
                          {run.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 6: AI Assistant Chat */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-semibold text-gray-900">AI Assistant</h3>
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 hover:bg-gray-100 rounded-lg"><FileText className="w-4 h-4 text-gray-500"/></button>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg"><ArrowUpRight className="w-4 h-4 text-gray-500"/></button>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4 overflow-y-auto mb-4 no-scrollbar">
              <div className="self-end bg-gray-100 text-gray-900 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[85%]">
                What areas should I prioritize for my outreach today?
              </div>
              <div className="self-start flex gap-3 max-w-[90%]">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="bg-blue-50 border border-blue-100 text-blue-900 rounded-2xl rounded-tl-sm px-4 py-3 text-sm">
                  <p className="font-semibold mb-1 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600"/> Outreach Focus:</p>
                  <p className="text-blue-800">Prioritize: High fit companies in the manufacturing sector. You have 45 pending follow-ups there.</p>
                  <p className="text-blue-600 mt-2 text-xs">Avoid: Sending generic templates to enterprise leads.</p>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
                <span className="text-[10px] font-medium text-gray-500 bg-gray-50 border border-gray-200 px-2 py-1 rounded-full whitespace-nowrap cursor-pointer hover:bg-gray-100">AI Hub</span>
                <span className="text-[10px] font-medium text-gray-500 bg-gray-50 border border-gray-200 px-2 py-1 rounded-full whitespace-nowrap cursor-pointer hover:bg-gray-100">Prospects</span>
                <span className="text-[10px] font-medium text-gray-500 bg-gray-50 border border-gray-200 px-2 py-1 rounded-full whitespace-nowrap cursor-pointer hover:bg-gray-100">Templates</span>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-2 w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <input 
                  type="text" 
                  placeholder="Ask or Search..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-11 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-gray-600"><Headphones className="w-4 h-4"/></button>
                  <button className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 shadow-sm transition-colors">
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

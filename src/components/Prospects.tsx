import React from 'react';
import { 
  Search, Filter, Send, Tag, X, CornerUpLeft, Ban, Flag, Pause, Play, 
  RefreshCw, Download, CheckCircle2, ChevronDown, Mail, Eye, MousePointerClick,
  ThumbsUp, Calendar, DollarSign, Briefcase, GitBranch
} from 'lucide-react';

export default function Prospects() {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Secondary Navigation */}
      <div className="flex items-center justify-between px-6 pt-3 border-b border-gray-200">
        <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
          <button className="flex items-center gap-2 hover:text-gray-900 pb-3">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            Steps
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 text-blue-600 border-b-2 border-blue-600 pb-3">
            <CheckCircle2 className="w-4 h-4" />
            Prospects
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 hover:text-gray-900 pb-3">
            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
            Settings
          </button>
          <button className="flex items-center gap-2 hover:text-gray-900 pb-3">
            <GitBranch className="w-4 h-4" />
            Subsequence
          </button>
        </div>
        <div className="flex items-center gap-4 pb-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <div className="w-8 h-8 rounded-full border border-red-200 flex items-center justify-center text-red-500 bg-white">
              46
            </div>
            <span className="text-gray-600">Sequence Score</span>
          </div>
          <button className="flex items-center gap-2 bg-[#004EEB] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
            Add Prospects
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search" 
              className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div className="h-6 w-px bg-gray-200"></div>
          <div className="flex items-center gap-1 text-gray-500">
            <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Filter className="w-4 h-4" /></button>
            <div className="h-6 w-px bg-gray-200 mx-1"></div>
            <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Send className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Tag className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><X className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><CornerUpLeft className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Ban className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Flag className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Pause className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Play className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><RefreshCw className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Download className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Stats Tabs */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200 overflow-x-auto no-scrollbar gap-2">
        <div className="flex flex-col items-center justify-center px-6 py-2 bg-white border border-gray-200 shadow-sm rounded-lg min-w-[100px]">
          <span className="text-2xl font-semibold text-gray-900">3</span>
          <span className="text-xs text-gray-600 font-medium">Total</span>
        </div>
        
        <div className="flex flex-col items-center justify-center px-6 py-2 min-w-[120px] cursor-pointer hover:bg-gray-50 rounded-lg">
          <span className="text-2xl font-semibold text-gray-900">0</span>
          <span className="text-xs text-gray-600 font-medium flex items-center gap-1">Not Contacted <ChevronDown className="w-3 h-3" /></span>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-2 min-w-[100px] cursor-pointer hover:bg-gray-50 rounded-lg">
          <span className="text-2xl font-semibold text-gray-900">0</span>
          <span className="text-xs text-gray-600 font-medium">Contacted</span>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-2 min-w-[100px] cursor-pointer hover:bg-gray-50 rounded-lg">
          <span className="text-2xl font-semibold text-gray-900">0</span>
          <span className="text-xs text-gray-600 font-medium">Opened</span>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-2 min-w-[100px] cursor-pointer hover:bg-gray-50 rounded-lg">
          <span className="text-2xl font-semibold text-gray-900">0</span>
          <span className="text-xs text-gray-600 font-medium">Replied</span>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-2 min-w-[100px] cursor-pointer hover:bg-gray-50 rounded-lg">
          <span className="text-2xl font-semibold text-gray-900">0</span>
          <span className="text-xs text-gray-600 font-medium flex items-center gap-1">Clicked <ChevronDown className="w-3 h-3" /></span>
        </div>

        <div className="w-px h-10 bg-gray-200 mx-2"></div>

        <div className="flex flex-col items-center justify-center px-6 py-2 min-w-[100px] cursor-pointer hover:bg-gray-50 rounded-lg">
          <span className="text-2xl font-semibold text-gray-900">0 <span className="text-sm text-gray-400 font-normal">$0</span></span>
          <span className="text-xs text-gray-600 font-medium flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-gray-400" /> Interested</span>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-2 min-w-[120px] cursor-pointer hover:bg-gray-50 rounded-lg">
          <span className="text-2xl font-semibold text-gray-900">0 <span className="text-sm text-gray-400 font-normal">$0</span></span>
          <span className="text-xs text-gray-600 font-medium flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-400" /> Meeting Booked</span>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-2 min-w-[100px] cursor-pointer hover:bg-gray-50 rounded-lg">
          <span className="text-2xl font-semibold text-gray-900">0 <span className="text-sm text-gray-400 font-normal">$0</span></span>
          <span className="text-xs text-gray-600 font-medium flex items-center gap-1"><DollarSign className="w-3 h-3 text-gray-400" /> Closed</span>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-2 min-w-[120px] cursor-pointer hover:bg-gray-50 rounded-lg">
          <span className="text-2xl font-semibold text-gray-900">0</span>
          <span className="text-xs text-gray-600 font-medium flex items-center gap-1"><Briefcase className="w-3 h-3 text-gray-400" /> Out of Office <ChevronDown className="w-3 h-3" /></span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 w-12">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Current Step</th>
              <th className="px-4 py-3">Current step stats</th>
              <th className="px-4 py-3">Outcome</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3">Last activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { name: 'Malav Joshi', email: 'malav@saleshandy.com' },
              { name: 'Piyush Patel', email: 'piyush@saleshandy.com' },
              { name: 'Anil Salvi', email: 'anil@saleshandy.com' }
            ].map((person, idx) => (
              <tr key={idx} className="hover:bg-gray-50 group">
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{person.name}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200">Inactive</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    {person.email}
                    <CheckCircle2 className="w-3 h-3 text-gray-300 fill-gray-100" />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-4 h-4 text-blue-500" />
                    Step 1
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Send className="w-4 h-4" />
                    <Eye className="w-4 h-4" />
                    <MousePointerClick className="w-4 h-4" />
                    <CornerUpLeft className="w-4 h-4" />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 bg-white">
                    Add Outcome
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>
                </td>
                <td className="px-4 py-4 text-gray-500">-</td>
                <td className="px-4 py-4 text-gray-500">18 hours ago</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

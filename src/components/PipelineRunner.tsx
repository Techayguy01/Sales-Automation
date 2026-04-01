import React from 'react';
import { 
  Search, Users, ChevronDown, Play, Pause, 
  MoreVertical, Info, Sparkles, Mail, Inbox, CornerUpLeft
} from 'lucide-react';

export default function PipelineRunner() {
  return (
    <div className="flex-1 overflow-auto p-6 bg-[#F9FAFB] h-full">
      {/* Filters & Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search here..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50">
            <Users className="w-4 h-4 text-gray-400" />
            Client Associated
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50">
            <Users className="w-4 h-4 text-gray-400" />
            Sequence Owner
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50">
            Status (All)
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-300 cursor-not-allowed">
            <Pause className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-300 cursor-not-allowed">
            <Play className="w-5 h-5" />
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-purple-200 text-purple-700 bg-white rounded-md text-sm font-medium hover:bg-purple-50 transition-colors">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Write With AI
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            Create Sequence
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
            <tr>
              <th className="px-4 py-3 w-12 text-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </th>
              <th className="px-4 py-3">Sequence Name</th>
              <th className="px-4 py-3">
                <div className="flex items-center gap-1">
                  Sequence Progress
                  <Info className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-500" />
                  Prospect
                </div>
              </th>
              <th className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-blue-500" />
                  Contacted
                </div>
              </th>
              <th className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <Inbox className="w-4 h-4 text-indigo-500" />
                  Opened
                </div>
              </th>
              <th className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <CornerUpLeft className="w-4 h-4 text-green-500" />
                  Replied
                </div>
              </th>
              <th className="px-4 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* Row 1 */}
            <tr className="hover:bg-gray-50 group">
              <td className="px-4 py-4 text-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 mb-1">Aarkay Techno Consultants Pvt. Ltd.'s Le...</div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      Draft
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-[10px] text-gray-400 font-medium">
                    0%
                  </div>
                  <span className="text-gray-900 font-medium">0<span className="text-gray-400 font-normal">/1</span></span>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="w-8 h-8 rounded-full border border-yellow-400 flex items-center justify-center text-xs text-yellow-600 font-medium">
                  45
                </div>
              </td>
              <td className="px-4 py-4">
                <span className="font-medium text-gray-900 border-b border-dashed border-gray-400 pb-0.5">1</span>
              </td>
              <td className="px-4 py-4 text-gray-900 font-medium">-</td>
              <td className="px-4 py-4 text-gray-900 font-medium">-</td>
              <td className="px-4 py-4 text-gray-900 font-medium">-</td>
              <td className="px-4 py-4 text-right">
                <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </td>
            </tr>

            {/* Row 2 */}
            <tr className="hover:bg-gray-50 group">
              <td className="px-4 py-4 text-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 mb-1">Tanay's First Sequence. 🚀</div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      Draft
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-[10px] text-gray-400 font-medium">
                    0%
                  </div>
                  <span className="text-gray-900 font-medium">0<span className="text-gray-400 font-normal">/3</span></span>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="w-8 h-8 rounded-full border border-yellow-400 flex items-center justify-center text-xs text-yellow-600 font-medium">
                  46
                </div>
              </td>
              <td className="px-4 py-4">
                <span className="font-medium text-gray-900 border-b border-dashed border-gray-400 pb-0.5">3</span>
              </td>
              <td className="px-4 py-4 text-gray-900 font-medium">-</td>
              <td className="px-4 py-4 text-gray-900 font-medium">-</td>
              <td className="px-4 py-4 text-gray-900 font-medium">-</td>
              <td className="px-4 py-4 text-right">
                <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

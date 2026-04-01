import React, { useState } from 'react';
import { Search, MoreVertical, Send, Eye } from 'lucide-react';

export default function EmailTemplates() {
  const [activeTab, setActiveTab] = useState('My Templates');

  const templates = [
    { id: 1, title: 'First Follow-up', subject: 'A gentle reminder', sent: 0, viewed: 0, owner: 'Tanay' },
    { id: 2, title: 'Second Follow-up', subject: 'I look forward to your reply', sent: 0, viewed: 0, owner: 'Tanay' },
    { id: 3, title: 'Third Follow-up', subject: 'I hope I am not bugging you', sent: 0, viewed: 0, owner: 'Tanay' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Templates</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto bg-[#F9FAFB]">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex bg-gray-100 p-1 rounded-md">
              <button 
                onClick={() => setActiveTab('My Templates')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'My Templates' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                My Templates
              </button>
              <button 
                onClick={() => setActiveTab('Team Templates')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'Team Templates' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Team Templates
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                New Template
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                      Title
                      <span className="text-[10px]">↑↓</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                      Owner
                      <span className="text-[10px]">↑↓</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {templates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{template.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{template.subject}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5" title="Sent">
                          <Send className="w-4 h-4 text-gray-400" />
                          <span>{template.sent}</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Viewed">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span>{template.viewed}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{template.owner}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <button className="p-1 hover:bg-gray-200 rounded-md transition-colors text-gray-400 hover:text-gray-600">
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
  );
}

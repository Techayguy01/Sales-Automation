import React, { useState } from 'react';
import { 
  Search, Filter, Send, Tag, X, CornerUpLeft, Ban, Flag, Pause, Play, 
  RefreshCw, Download, CheckCircle2, ChevronDown, Mail, Eye, Trash2,
  ThumbsUp, Calendar, DollarSign, Briefcase, GitBranch, Building2, Globe, Clock
} from 'lucide-react';
import { useProspects, Prospect } from '../hooks/useProspects';

export default function Prospects() {
  const { prospects, loading, deleteProspect, refresh } = useProspects();
  
  const [selectedAnalysis, setSelectedAnalysis] = useState<Prospect | null>(null);

  const handlePreviewEmail = (prospect: Prospect) => {
    if (prospect.email_body) {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`<pre style="font-family: sans-serif; padding: 20px; white-space: pre-wrap;">${prospect.email_body}</pre>`);
        newWindow.document.title = `Email Preview - ${prospect.company_name}`;
      }
    } else {
      alert('No email preview available for this prospect.');
    }
  };

  const handleDelete = async (run_id: string) => {
    if (window.confirm('Are you sure you want to delete this prospect?')) {
      await deleteProspect(run_id);
    }
  };

  const getFitScoreBadge = (score: string) => {
    switch (score?.toLowerCase()) {
      case 'high':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">High Fit</span>;
      case 'medium':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">Medium Fit</span>;
      case 'low':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">Low Fit</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">{score || 'Unknown'}</span>;
    }
  };

  const getEmailStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'sent':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 w-max"><Send className="w-3 h-3" /> Sent</span>;
      case 'replied':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1 w-max"><CornerUpLeft className="w-3 h-3" /> Replied</span>;
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Pending</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">{status || 'Unknown'}</span>;
    }
  };

  const stats = {
    total: prospects.length,
    pending: prospects.filter(p => p.email_status?.toLowerCase() === 'pending').length,
    sent: prospects.filter(p => p.email_status?.toLowerCase() === 'sent').length,
    replied: prospects.filter(p => p.email_status?.toLowerCase() === 'replied').length,
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 overflow-hidden relative">
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
          <button onClick={refresh} className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><RefreshCw className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Download className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Stats Tabs */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200 overflow-x-auto no-scrollbar gap-2 shrink-0">
        <div className="flex flex-col items-center justify-center px-6 py-2 bg-white border border-gray-200 shadow-sm rounded-lg min-w-[100px]">
          <span className="text-2xl font-semibold text-gray-900">{stats.total}</span>
          <span className="text-xs text-gray-600 font-medium">Total</span>
        </div>
        
        <div className="flex flex-col items-center justify-center px-6 py-2 min-w-[120px] cursor-pointer hover:bg-gray-50 rounded-lg">
          <span className="text-2xl font-semibold text-gray-900">{stats.pending}</span>
          <span className="text-xs text-gray-600 font-medium flex items-center gap-1">Pending <ChevronDown className="w-3 h-3" /></span>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-2 min-w-[100px] cursor-pointer hover:bg-gray-50 rounded-lg">
          <span className="text-2xl font-semibold text-gray-900">{stats.sent}</span>
          <span className="text-xs text-gray-600 font-medium">Sent</span>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-2 min-w-[100px] cursor-pointer hover:bg-gray-50 rounded-lg">
          <span className="text-2xl font-semibold text-gray-900">{stats.replied}</span>
          <span className="text-xs text-gray-600 font-medium">Replied</span>
        </div>

        <div className="w-px h-10 bg-gray-200 mx-2"></div>

        <div className="flex flex-col items-center justify-center px-6 py-2 min-w-[100px] cursor-pointer hover:bg-gray-50 rounded-lg opacity-50">
          <span className="text-2xl font-semibold text-gray-900">0</span>
          <span className="text-xs text-gray-600 font-medium flex items-center gap-1">Clicked <ChevronDown className="w-3 h-3" /></span>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-2 min-w-[100px] cursor-pointer hover:bg-gray-50 rounded-lg opacity-50">
          <span className="text-2xl font-semibold text-gray-900">0 <span className="text-sm text-gray-400 font-normal">$0</span></span>
          <span className="text-xs text-gray-600 font-medium flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-gray-400" /> Interested</span>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-2 min-w-[120px] cursor-pointer hover:bg-gray-50 rounded-lg opacity-50">
          <span className="text-2xl font-semibold text-gray-900">0 <span className="text-sm text-gray-400 font-normal">$0</span></span>
          <span className="text-xs text-gray-600 font-medium flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-400" /> Meeting Booked</span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 w-12">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Industry</th>
                <th className="px-4 py-3">Pipeline Stage</th>
                <th className="px-4 py-3">Fit Score</th>
                <th className="px-4 py-3">Email Status</th>
                <th className="px-4 py-3">Last Activity</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {prospects.map((prospect) => (
                <tr key={prospect.run_id} className="hover:bg-gray-50 group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{prospect.company_name}</div>
                        <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                          <Globe className="w-3 h-3" />
                          <a href={`https://${prospect.company_url}`} target="_blank" rel="noreferrer" className="hover:text-blue-600 hover:underline">
                            {prospect.company_url}
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{prospect.industry}</td>
                  <td className="px-4 py-4 text-gray-600 font-medium">{prospect.pipeline_stage}</td>
                  <td className="px-4 py-4">
                    {getFitScoreBadge(prospect.fit_score)}
                  </td>
                  <td className="px-4 py-4">
                    {getEmailStatusBadge(prospect.email_status)}
                  </td>
                  <td className="px-4 py-4 text-gray-500">
                    {new Date(prospect.last_activity).toLocaleDateString()} {new Date(prospect.last_activity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedAnalysis(prospect)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="View Analysis"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handlePreviewEmail(prospect)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Preview Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(prospect.run_id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Prospect"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {prospects.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No prospects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Analysis Drawer */}
      <div className={`absolute inset-y-0 right-0 w-[400px] bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 z-50 flex flex-col ${selectedAnalysis ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">AI Analysis</h3>
          <button onClick={() => setSelectedAnalysis(null)} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {selectedAnalysis && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Company</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">{selectedAnalysis.company_name}</div>
                    <a href={`https://${selectedAnalysis.company_url}`} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                      {selectedAnalysis.company_url}
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">Fit Score</div>
                  {getFitScoreBadge(selectedAnalysis.fit_score)}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">Industry</div>
                  <div className="font-medium text-gray-900">{selectedAnalysis.industry}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">AI Insights</h4>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-900 leading-relaxed">
                  {selectedAnalysis.analysis || 'No analysis available for this prospect.'}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Generated Email</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap font-mono text-xs">
                  {selectedAnalysis.email_body || 'No email generated yet.'}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button onClick={() => setSelectedAnalysis(null)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md transition-colors">
            Close
          </button>
          {selectedAnalysis?.email_body && (
            <button 
              onClick={() => handlePreviewEmail(selectedAnalysis)}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Preview Email
            </button>
          )}
        </div>
      </div>
      
      {/* Drawer Overlay */}
      {selectedAnalysis && (
        <div 
          className="absolute inset-0 bg-gray-900/20 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedAnalysis(null)}
        />
      )}
    </div>
  );
}

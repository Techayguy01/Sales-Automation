import { useState, useEffect } from 'react';

export interface Prospect {
  run_id: string;
  company_name: string;
  company_url: string;
  industry: string;
  pipeline_stage: string;
  fit_score: 'High' | 'Medium' | 'Low' | string;
  email_status: 'sent' | 'replied' | 'pending' | string;
  last_activity: string;
  analysis?: string;
  email_body?: string;
}

export function useProspects() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProspects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/history');
      if (!res.ok) throw new Error('Failed to fetch prospects');
      const data = await res.json();
      setProspects(data || []);
    } catch (err: any) {
      setError(err.message);
      // Fallback for UI demonstration if API is not yet available
      setProspects([
        {
          run_id: '1',
          company_name: 'TechCorp Solutions',
          company_url: 'techcorp.com',
          industry: 'Software',
          pipeline_stage: 'Initial Outreach',
          fit_score: 'High',
          email_status: 'sent',
          last_activity: new Date().toISOString(),
          analysis: 'Strong fit based on recent funding round and hiring in automation roles.',
          email_body: 'Hi there,\n\nI noticed TechCorp is expanding its automation team...'
        },
        {
          run_id: '2',
          company_name: 'Global Industries',
          company_url: 'globalind.com',
          industry: 'Manufacturing',
          pipeline_stage: 'Follow Up',
          fit_score: 'Medium',
          email_status: 'replied',
          last_activity: new Date(Date.now() - 86400000).toISOString(),
          analysis: 'Good fit, but currently using a competitor. Worth a follow-up in Q3.',
          email_body: 'Hi,\n\nThanks for reaching out. We are currently evaluating options...'
        },
        {
          run_id: '3',
          company_name: 'Apex Logistics',
          company_url: 'apexlogistics.com',
          industry: 'Supply Chain',
          pipeline_stage: 'Research',
          fit_score: 'Low',
          email_status: 'pending',
          last_activity: new Date(Date.now() - 172800000).toISOString(),
          analysis: 'Low fit due to company size and lack of relevant technology stack.',
          email_body: ''
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProspects();
  }, []);

  const deleteProspect = async (run_id: string) => {
    try {
      const res = await fetch(`/run/${run_id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete prospect');
      setProspects(prev => prev.filter(p => p.run_id !== run_id));
    } catch (err: any) {
      console.error(err);
      // Optimistic delete for demo purposes if API fails
      setProspects(prev => prev.filter(p => p.run_id !== run_id));
    }
  };

  return { prospects, loading, error, deleteProspect, refresh: fetchProspects };
}

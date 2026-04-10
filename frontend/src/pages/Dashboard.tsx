import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { MainLayout } from '../components/MainLayout';
import { StatsOverview } from '../components/StatsOverview';
import { motion } from 'framer-motion';

export function Dashboard() {
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data } = await api.get('/jobs');
      return data;
    }
  });

  const recentActivity = applications
    .sort((a: any, b: any) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
    .slice(0, 5);

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Executive Overview</h1>
        <p className="text-on-surface-variant font-body">Deep analytics and strategy insights for your career progression.</p>
      </div>

      {isLoading ? (
        <div className="h-[400px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Top Line Stats */}
          <StatsOverview applications={applications} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pipeline Visualization (Simple CSS version) */}
            <motion.section 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-sm"
            >
              <h3 className="text-xl font-bold font-headline mb-6">Pipeline Velocity</h3>
              <div className="space-y-6">
                {['Applied', 'Phone Screen', 'Interview', 'Offer'].map((status) => {
                  const count = applications.filter((a: any) => a.status === status).length;
                  const percentage = applications.length > 0 ? (count / applications.length) * 100 : 0;
                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex justify-between text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                        <span>{status}</span>
                        <span>{count} roles</span>
                      </div>
                      <div className="h-3 bg-surface-container rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full ${status === 'Offer' ? 'bg-secondary' : 'bg-primary/60'}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>

            {/* Recent Activity */}
            <motion.section 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/10 shadow-sm"
            >
              <h3 className="text-xl font-bold font-headline mb-6">Recent Signals</h3>
              <div className="relative border-l-2 border-outline-variant/20 ml-3 pl-6 space-y-8">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-on-surface-variant italic">No activity recorded yet.</p>
                ) : (
                  recentActivity.map((app: any) => (
                    <div key={app._id} className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-secondary border-4 border-surface ring-2 ring-secondary/20"></div>
                      <p className="text-sm font-bold text-on-surface line-clamp-1">{app.company}</p>
                      <p className="text-xs text-on-surface-variant">{app.role}</p>
                      <div className="mt-2 inline-block px-2 py-0.5 rounded bg-surface-container-highest text-[10px] font-black uppercase tracking-widest text-primary">
                        {app.status}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.section>

            {/* AI Strategy Insights */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3 ai-glass p-8 rounded-2xl border border-outline-variant/10 shadow-xl overflow-hidden relative"
            >
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6 font-headline font-bold text-xl">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  Career Strategy Generator
                </div>
                <div className="bg-surface-container-lowest/40 backdrop-blur-md p-6 rounded-xl border border-secondary/10 text-on-surface leading-relaxed italic">
                  {applications.length === 0 ? (
                    "Initialize your strategy by adding your first application from the Board."
                  ) : (
                    `Your pipeline is currently concentrated in ${
                      applications.filter((a: any) => a.status === 'Applied').length > applications.length / 2 ? 'early-stage applications' : 'active screening'
                    }. Recommendation: ${
                      applications.filter((a: any) => a.status === 'Offer').length > 0 
                        ? 'Focus on negotiation and final stage evaluations.' 
                        : 'Review your resume optimization stats to increase interview conversion rates.'
                    }`
                  )}
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

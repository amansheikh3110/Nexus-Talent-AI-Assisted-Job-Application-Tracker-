import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Application {
  status: string;
  aiSuggestions?: string[];
  [key: string]: any;
}

interface StatsOverviewProps {
  applications: Application[];
}

export function StatsOverview({ applications }: StatsOverviewProps) {
  const stats = useMemo(() => {
    const total = applications.length;
    const byStatus = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const interviews = (byStatus['Interview'] || 0) + (byStatus['Phone Screen'] || 0);
    const offers = byStatus['Offer'] || 0;
    
    // Pipeline health: What % are beyond just "Applied"
    const pipelineHealth = total > 0 ? Math.round(((total - (byStatus['Applied'] || 0) - (byStatus['Rejected'] || 0)) / total) * 100) : 0;
    
    // AI Score: What % have AI suggestions
    const aiOptimized = applications.filter(app => app.aiSuggestions && app.aiSuggestions.length > 0).length;
    const aiScore = total > 0 ? Math.round((aiOptimized / total) * 100) : 0;

    return { total, interviews, offers, pipelineHealth, aiScore, byStatus };
  }, [applications]);

  const cardVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    })
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {/* Total Applications */}
      <motion.div 
        custom={0} initial="hidden" animate="visible" variants={cardVariants}
        className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="material-symbols-outlined text-6xl">layers</span>
        </div>
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-1">Total Pipeline</p>
        <h3 className="text-4xl font-black font-headline text-primary mb-2">{stats.total}</h3>
        <p className="text-xs text-on-surface-variant flex items-center gap-1 font-medium">
          <span className="material-symbols-outlined text-xs text-secondary">trending_up</span>
          Active Opportunities
        </p>
      </motion.div>

      {/* Pipeline Health */}
      <motion.div 
        custom={1} initial="hidden" animate="visible" variants={cardVariants}
        className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="material-symbols-outlined text-6xl">bolt</span>
        </div>
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-1">Pipeline Health</p>
        <div className="flex items-baseline gap-2 mb-2">
          <h3 className="text-4xl font-black font-headline text-secondary">{stats.pipelineHealth}%</h3>
        </div>
        <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${stats.pipelineHealth}%` }} 
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-secondary shadow-[0_0_10px_rgba(107,56,212,0.3)]"
          />
        </div>
      </motion.div>

      {/* AI Strategy Score */}
      <motion.div 
        custom={2} initial="hidden" animate="visible" variants={cardVariants}
        className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        </div>
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-1">Strategy Score</p>
        <h3 className="text-4xl font-black font-headline text-tertiary">{stats.aiScore}%</h3>
        <p className="text-xs text-on-surface-variant flex items-center gap-1 font-medium">
          <span className="material-symbols-outlined text-xs text-tertiary">verified</span>
          AI Optimized Roles
        </p>
      </motion.div>

      {/* High-Impact Progress */}
      <motion.div 
        custom={3} initial="hidden" animate="visible" variants={cardVariants}
        className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="material-symbols-outlined text-6xl">military_tech</span>
        </div>
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-1">Success Signals</p>
        <div className="flex gap-4 mb-2">
          <div>
            <span className="text-2xl font-black font-headline text-on-surface block">{stats.interviews}</span>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Interviews</span>
          </div>
          <div className="w-px h-8 bg-outline-variant/20 self-center"></div>
          <div>
            <span className="text-2xl font-black font-headline text-secondary block">{stats.offers}</span>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Offers</span>
          </div>
        </div>
        <p className="text-[10px] text-on-surface-variant/60 font-medium">Target: 3 active interview loops</p>
      </motion.div>
    </div>
  );
}
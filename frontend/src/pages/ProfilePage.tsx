import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MainLayout } from '../components/MainLayout';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { useNotifications } from '../contexts/NotificationContext';
import { useQuery } from '@tanstack/react-query';

export function ProfilePage() {
  const { user, refetchUser } = useAuth();
  const { addNotification } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || ''
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data } = await api.get('/jobs');
      return data;
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || ''
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/user/me', formData);
      await refetchUser();
      setIsEditing(false);
      addNotification({
        type: 'info',
        title: 'Profile Updated',
        message: 'Your executive profile has been updated successfully.'
      });
    } catch (err) {
      console.error("Failed to update profile", err);
      addNotification({
        type: 'info',
        title: 'Update Failed',
        message: 'There was an error saving your profile details.'
      });
    }
  };

  const statCards = [
    { label: 'Applications', value: applications.length, icon: 'description', color: 'text-primary' },
    { label: 'Active Pipeline', value: applications.filter((a: any) => ['Phone Screen', 'Interview'].includes(a.status)).length, icon: 'trending_up', color: 'text-secondary' },
    { label: 'Offers', value: applications.filter((a: any) => a.status === 'Offer').length, icon: 'workspace_premium', color: 'text-secondary' },
  ];

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto pb-20">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Executive Profile</h1>
            <p className="text-on-surface-variant font-body">Manage your professional identity and career strategy parameters.</p>
          </motion.div>
          {!isEditing && (
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Edit Profile
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Side: Avatar & Basic Info */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/10 shadow-sm flex flex-col items-center text-center"
            >
              <div className="w-32 h-32 rounded-3xl bg-primary-container flex items-center justify-center text-on-primary-container font-black text-4xl font-headline mb-6 shadow-xl ring-4 ring-primary/10">
                {formData.fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold font-headline text-on-surface mb-1">{formData.fullName || 'Executive User'}</h2>
              <p className="text-sm text-on-surface-variant font-label mb-6">{user?.email}</p>
              <div className="w-full h-px bg-outline-variant/20 mb-6"></div>
              <div className="grid grid-cols-1 gap-4 w-full">
                {statCards.map((stat, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/5">
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined ${stat.color} text-xl`}>{stat.icon}</span>
                      <span className="text-sm font-medium text-on-surface-variant">{stat.label}</span>
                    </div>
                    <span className="text-lg font-bold font-headline">{stat.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="ai-glass p-6 rounded-2xl border border-secondary/10 shadow-lg relative overflow-hidden"
            >
              <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>
              <h3 className="font-bold font-headline text-sm uppercase tracking-widest text-secondary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                Strategy Insight
              </h3>
              <p className="text-sm text-on-surface leading-relaxed italic">
                {applications.length < 5 
                  ? "Build your data foundation. Add more applications to unlock deeper AI-driven career pathing."
                  : "Your executive mobility score is trending upward. Focus on high-impact roles to maintain momentum."}
              </p>
            </motion.div>
          </div>

          {/* Right Side: Edit Form / Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-8 md:p-10 rounded-2xl border border-outline-variant/10 shadow-sm"
          >
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full bg-surface-container p-4 rounded-xl border-none outline-none focus:ring-2 ring-primary/40 font-body text-on-surface transition-all"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      placeholder="e.g. Alexander Pierce"
                      required
                    />
                  </div>
                  <div className="space-y-2 opacity-60">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email (Primary)</label>
                    <input
                      type="email"
                      className="w-full bg-surface-container-highest p-4 rounded-xl border-none outline-none font-body text-on-surface cursor-not-allowed"
                      value={user?.email}
                      readOnly
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Professional Bio</label>
                  <textarea
                    className="w-full min-h-[150px] bg-surface-container p-4 rounded-xl border-none outline-none focus:ring-2 ring-primary/40 font-body text-on-surface transition-all resize-none leading-relaxed"
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                    placeholder="Short summary of your career objectives, experience, or what you're currently architecting..."
                  />
                  <p className="text-[10px] text-on-surface-variant ml-1">This bio helps the Strategy Generator better contextualize your applications.</p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="submit"
                    className="px-8 py-3 milled-gradient text-white font-bold rounded-lg shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-surface-container-high text-on-surface-variant font-bold rounded-lg hover:bg-surface-container-highest transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Full Name</p>
                    <p className="text-xl font-bold font-headline">{user?.fullName || 'Not yet set'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Account Status</p>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-secondary"></span>
                       <p className="text-xl font-bold font-headline capitalize">Executive Tier</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Professional Statement</p>
                  <div className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-secondary/30 italic">
                    <p className="text-on-surface leading-relaxed font-body">
                      {user?.bio || 'No professional bio provided. Click "Edit Profile" to define your career mission statement.'}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-outline-variant/10">
                  <h4 className="font-bold font-headline mb-4 text-sm">Security & Access</h4>
                  <button className="flex items-center gap-3 px-5 py-3 rounded-xl bg-surface-container text-on-surface font-bold text-xs hover:bg-surface-container-high transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-sm">vpn_key</span>
                    Update Security Credentials
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}

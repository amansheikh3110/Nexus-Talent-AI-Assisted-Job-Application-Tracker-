import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { useNotifications } from '../contexts/NotificationContext';

interface ParsedData {
  company: string;
  role: string;
  skills: string[];
  niceToHave?: string[];
  seniority?: string;
  location?: string;
  suggestions?: string[];
}

export function AIParserModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addNotification } = useNotifications();
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleParse = async () => {
    if (!jdText.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/ai/parse', { jdText });
      const parsedResult = res.data;

      // Now get suggestions
      const suggRes = await api.post('/ai/suggestions', { parsedData: parsedResult });
      setParsedData({ ...parsedResult, suggestions: suggRes.data.suggestions });
      
      addNotification({
        type: 'ai_parse',
        title: 'AI Analysis Complete',
        message: `Successfully structured the ${parsedResult.role || 'role'} at ${parsedResult.company || 'company'} from the provided text.`
      });
    } catch (err: any) {
      console.error("Parse failed", err);
      setError(err.response?.data?.error || 'AI processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!parsedData) return;
    setSaving(true);
    setError('');

    try {
      await api.post('/jobs', {
        company: parsedData.company,
        role: parsedData.role,
        jdLink: '',
        notes: `Skills: ${parsedData.skills?.join(', ')}\nSeniority: ${parsedData.seniority || 'N/A'}\nLocation: ${parsedData.location || 'N/A'}\nNice-to-have: ${parsedData.niceToHave?.join(', ') || 'N/A'}`,
        aiSuggestions: parsedData.suggestions,
        status: 'Applied'
      });
      
      addNotification({
        type: 'app_created',
        title: 'Strategy Curated',
        message: `Your application for ${parsedData.role} at ${parsedData.company} is now live.`
      });
      
      setShowSuccess(true);
      setTimeout(() => {
        closeFully();
      }, 1800);
    } catch (err: any) {
      console.error("Save failed", err);
      setError(err.response?.data?.error || 'Failed to save application.');
    } finally {
      setSaving(false);
    }
  };

  const closeFully = () => {
    setJdText('');
    setParsedData(null);
    setError('');
    setShowSuccess(false);
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-surface flex flex-col font-body text-on-surface overflow-auto">
      <header className="flex justify-between items-center w-full px-8 py-4 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/20 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg milled-button flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[16px]">architecture</span>
          </div>
          <span className="font-headline font-semibold text-lg text-primary">Architect AI Module</span>
        </div>
        <button onClick={closeFully} className="px-4 py-2 hover:bg-surface-container text-on-surface-variant font-bold rounded-lg flex items-center gap-1 transition cursor-pointer">
          <span className="material-symbols-outlined text-sm">close</span> Close
        </button>
      </header>

      <main className="flex-1 px-8 py-12 max-w-6xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 pb-6 border-b border-outline-variant/10">
          <div>
            <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight leading-none mb-2">New Opportunity</h1>
            <p className="text-on-surface-variant font-medium">Add a new role to your curated career board.</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button onClick={closeFully} className="px-6 py-2 bg-surface-container-high text-primary font-semibold rounded-lg hover:bg-primary-fixed transition-all cursor-pointer">Discard</button>
            <button
              disabled={!parsedData || saving}
              onClick={handleSave}
              className={`px-8 py-2 font-semibold rounded-lg shadow-lg transition-all cursor-pointer ${parsedData ? 'ai-gradient text-white hover:opacity-90' : 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed opacity-50'}`}
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg font-medium text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            {error}
          </div>
        )}

        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left Column: Input */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            {!parsedData ? (
              <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-headline text-xl font-bold text-on-surface">Job Description</h2>
                  <div className="flex items-center gap-2 text-secondary font-semibold text-sm">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span> Powered by Architect AI
                  </div>
                </div>

                {loading ? (
                  <div className="h-80 bg-surface-container-low rounded-lg p-6 flex flex-col items-center justify-center text-center border border-outline-variant/10">
                    <div className="w-16 h-16 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(107,56,212,0.3)]"></div>
                    <p className="font-headline font-bold text-on-surface text-lg">Synchronizing AI Agents...</p>
                    <p className="text-sm text-on-surface-variant mt-1">Extracting market signals and cultural fit indicators.</p>
                  </div>
                ) : (
                  <>
                    <textarea
                      className="w-full h-80 bg-surface-container-low border-none rounded-lg p-6 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-secondary/20 transition-all resize-none font-body leading-relaxed outline-none"
                      placeholder="Paste the full job description here. Our AI will handle the extraction of key roles, skills, and strategic signals..."
                      value={jdText}
                      onChange={e => setJdText(e.target.value)}
                    />
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={handleParse}
                        disabled={!jdText.trim()}
                        className="flex items-center gap-2 px-10 py-4 bg-secondary text-white font-bold rounded-lg shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined group-hover:-translate-y-0.5 transition-transform">rocket_launch</span>
                        Parse with AI
                      </button>
                    </div>
                  </>
                )}
              </section>
            ) : (
              <>
                {/* Auto-filled Fields */}
                <section className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2 font-bold">Company</label>
                      <div className="w-full bg-surface-container-highest rounded-lg px-4 py-3 text-on-surface font-semibold">{parsedData.company}</div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2 font-bold">Role Title</label>
                      <div className="w-full bg-surface-container-highest rounded-lg px-4 py-3 text-on-surface font-semibold">{parsedData.role}</div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2 font-bold">Seniority</label>
                      <div className="w-full bg-surface-container-highest rounded-lg px-4 py-3 text-on-surface font-semibold">{parsedData.seniority || 'N/A'}</div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2 font-bold">Location</label>
                      <div className="w-full bg-surface-container-highest rounded-lg px-4 py-3 text-on-surface font-semibold flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-on-surface-variant">location_on</span>
                        {parsedData.location || 'N/A'}
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2 font-bold">Extracted Skills (Tags)</label>
                      <div className="flex flex-wrap gap-2 p-4 bg-surface-container-highest rounded-lg min-h-[60px]">
                        {parsedData.skills?.map((skill: string) => (
                          <span key={skill} className="px-3 py-1.5 bg-primary-container text-on-primary-container rounded-full text-xs font-bold uppercase tracking-wider">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {parsedData.niceToHave && parsedData.niceToHave.length > 0 && (
                      <div className="col-span-2">
                        <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2 font-bold">Nice to Have</label>
                        <div className="flex flex-wrap gap-2 p-4 bg-surface-container-highest rounded-lg">
                          {parsedData.niceToHave.map((skill: string) => (
                            <span key={skill} className="px-3 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold uppercase tracking-wider">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Start Over + Context block */}
                <div className="flex gap-4">
                  <button onClick={() => { setParsedData(null); setJdText(''); }} className="px-6 py-3 bg-surface-container-high text-primary font-semibold rounded-lg hover:bg-primary-fixed transition-all cursor-pointer flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">refresh</span> Start Over
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right Column: AI Insights */}
          <div className="col-span-12 lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <section className="bg-surface-container-lowest/80 backdrop-blur-xl rounded-xl p-8 border-l-4 border-secondary overflow-hidden relative shadow-lg">
              <div className="absolute -right-4 -top-4 text-secondary/10 transform rotate-12">
                <span className="material-symbols-outlined text-9xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>

              <h3 className="font-headline text-lg font-bold text-on-surface mb-6 flex items-center gap-2 relative z-10">
                <span className="material-symbols-outlined text-secondary">verified</span> Resume Optimization
              </h3>

              {!parsedData ? (
                <div className="p-4 bg-surface-container-low rounded-lg text-sm text-on-surface-variant italic relative z-10">
                  Awaiting job description input. AI suggestions will populate here after parsing.
                </div>
              ) : (
                <>
                  <div className="space-y-4 relative z-10 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                    {parsedData.suggestions?.map((sugg: string, i: number) => (
                      <div key={i} className="p-4 bg-surface-container-high rounded-lg hover:bg-surface-container-highest transition-all cursor-default group">
                        <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Impact Suggestion {i + 1}</p>
                        <p className="text-sm text-on-surface leading-relaxed">{sugg}</p>
                        <div className="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => copyToClipboard(sugg)}
                            className="text-xs font-bold text-primary flex items-center gap-1 px-3 py-1.5 bg-primary/5 rounded-lg hover:bg-primary/10 transition cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">content_copy</span> Copy
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-outline-variant/20 relative z-10">
                    <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">Strategic Match Score</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-surface-container-highest h-3 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary w-[82%] rounded-full shadow-[0_0_12px_rgba(107,56,212,0.4)]"></div>
                      </div>
                      <span className="font-headline font-black text-secondary text-2xl">82%</span>
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-on-surface/60 backdrop-blur-md z-[100] flex items-center justify-center">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-surface-container-lowest p-10 rounded-2xl max-w-sm w-full shadow-2xl text-center">
              <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <h3 className="font-headline text-3xl font-black text-on-surface mb-2">Application Formed</h3>
              <p className="text-on-surface-variant text-sm">Role successfully curated into your board. Strategy ready.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState } from 'react';
import api from '../lib/api';

export function ApplicationDetailModal({ application, onClose, onDelete, refetchApps }: { application: any; onClose: () => void; onDelete: () => void; refetchApps: () => void }) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(application.notes || '');

  if (!application) return null;

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      await api.put(`/jobs/${application._id}`, { status: e.target.value });
      refetchApps();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotes = async () => {
    try {
      await api.put(`/jobs/${application._id}`, { notes });
      refetchApps();
      setEditingNotes(false);
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-surface flex flex-col font-body text-on-surface overflow-auto">
      {/* Top bar */}
      <header className="flex justify-between items-center w-full px-8 py-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-outline-variant/20 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary transition p-2 rounded hover:bg-surface-container cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <span className="font-headline font-semibold text-lg text-on-surface">Application Details</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-surface-container-high text-primary rounded-lg font-bold text-sm hover:bg-primary-fixed transition-colors cursor-pointer flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">close</span> Close
          </button>
          <button onClick={onDelete} className="px-4 py-2 bg-error-container text-on-error-container rounded-lg font-bold text-sm hover:opacity-80 transition-colors flex items-center gap-1 cursor-pointer">
            <span className="material-symbols-outlined text-sm">delete</span> Delete
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full px-8 pt-12 pb-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3 text-on-surface-variant font-label text-sm uppercase tracking-widest font-bold">
              <span>Applications</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-primary">{application.company}</span>
            </div>
            <h1 className="text-4xl font-extrabold font-headline tracking-tight mb-4">{application.role}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center font-bold text-on-primary-container font-headline text-sm">
                  {application.company?.charAt(0) || '?'}
                </div>
                <span className="text-lg font-semibold">{application.company}</span>
              </div>
              <span className="text-on-surface-variant">•</span>
              <span className="text-on-surface-variant font-label text-sm">Created: {new Date(application.createdAt || application.dateApplied).toLocaleDateString()}</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
                <p className="text-on-surface-variant text-xs font-label uppercase tracking-widest mb-3 font-bold">Status</p>
                <div className="relative">
                  <select
                    defaultValue={application.status}
                    onChange={handleStatusChange}
                    className="w-full bg-tertiary-container text-on-tertiary-container font-bold py-3 px-4 rounded-lg border-none focus:ring-2 ring-secondary/40 appearance-none font-label cursor-pointer"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Phone Screen">Phone Screen</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-on-tertiary-container text-sm">expand_more</span>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
                <p className="text-on-surface-variant text-xs font-label uppercase tracking-widest mb-3 font-bold">Date Applied</p>
                <p className="text-xl font-bold font-headline">{new Date(application.createdAt || application.dateApplied).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            {/* Internal Notes */}
            <section className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">document_scanner</span> Internal Notes
                </h3>
                <button
                  onClick={() => setEditingNotes(!editingNotes)}
                  className="text-primary font-bold text-sm flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <span className="material-symbols-outlined text-sm">{editingNotes ? 'check' : 'edit_note'}</span>
                  {editingNotes ? 'Done' : 'Edit'}
                </button>
              </div>
              {editingNotes ? (
                <div>
                  <textarea
                    className="w-full min-h-[150px] bg-surface-container-highest rounded-lg p-4 text-on-surface font-body text-sm leading-relaxed outline-none focus:ring-2 focus:ring-secondary/20 resize-none border-none"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                  <button onClick={handleSaveNotes} className="mt-4 px-6 py-2 ai-gradient text-white font-bold rounded-lg text-sm cursor-pointer hover:opacity-90 transition">
                    Save Notes
                  </button>
                </div>
              ) : (
                <div className="bg-surface-container-lowest p-4 rounded-lg shadow-sm border-l-4 border-secondary/30">
                  <p className="text-on-surface leading-relaxed whitespace-pre-wrap text-sm">
                    {application.notes || 'No notes yet. Click Edit to add context about this application.'}
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: AI Insights Panel */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white/70 backdrop-blur-xl rounded-xl relative overflow-hidden shadow-xl border border-outline-variant/10">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>

              <div className="p-6 relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-secondary/10 rounded-lg text-secondary border border-secondary/20">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold font-headline leading-none">AI Insights</h3>
                    <p className="text-xs text-on-surface-variant font-label mt-1">Tailored for this role</p>
                  </div>
                </div>

                {!application.aiSuggestions?.length ? (
                  <p className="text-sm text-on-surface-variant italic p-4 bg-surface-container-low rounded-lg">No AI suggestions stored for this application.</p>
                ) : (
                  <div className="space-y-4">
                    {application.aiSuggestions.map((sugg: string, i: number) => (
                      <div key={i} className="group">
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <p className="text-sm font-medium leading-relaxed">"{sugg}"</p>
                          <button
                            onClick={() => copyToClipboard(sugg)}
                            className="p-2 bg-surface-container-high rounded text-primary hover:bg-primary-fixed transition-all shrink-0 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">content_copy</span>
                          </button>
                        </div>
                        <div className="h-px w-full bg-outline-variant opacity-20"></div>
                      </div>
                    ))}
                  </div>
                )}

                <button className="w-full mt-6 py-3 bg-secondary-container text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer">
                  <span className="material-symbols-outlined text-sm">refresh</span> Regenerate Insights
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

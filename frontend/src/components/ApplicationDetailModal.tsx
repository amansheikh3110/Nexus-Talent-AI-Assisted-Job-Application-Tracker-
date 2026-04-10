import { useState } from 'react';
import api from '../lib/api';
import { useNotifications } from '../contexts/NotificationContext';

export function ApplicationDetailModal({ application, onClose, onDelete, refetchApps }: { application: any; onClose: () => void; onDelete: () => void; refetchApps: () => void }) {
  const { addNotification } = useNotifications();
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(application.notes || '');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!application) return null;

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const newStatus = e.target.value;
      await api.put(`/jobs/${application._id}`, { status: newStatus });
      refetchApps();
      addNotification({
        type: 'status_change',
        title: 'Status Updated',
        message: `${application.company} status changed to ${newStatus}.`
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotes = async () => {
    try {
      await api.put(`/jobs/${application._id}`, { notes });
      refetchApps();
      setEditingNotes(false);
      addNotification({
        type: 'info',
        title: 'Notes Saved',
        message: `Application notes updated for ${application.company}.`
      });
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-surface flex flex-col font-body text-on-surface overflow-auto transition-colors duration-300">
      {/* TopNavBar Shell */}
      <nav className="flex justify-between items-center w-full px-8 py-4 fixed top-0 z-40 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/10 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <span className="text-lg font-black text-primary font-headline">Architect</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-surface-container-high text-primary rounded-lg font-bold text-sm hover:bg-primary-fixed transition-colors cursor-pointer">
            Edit
          </button>
          <button onClick={onDelete} className="px-4 py-2 bg-error-container text-on-error-container rounded-lg font-bold text-sm hover:opacity-80 transition-colors cursor-pointer">
            Delete
          </button>
        </div>
      </nav>

      <main className="pt-24 px-8 pb-12 max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-on-surface-variant font-label text-sm">
              <button onClick={onClose} className="hover:text-primary cursor-pointer">Applications</button>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span>{application.company}</span>
            </div>
            <h1 className="text-4xl font-extrabold font-headline tracking-tight mb-2">{application.role}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center overflow-hidden">
                  <span className="font-headline font-bold text-primary text-sm">{application.company?.charAt(0)}</span>
                </div>
                <span className="text-lg font-semibold font-headline">{application.company}</span>
              </div>
              <span className="text-on-surface-variant">•</span>
              <span className="text-on-surface-variant font-label">Applied: {new Date(application.createdAt || application.dateApplied).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column: Details & Description */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Quick Info Bento Grid - 3 columns like the screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10">
                <p className="text-on-surface-variant text-xs font-label uppercase tracking-widest mb-2">Status</p>
                <div className="relative inline-block w-full">
                  <select
                    defaultValue={application.status}
                    onChange={handleStatusChange}
                    className="w-full bg-tertiary-container text-on-tertiary-container font-bold py-2 px-4 rounded-lg border-none focus:ring-2 ring-secondary/40 appearance-none font-label cursor-pointer"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Phone Screen">Phone Screen</option>
                    <option value="Interview">Interviewing</option>
                    <option value="Offer">Offer Received</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-on-tertiary-container text-sm">expand_more</span>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10">
                <p className="text-on-surface-variant text-xs font-label uppercase tracking-widest mb-2">Salary Range</p>
                <p className="text-xl font-bold font-headline">{application.salaryRange || 'Not specified'}</p>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10">
                <p className="text-on-surface-variant text-xs font-label uppercase tracking-widest mb-2">Location</p>
                <p className="text-xl font-bold font-headline">
                  {/* Extract location from notes if available */}
                  {application.notes?.match(/Location:\s*([^\n]+)/)?.[1] || 'Not specified'}
                </p>
              </div>
            </div>

            {/* Job Description / Notes Section */}
            <section className="bg-surface-container-lowest p-8 rounded-lg shadow-sm relative overflow-hidden border border-outline-variant/10">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary-container"></div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-headline">Job Description</h3>
              </div>
              <div className="prose max-w-none text-on-surface leading-relaxed space-y-4 font-body">
                <p className="whitespace-pre-wrap">{application.notes || 'No job description context captured.'}</p>
              </div>
            </section>

            {/* Internal Notes Section */}
            <section className="bg-surface-container-low p-8 rounded-lg border border-outline-variant/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-headline">Internal Notes</h3>
                <button
                  onClick={() => setEditingNotes(!editingNotes)}
                  className="text-primary font-bold text-sm flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <span className="material-symbols-outlined text-sm">{editingNotes ? 'save' : 'edit_note'}</span>
                  {editingNotes ? 'Save' : 'Add Note'}
                </button>
              </div>
              {editingNotes ? (
                <div>
                  <textarea
                    className="w-full min-h-[120px] bg-surface-container-highest rounded-lg p-4 text-on-surface font-body text-sm leading-relaxed outline-none focus:ring-2 focus:ring-secondary/20 resize-none border-none"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Add your interview notes, referral contacts, follow-up reminders..."
                  />
                  <button onClick={handleSaveNotes} className="mt-4 px-6 py-2 ai-gradient text-white font-bold rounded-lg text-sm cursor-pointer hover:opacity-90 transition">
                    Save Notes
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-surface-container-lowest p-4 rounded-lg shadow-sm border-l-4 border-secondary/30">
                    <p className="text-sm font-label text-on-surface-variant mb-2">
                      {new Date(application.createdAt || application.dateApplied).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-on-surface leading-relaxed text-sm">
                      {application.notes || 'No notes yet. Click "Add Note" to add context about this application.'}
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: AI Insights Panel */}
          <div className="col-span-12 lg:col-span-4">
            <div className="ai-glass rounded-lg p-1 relative overflow-hidden shadow-xl border border-outline-variant/10">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>

              <div className="p-6 relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold font-headline leading-none">AI Insights</h3>
                    <p className="text-xs text-on-surface-variant font-label">Tailored for this role</p>
                  </div>
                </div>

                {application.aiSuggestions?.length > 0 && (
                  <p className="text-sm text-on-surface mb-6 leading-relaxed italic border-l-2 border-secondary/30 pl-3">
                    "Use these points to highlight your relevant impact and experience for the {application.role} role."
                  </p>
                )}

                {!application.aiSuggestions?.length ? (
                  <p className="text-sm text-on-surface-variant italic p-4 bg-surface-container-low rounded-lg">No AI suggestions saved for this application.</p>
                ) : (
                  <div className="space-y-6">
                    {application.aiSuggestions.map((sugg: string, i: number) => (
                      <div key={i} className="group">
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <p className="text-sm font-medium leading-relaxed">"{sugg}"</p>
                          <button
                            onClick={() => copyToClipboard(sugg, i)}
                            className={`p-2 rounded transition-all shrink-0 cursor-pointer flex items-center justify-center min-w-[32px] ${copiedIndex === i ? 'bg-secondary/10 text-secondary' : 'bg-surface-container-high text-primary hover:bg-primary-fixed'}`}
                            title={copiedIndex === i ? "Copied!" : "Copy to clipboard"}
                          >
                            <span className="material-symbols-outlined text-sm">
                              {copiedIndex === i ? 'check' : 'content_copy'}
                            </span>
                          </button>
                        </div>
                        <div className="h-px w-full bg-outline-variant opacity-20"></div>
                      </div>
                    ))}
                  </div>
                )}

                <button className="w-full mt-8 py-3 bg-secondary-container text-on-secondary-container font-bold rounded-lg text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer">
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Regenerate Insights
                </button>
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="mt-8 bg-surface-container-lowest p-6 rounded-lg shadow-sm border-l-4 border-secondary border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-secondary">event_upcoming</span>
                <h4 className="font-bold text-sm">Next Steps</h4>
              </div>
              <div className="space-y-1 mb-4">
                <p className="text-lg font-bold font-headline">
                  {application.status === 'Applied' ? 'Follow Up' :
                   application.status === 'Phone Screen' ? 'Phone Screen Prep' :
                   application.status === 'Interview' ? 'Technical Deep-Dive' :
                   application.status === 'Offer' ? 'Negotiate Terms' : 'Review & Learn'}
                </p>
                <p className="text-sm text-on-surface-variant font-label">
                  Current phase: {application.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

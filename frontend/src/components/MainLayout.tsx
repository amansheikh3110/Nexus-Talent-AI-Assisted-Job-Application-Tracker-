import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Link, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
  onAddApplication?: () => void;
}

export function MainLayout({ children, onAddApplication }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isBoard = location.pathname === '/';

  const userInitial = user?.email?.charAt(0)?.toUpperCase() || 'U';
  const userName = user?.email?.split('@')[0] || 'User';

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body transition-colors duration-300">
      {/* SideNavBar */}
      <aside className="flex flex-col h-screen fixed left-0 top-0 w-64 border-r border-outline-variant/20 bg-surface-container-low z-50 transition-colors duration-300">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg milled-gradient flex items-center justify-center text-white font-black text-sm">EA</div>
            <div>
              <h2 className="text-on-background text-sm font-bold font-headline leading-tight">Executive Architect</h2>
              <p className="text-xs text-on-surface-variant">Career Strategist</p>
            </div>
          </div>
          <nav className="space-y-1">
            <Link
              to="/"
              className={`flex items-center gap-3 px-4 py-3 transition-colors duration-200 font-headline font-semibold tracking-tight rounded-lg ${
                isBoard
                  ? 'text-primary border-l-4 border-secondary bg-surface-container-lowest'
                  : 'text-on-surface-variant hover:bg-surface-container border-l-4 border-transparent'
              }`}
            >
              <span className="material-symbols-outlined">view_kanban</span>
              <span>Board</span>
            </Link>
            <Link
              to="#"
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors duration-200 font-headline font-semibold tracking-tight border-l-4 border-transparent"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </Link>
            <Link
              to="#"
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors duration-200 font-headline font-semibold tracking-tight border-l-4 border-transparent"
            >
              <span className="material-symbols-outlined">person</span>
              <span>Profile</span>
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-6 space-y-4">
          <button
            onClick={onAddApplication}
            className="w-full flex items-center justify-center gap-2 milled-gradient text-white py-3 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Application
          </button>

          <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/20">
            <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container font-bold font-headline text-sm">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-headline font-semibold text-sm text-on-background truncate">{userName}</p>
              <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* TopNavBar */}
      <header className="flex justify-between items-center w-full pl-72 pr-8 py-4 fixed top-0 z-40 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/10 transition-colors duration-300">
        <div className="flex items-center gap-4 flex-1">
          <span className="text-lg font-black text-primary font-headline hidden lg:block">Architect</span>
          <div className="flex items-center bg-surface-container rounded-lg px-3 py-2 w-64 group focus-within:ring-2 ring-secondary/40 transition-all">
            <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full font-label text-on-surface placeholder:text-on-surface-variant outline-none"
              placeholder="Search applications..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Dark/Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all cursor-pointer"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            <span className="material-symbols-outlined">
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => { setNotificationsOpen(!notificationsOpen); setSettingsOpen(false); setProfileOpen(false); }}
              className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all cursor-pointer relative"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-12 w-80 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/20 z-50 overflow-hidden">
                <div className="p-4 border-b border-outline-variant/10">
                  <h3 className="font-headline font-bold text-on-surface">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-4 hover:bg-surface-container transition-colors border-b border-outline-variant/10">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-on-surface">AI analysis complete</p>
                        <p className="text-xs text-on-surface-variant mt-1">Your latest job description has been parsed successfully.</p>
                        <p className="text-[10px] text-on-surface-variant mt-2">Just now</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-surface-container transition-colors border-b border-outline-variant/10">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-sm">event</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-on-surface">Interview reminder</p>
                        <p className="text-xs text-on-surface-variant mt-1">Don't forget to prepare for your upcoming interviews.</p>
                        <p className="text-[10px] text-on-surface-variant mt-2">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-surface-container transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-tertiary-container/30 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-on-surface-variant text-sm">tips_and_updates</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-on-surface">Welcome to Nexus Talent</p>
                        <p className="text-xs text-on-surface-variant mt-1">Start by adding your first application using AI Smart Entry.</p>
                        <p className="text-[10px] text-on-surface-variant mt-2">Today</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings Button */}
          <div className="relative">
            <button
              onClick={() => { setSettingsOpen(!settingsOpen); setNotificationsOpen(false); setProfileOpen(false); }}
              className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>

            {settingsOpen && (
              <div className="absolute right-0 top-12 w-72 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/20 z-50 overflow-hidden">
                <div className="p-4 border-b border-outline-variant/10">
                  <h3 className="font-headline font-bold text-on-surface">Settings</h3>
                </div>
                <div className="p-3 space-y-1">
                  {/* Theme Toggle Row */}
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                        {theme === 'light' ? 'dark_mode' : 'light_mode'}
                      </span>
                      <span className="text-sm font-medium text-on-surface">
                        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                      </span>
                    </div>
                    <div className={`w-10 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-secondary' : 'bg-surface-container-highest'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-1'}`}></div>
                    </div>
                  </button>

                  <div className="h-px bg-outline-variant/20 my-1"></div>

                  <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-surface-container transition-colors cursor-pointer text-left">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">account_circle</span>
                    <span className="text-sm font-medium text-on-surface">Account Settings</span>
                  </button>

                  <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-surface-container transition-colors cursor-pointer text-left">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">vpn_key</span>
                    <span className="text-sm font-medium text-on-surface">API Configuration</span>
                  </button>

                  <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-surface-container transition-colors cursor-pointer text-left">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">download</span>
                    <span className="text-sm font-medium text-on-surface">Export Data (CSV)</span>
                  </button>

                  <div className="h-px bg-outline-variant/20 my-1"></div>

                  <button
                    onClick={() => { logout(); setSettingsOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-error-container/30 transition-colors cursor-pointer text-left"
                  >
                    <span className="material-symbols-outlined text-error text-[20px]">logout</span>
                    <span className="text-sm font-medium text-error">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setSettingsOpen(false); setNotificationsOpen(false); }}
              className="cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm font-headline ring-2 ring-outline-variant/20 hover:ring-secondary/40 transition-all">
                {userInitial}
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 w-64 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/20 z-50 overflow-hidden">
                <div className="p-4 border-b border-outline-variant/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-lg font-headline">
                      {userInitial}
                    </div>
                    <div>
                      <p className="font-headline font-bold text-sm text-on-background">{userName}</p>
                      <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer text-left">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">person</span>
                    <span className="text-sm text-on-surface">View Profile</span>
                  </button>
                  <button
                    onClick={() => { logout(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-error-container/30 transition-colors cursor-pointer text-left"
                  >
                    <span className="material-symbols-outlined text-error text-[18px]">logout</span>
                    <span className="text-sm text-error">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Click-away overlay to close dropdowns */}
      {(settingsOpen || notificationsOpen || profileOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => { setSettingsOpen(false); setNotificationsOpen(false); setProfileOpen(false); }}
        />
      )}

      {/* Main Content Area */}
      <main className="ml-64 pt-24 min-h-screen transition-colors duration-300">
        <div className="px-8 pb-12">
          {children}
        </div>
      </main>
    </div>
  );
}

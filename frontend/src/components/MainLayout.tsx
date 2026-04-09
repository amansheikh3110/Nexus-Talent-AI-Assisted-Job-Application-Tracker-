import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
  onAddApplication?: () => void;
}

export function MainLayout({ children, onAddApplication }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isBoard = location.pathname === '/';

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body">
      {/* SideNavBar */}
      <aside className="flex flex-col h-screen fixed left-0 top-0 w-64 border-r-0 bg-slate-50 dark:bg-slate-900 transition-colors duration-200 z-50">
        <div className="p-6">
          <div className="text-xl font-bold text-blue-900 dark:text-blue-100 font-headline mb-8 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">architecture</span>
            Architect
          </div>
          <nav className="space-y-1">
            <Link to="/" className={`flex items-center gap-3 px-4 py-3 transition-colors duration-200 font-manrope font-semibold tracking-tight rounded-lg ${isBoard ? 'text-blue-700 dark:text-blue-300 border-l-4 border-violet-500 bg-white dark:bg-slate-800' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border-l-4 border-transparent'}`}>
              <span className="material-symbols-outlined">view_kanban</span>
              <span>Board</span>
            </Link>
            <Link to="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200 font-manrope font-semibold tracking-tight border-l-4 border-transparent">
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </Link>
            <Link to="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200 font-manrope font-semibold tracking-tight border-l-4 border-transparent">
              <span className="material-symbols-outlined">person</span>
              <span>Profile</span>
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-6 space-y-6">
          {/* Add Application button — actually wired */}
          <button
            onClick={onAddApplication}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary-container text-white py-3 rounded-lg font-semibold shadow-md hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Add Application</span>
          </button>

          <div className="flex items-center gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-sm font-headline font-bold">
              {user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-blue-900 dark:text-blue-100 font-headline truncate">{user?.email?.split('@')[0] || 'User'}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Career Strategist</div>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all font-semibold text-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* TopNavBar */}
      <header className="flex justify-between items-center w-full pl-72 pr-8 py-4 fixed top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm dark:shadow-none transition-all duration-300">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
            <input className="w-full pl-10 pr-4 py-2 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-secondary/40 text-sm font-body outline-none" placeholder="Search applications..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-slate-500">
            <button className="hover:text-blue-600 dark:hover:text-blue-300 transition-all duration-300 relative cursor-pointer">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-secondary rounded-full"></span>
            </button>
            <button className="hover:text-blue-600 dark:hover:text-blue-300 transition-all duration-300 cursor-pointer">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
          <div className="h-8 w-8 rounded-full overflow-hidden bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-xs font-headline">
            {user?.email?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="ml-64 pt-24 min-h-screen">
        <div className="px-8 pb-12">
          {children}
        </div>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { useNotifications } from '../contexts/NotificationContext';

export function AuthPage({ isLogin }: { isLogin: boolean }) {
  const { login } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let loggedInEmail = email;
      let isNewUser = false;
      if (isLogin) {
        const { data } = await api.post('/auth/login', { email, password });
        login(data.token, data.email);
        loggedInEmail = data.email;
      } else {
        await api.post('/auth/register', { email, password });
        const { data } = await api.post('/auth/login', { email, password });
        login(data.token, data.email);
        loggedInEmail = data.email;
        isNewUser = true;
      }
      
      addNotification({
        type: 'welcome',
        title: 'Welcome to Nexus Talent',
        message: isNewUser ? 'Your career strategy board is ready.' : `Welcome back, ${loggedInEmail.split('@')[0]}!`,
      });
      
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-background font-body text-on-surface antialiased">
      {/* Background Decorations (Intentional Asymmetry) */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute top-1/2 -right-48 w-[32rem] h-[32rem] bg-secondary-container/10 rounded-full blur-3xl opacity-20"></div>
      
      <div className="w-full max-w-[1100px] grid md:grid-cols-2 gap-0 overflow-hidden bg-surface-container-low rounded-xl shadow-2xl relative z-10 border border-outline-variant/20">
        {/* Branding/Visual Side */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-surface-container relative overflow-hidden">
          <div className="relative z-20">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-primary-container rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>architecture</span>
              </div>
              <span className="font-headline font-extrabold text-2xl text-primary tracking-tight">Nexus Talent</span>
            </div>
            <h1 className="font-headline font-extrabold text-4xl leading-tight text-on-background mb-6">
              Architecting the <br />
              <span className="text-secondary">Future of Career</span> <br />
              Management.
            </h1>
            <p className="text-on-surface-variant font-body text-lg leading-relaxed max-w-sm mb-10">
              A curated experience for the modern professional. Join our ecosystem of AI-augmented career strategists.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img alt="Profile" className="w-10 h-10 rounded-full border-2 border-surface-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsxi7pcNp2ewDWDpywQ9hFDfgIq2hNtRRbF0xODEkt3SfGgXME1eC1TuB8e-8XdScODNXdtijafdVadP7y7p1p_x2dKnHWtOnoKOMGukt4Qo-9VPXklhqcaXvrdtroU1fNRCMjLcQs5oPpyeCiqvc9eBBQCWBbXA3yYvVh8nEPVUMquQCeLUbXYXsFVT1gtlYk84GpDCsa0wJPc0bl0ACZ67Zkztej-Gi4S5Zy2iuJ-EmE_BangvHHdSk92oydfEDuFVvvFH0BzT51" />
                <img alt="Profile" className="w-10 h-10 rounded-full border-2 border-surface-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDP8_jPSSp0CVrK-mI0uka6U0g-AHo1cnXRx7Tpo7hb2J8biRzsJM-Z8WSP3jJdjKjwFQsxIMrEwVefp4la8R87BbK-RSLSxhSlVd_bPxmApAvyin9gS7YfiMrsD0JZ03Sq5Um9dbtBlpAU20j6kPaq04OXtKZyXssCwK7ZmNXe4mNFulUW2q2NXtAXpfuJ6JbzwlZVx6XFWMYZbl2h0z2laOJJWk83MmO1zMeYEawT0Iyq2lho4SjSypzX-cMYJfTxtoeQpMScLbwE" />
                <img alt="Profile" className="w-10 h-10 rounded-full border-2 border-surface-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbbovPFnlOctgsIcak-Gkr1M8maRNz6X_f9yDNWKXttNwKCugKMGQtR6BOcdzR4V0OiE8wN1GmWCI5fVJUseRqh0cBBsym1ik8QMnW3bLEvt8TiHZuxKj9X4CjaC6nZWe-u9lRGeZg05x39IKq941w7ukRGMa8ROOolWYLT19HSCEoy-d6Bi1VNKP0OaVT9Nqv83RZHLmt039vM599bryx7kDabXYYXgizolFtPf4KBlBiK5l37xukH-ofPrYaIV_-pPEP_gK4gr6f" />
              </div>
              <span className="text-sm font-medium text-on-surface-variant">Trusted by 2,000+ Executives</span>
            </div>
          </div>
          {/* Abstract Visual Element */}
          <div className="absolute bottom-0 right-0 w-64 h-64 opacity-5">
            <span className="material-symbols-outlined text-[16rem] text-primary">hub</span>
          </div>
        </div>
        
        {/* Login Form Side */}
        <div className="p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-surface-container-low">
          <div className="md:hidden flex items-center gap-2 mb-8">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>architecture</span>
            <span className="font-headline font-extrabold text-xl text-primary">Nexus Talent</span>
          </div>
          <div className="mb-10">
            <h2 className="font-headline font-bold text-2xl text-on-background mb-2">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-on-surface-variant font-label text-sm">
              {isLogin ? 'Please enter your credentials to access your dashboard.' : 'Start your journey with Nexus Talent today.'}
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="bg-error-container text-on-error-container font-medium text-sm p-3 rounded">{error}</div>}
            
            <div>
              <label className="block font-label text-sm font-semibold text-on-surface-variant mb-2" htmlFor="email">Work Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <input
                  className="w-full pl-11 pr-4 py-3 bg-surface-container-highest border border-outline-variant/30 rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-body text-sm"
                  id="email" required name="email" placeholder="name@company.com" type="email"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="block font-label text-sm font-semibold text-on-surface-variant" htmlFor="password">Password</label>
                {isLogin && <a className="text-primary font-semibold text-xs hover:text-secondary transition-colors" href="#">Forgot password?</a>}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  className="w-full pl-11 pr-4 py-3 bg-surface-container-highest border border-outline-variant/30 rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all font-body text-sm"
                  id="password" required name="password" placeholder="••••••••" type="password"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 py-2">
              <input className="w-4 h-4 rounded border-outline-variant bg-surface-container-highest text-primary focus:ring-primary/40" id="remember" type="checkbox" />
              <label className="text-xs font-medium text-on-surface-variant select-none" htmlFor="remember">Remember me for 30 days</label>
            </div>
            <button disabled={loading} className="w-full py-4 milled-gradient text-white font-bold rounded-lg shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 group" type="submit">
              {loading ? 'Processing...' : (isLogin ? 'Sign In to Dashboard' : 'Create Context')}
              {!loading && <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>}
            </button>
          </form>
          
          <p className="mt-10 text-center text-sm font-label text-on-surface-variant">
            {isLogin ? 'New to Nexus?' : 'Already have an account?'}
            <Link className="text-primary font-bold hover:underline decoration-2 underline-offset-4 ml-1" to={isLogin ? "/register" : "/login"}>
              {isLogin ? 'Create an account' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>
      
      {/* Footer Meta (Minimalist) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-8">
        <a className="text-[10px] font-bold text-outline uppercase tracking-widest hover:text-primary transition-colors" href="#">Privacy Policy</a>
        <a className="text-[10px] font-bold text-outline uppercase tracking-widest hover:text-primary transition-colors" href="#">Terms of Service</a>
        <a className="text-[10px] font-bold text-outline uppercase tracking-widest hover:text-primary transition-colors" href="#">Support</a>
      </div>
      
      {/* Contextual "Sign Up" Modal-like Overlay (Decorative) */}
      <div className="fixed top-8 right-8 z-50">
        <div className="glass-panel violet-glow p-4 rounded-xl flex items-center gap-4">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-white shadow-inner">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
          </div>
          <div className="pr-2">
            <p className="text-[11px] font-bold text-secondary mb-0.5">AI MATCHING ACTIVE</p>
            <p className="text-[10px] text-on-surface-variant leading-none">Find your next role 3x faster.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

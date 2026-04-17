import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Lock, Mail, PlayCircle } from 'lucide-react';
import CursorEffects from './CursorEffects';

interface AuthScreenProps {
  onLogin: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    // Simulate network delay for authentication
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050505] relative overflow-hidden text-[#EDEDED] font-sans">
      <CursorEffects />
      {/* Background Ambience - Matching App.tsx style */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md z-10 p-6">
        <div className="text-center mb-10">
           <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#18181B] to-[#0A0A0A] border border-[#27272A] shadow-2xl mb-8 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <ShieldCheck className="w-10 h-10 text-emerald-500 relative z-10" />
           </div>
           <h1 className="text-4xl font-semibold tracking-tight mb-3 text-white">
             Creíble<span className="text-emerald-500">AI</span>
           </h1>
           <p className="text-[#A1A1AA] text-sm tracking-wide">High-stakes reasoning engine for professionals.</p>
        </div>

        <div className="bg-[#0A0A0A]/60 backdrop-blur-xl border border-[#1F1F1F] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
           {/* Subtle internal gradient */}
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>

           <div className="flex items-center justify-between mb-8 bg-[#121212] rounded-xl p-1.5 border border-[#1F1F1F]">
              <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 text-xs font-medium rounded-lg transition-all duration-300 ${isLogin ? 'bg-[#27272A] text-white shadow-lg' : 'text-[#71717A] hover:text-[#A1A1AA]'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 text-xs font-medium rounded-lg transition-all duration-300 ${!isLogin ? 'bg-[#27272A] text-white shadow-lg' : 'text-[#71717A] hover:text-[#A1A1AA]'}`}
              >
                Create Account
              </button>
           </div>

           <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold tracking-wider text-[#71717A] ml-1">Email Access</label>
                 <div className="relative group">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#52525B] group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-[#121212] border border-[#27272A] text-white text-sm rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder-[#3F3F46]"
                      placeholder="name@organization.com"
                    />
                 </div>
              </div>
              
              <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold tracking-wider text-[#71717A] ml-1">Secure Key</label>
                 <div className="relative group">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#52525B] group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-[#121212] border border-[#27272A] text-white text-sm rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder-[#3F3F46]"
                      placeholder="••••••••••••"
                    />
                 </div>
              </div>

              <div className="pt-4 space-y-3">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white hover:bg-[#F4F4F5] text-black font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)]"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>{isLogin ? 'Authenticate' : 'Initialize Account'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                 <div className="flex items-center gap-3 py-1">
                   <div className="flex-1 h-px bg-[#27272A]"></div>
                   <span className="text-[10px] uppercase font-bold tracking-wider text-[#52525B]">or</span>
                   <div className="flex-1 h-px bg-[#27272A]"></div>
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                   <button 
                    type="button"
                    disabled={loading}
                    className="w-full bg-[#18181B] hover:bg-[#27272A] text-[#A1A1AA] hover:text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 group border border-[#27272A] text-[11px] font-bold uppercase tracking-wide"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 384 512" fill="currentColor">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                    </svg>
                    <span>Apple</span>
                  </button>

                  <button 
                    type="button"
                    disabled={loading}
                    className="w-full bg-[#18181B] hover:bg-[#27272A] text-[#A1A1AA] hover:text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 group border border-[#27272A] text-[11px] font-bold uppercase tracking-wide"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Google</span>
                  </button>
                 </div>

                 <button 
                  type="button"
                  onClick={onLogin}
                  disabled={loading}
                  className="w-full bg-[#18181B] hover:bg-[#27272A] text-[#A1A1AA] hover:text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 group border border-[#27272A] text-xs uppercase tracking-wide"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Launch Demo Environment</span>
                </button>
              </div>
           </form>
           
           <div className="mt-8 text-center border-t border-[#1F1F1F] pt-6">
              <p className="text-[11px] text-[#52525B]">
                Protected by <span className="text-[#71717A]">Creíble Zero-Hallucination Protocol</span>.
                <br/>By continuing, you accept the <a href="#" className="underline hover:text-[#A1A1AA] decoration-[#52525B]">Terms of Service</a>.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
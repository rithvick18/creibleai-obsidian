import React from 'react';

interface HeaderProps {
  mode: 'normal' | 'clinical' | 'legal';
  setMode: (mode: 'normal' | 'clinical' | 'legal') => void;
  onLogout: () => void;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  currentView: 'chat' | 'security' | 'enterprise' | 'settings';
  setView: (view: 'chat' | 'security' | 'enterprise' | 'settings') => void;
}

const Header: React.FC<HeaderProps> = ({ mode, setMode, onLogout, toggleSidebar, isSidebarOpen, currentView, setView }) => {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#131318]/70 backdrop-blur-xl border-b border-white/[0.03]">
      <div className="flex items-center gap-6">
        <button onClick={toggleSidebar} className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none">
          <span className="material-symbols-outlined">{isSidebarOpen ? 'menu_open' : 'menu'}</span>
        </button>
        <div onClick={() => setView('chat')} className="text-xl font-bold tracking-tighter text-[#e4e1e9] flex items-center gap-2 font-headline cursor-pointer group">
          <span className="material-symbols-outlined text-[#00E5FF] group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
          CreíbleAI
          <span className="text-[10px] font-label uppercase tracking-[0.2em] opacity-40 ml-2 border-l border-outline-variant pl-4 hidden sm:inline-block">General Intelligence</span>
        </div>
        <nav className="hidden md:flex gap-8 ml-8">
          <button onClick={() => setView('chat')} className={`${currentView === 'chat' ? 'text-[#00E5FF]' : 'text-[#e4e1e9]/60 hover:text-[#00E5FF]'} font-headline tracking-tight transition-colors duration-300 text-sm font-bold uppercase`}>Chat</button>
          <button onClick={() => setView('security')} className={`${currentView === 'security' ? 'text-[#00E5FF]' : 'text-[#e4e1e9]/60 hover:text-[#00E5FF]'} font-headline tracking-tight transition-colors duration-300 text-sm font-bold uppercase`}>Security</button>
          <button onClick={() => setView('enterprise')} className={`${currentView === 'enterprise' ? 'text-[#00E5FF]' : 'text-[#e4e1e9]/60 hover:text-[#00E5FF]'} font-headline tracking-tight transition-colors duration-300 text-sm font-bold uppercase`}>Enterprise</button>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 cursor-pointer" onClick={() => setView('chat')}>
          <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            {mode === 'normal' ? 'verified_user' : mode === 'clinical' ? 'stethoscope' : 'balance'}
          </span>
          <span className="text-[10px] font-label uppercase tracking-wider text-primary font-bold">{mode} Mode</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="material-symbols-outlined text-[#e4e1e9]/60 hover:text-[#00E5FF] transition-all active:scale-90">notifications</button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant cursor-pointer group hover:border-[#00E5FF]/40 transition-all" onClick={() => setView('settings')} title="Settings">
            <img alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBk5Hw9S4UaBvMIdv33TXH-y3so7V_KkDfyjQz7j31SFkP9iPJs2J-pjaiKTAJYfjZilmw1-8WjsVWOOg2kW31s-iBkD01M7OWF6cFb-aPW-8ccjYdhloNgarHHKCXCoDZnL_Qi-DlKaJ25hcdKGHKX0rmtQpRFbIKGDArcGbMAlYePSx6OZ4G-DWcLtN-RKxXcBDzmhJwAr_edFl8KkwsmqVoh6QRHE4RkVl00_32cLfUigDVvx_-JnV0A3SySPu_x0goiDM-ttKA"/>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-b from-[#1b1b20] to-transparent h-[1px]"></div>
    </header>
  );
};

export default Header;

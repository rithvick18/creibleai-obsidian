import React from 'react';

const SettingsScreen: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-28 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-headline font-bold mb-12 flex items-center gap-4">
           <span className="material-symbols-outlined text-3xl">settings</span>
           System Settings
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="col-span-2 space-y-10">
              <section className="bg-surface-container/10 p-8 rounded-[2rem] border border-white/5 backdrop-blur-3xl">
                 <h2 className="text-lg font-bold mb-6 text-on-surface">Gemini API Configuration</h2>
                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Primary API Key</label>
                       <div className="flex gap-4">
                          <input type="password" value="************************" disabled className="flex-1 px-5 py-3 rounded-xl bg-black/40 border border-white/5 text-primary-fixed block text-sm" />
                          <button className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest">Rotate</button>
                       </div>
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Default Reasoning Model</label>
                       <select className="w-full px-5 py-3 rounded-xl bg-black/40 border border-white/5 text-sm appearance-none outline-none focus:border-primary/40 transition-all text-on-surface-variant cursor-pointer">
                          <option>Gemini 1.5 Flash (Recommended)</option>
                          <option>Gemini 1.5 Pro (Precision Mode)</option>
                          <option>Gemini 2.0 Ultra (Experimental)</option>
                       </select>
                    </div>
                 </div>
              </section>

              <section className="bg-surface-container/10 p-8 rounded-[2rem] border border-white/5 backdrop-blur-3xl">
                 <h2 className="text-lg font-bold mb-6 text-on-surface">Clinical Reasoning Safeguards</h2>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20">
                       <div className="flex flex-col">
                          <span className="text-sm font-bold mb-1">Double Verification Protocol</span>
                          <p className="text-xs text-on-surface-variant/60">Requires AI to cross-reference multiple medical sources for all clinical answers.</p>
                       </div>
                       <div className="w-12 h-6 rounded-full bg-primary/40 relative cursor-pointer">
                          <div className="w-4 h-4 rounded-full bg-primary absolute right-1 top-1"></div>
                       </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20">
                       <div className="flex flex-col">
                          <span className="text-sm font-bold mb-1">Source Transparency</span>
                          <p className="text-xs text-on-surface-variant/60">Always show deep reasoning (CoT) and citations by default.</p>
                       </div>
                       <div className="w-12 h-6 rounded-full bg-primary/20 relative cursor-pointer">
                          <div className="w-4 h-4 rounded-full bg-white/40 absolute left-1 top-1"></div>
                       </div>
                    </div>
                 </div>
              </section>
           </div>

           <div className="col-span-1 space-y-10">
              <div className="bg-gradient-to-b from-primary/10 to-primary/0 p-8 rounded-[2.5rem] border border-primary/10 text-center flex flex-col items-center">
                 <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary mb-6">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBk5Hw9S4UaBvMIdv33TXH-y3so7V_KkDfyjQz7j31SFkP9iPJs2J-pjaiKTAJYfjZilmw1-8WjsVWOOg2kW31s-iBkD01M7OWF6cFb-aPW-8ccjYdhloNgarHHKCXCoDZnL_Qi-DlKaJ25hcdKGHKX0rmtQpRFbIKGDArcGbMAlYePSx6OZ4G-DWcLtN-RKxXcBDzmhJwAr_edFl8KkwsmqVoh6QRHE4RkVl00_32cLfUigDVvx_-JnV0A3SySPu_x0goiDM-ttKA" alt="Avatar" />
                 </div>
                 <h3 className="text-xl font-bold mb-1 leading-tight">Dr. Rithvick</h3>
                 <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest block mb-6">System Administrator</span>
                 <button className="w-full py-3 rounded-2xl bg-on-surface text-black font-bold text-xs hover:scale-105 active:scale-95 transition-all">
                    Sign Out
                 </button>
              </div>

              <div className="bg-surface-container/10 p-6 rounded-3xl border border-white/5 space-y-4">
                 <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">language</span>
                    <span className="text-sm">Language: <strong className="text-on-surface">English (US)</strong></span>
                 </div>
                 <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">palette</span>
                    <span className="text-sm">Theme: <strong className="text-on-surface">Cosmic Dark</strong></span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;

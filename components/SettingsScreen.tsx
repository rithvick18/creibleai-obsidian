import React, { useState } from 'react';
import { AppSettings } from '../types';

interface SettingsScreenProps {
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ settings, setSettings }) => {
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showMistralKey, setShowMistralKey] = useState(false);

  const updateSetting = (key: keyof AppSettings, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-10 md:pt-12 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-headline font-bold mb-12 flex items-center gap-4">
           <span className="material-symbols-outlined text-3xl">settings</span>
           System Settings
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="col-span-2 space-y-10">
              <section className="bg-surface-container/10 p-8 rounded-[2rem] border border-white/5 backdrop-blur-3xl">
                 <h2 className="text-lg font-bold mb-6 text-on-surface">AI Provider Configuration</h2>
                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Active Provider</label>
                       <div className="flex gap-4">
                          <button 
                            onClick={() => updateSetting('provider', 'gemini')}
                            className={`flex-1 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest border ${settings.provider === 'gemini' ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/40' : 'bg-black/40 text-on-surface-variant border-white/5 hover:border-white/20'}`}
                          >
                            Gemini
                          </button>
                          <button 
                            onClick={() => updateSetting('provider', 'mistral')}
                            className={`flex-1 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest border ${settings.provider === 'mistral' ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/40' : 'bg-black/40 text-on-surface-variant border-white/5 hover:border-white/20'}`}
                          >
                            Mistral
                          </button>
                       </div>
                    </div>
                    
                    {settings.provider === 'gemini' && (
                      <>
                        <div>
                           <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Gemini API Key</label>
                           <div className="flex gap-4">
                              <input 
                                type={showGeminiKey ? "text" : "password"} 
                                value={settings.geminiKey} 
                                onChange={(e) => updateSetting('geminiKey', e.target.value)}
                                placeholder="Leave empty for .env default..."
                                className="flex-1 px-5 py-3 rounded-xl bg-black/40 border border-white/5 text-primary-fixed block text-sm outline-none focus:border-primary/40 transition-all" 
                              />
                              <button 
                                onClick={() => setShowGeminiKey(!showGeminiKey)}
                                className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest"
                              >
                                {showGeminiKey ? "Hide" : "Show"}
                              </button>
                           </div>
                        </div>
                        <div>
                           <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Gemini Model</label>
                           <select 
                             className="w-full px-5 py-3 rounded-xl bg-black/40 border border-white/5 text-sm appearance-none outline-none focus:border-primary/40 transition-all text-on-surface-variant cursor-pointer"
                             value={settings.geminiModel}
                             onChange={(e) => updateSetting('geminiModel', e.target.value)}
                           >
                              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                              <option value="gemini-2.5-flash-latest">Gemini 2.5 Flash (Latest)</option>
                              <option value="gemini-3.0-flash">Gemini 3.0 Flash</option>
                              <option value="gemini-3.1-flash">Gemini 3.1 Flash</option>
                           </select>
                        </div>
                      </>
                    )}

                    {settings.provider === 'mistral' && (
                      <>
                        <div>
                           <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Mistral API Key</label>
                           <div className="flex gap-4">
                              <input 
                                type={showMistralKey ? "text" : "password"} 
                                value={settings.mistralKey} 
                                onChange={(e) => updateSetting('mistralKey', e.target.value)}
                                placeholder="Enter Mistral API Key..."
                                className="flex-1 px-5 py-3 rounded-xl bg-black/40 border border-white/5 text-primary-fixed block text-sm outline-none focus:border-primary/40 transition-all" 
                              />
                              <button 
                                onClick={() => setShowMistralKey(!showMistralKey)}
                                className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest"
                              >
                                {showMistralKey ? "Hide" : "Show"}
                              </button>
                           </div>
                        </div>
                        <div>
                           <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Mistral Model</label>
                           <select 
                             className="w-full px-5 py-3 rounded-xl bg-black/40 border border-white/5 text-sm appearance-none outline-none focus:border-primary/40 transition-all text-on-surface-variant cursor-pointer"
                             value={settings.mistralModel}
                             onChange={(e) => updateSetting('mistralModel', e.target.value)}
                           >
                              <option value="mistral-large-latest">Mistral Large</option>
                              <option value="mistral-small-latest">Mistral Small</option>
                              <option value="open-mixtral-8x22b">Mixtral 8x22b</option>
                           </select>
                        </div>
                      </>
                    )}
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
                 <h3 className="text-xl font-bold mb-1 leading-tight">Demo User</h3>
                 <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest block mb-6">Public Beta Account</span>
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


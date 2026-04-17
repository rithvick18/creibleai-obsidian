import React from 'react';

const EnterpriseScreen: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-28 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto">
        <header className="mb-20">
          <div className="h-1 w-12 bg-secondary rounded-full mb-6"></div>
          <h1 className="text-6xl font-headline font-black mb-8 leading-tight">
            Built for <span className="text-secondary italic">Scale.</span> <br />
            Designed for <span className="text-primary italic">Expertise.</span>
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl font-light">
            Empowering your clinical and legal teams with collaborative, multi-tenant AI infrastructure that grows with your organization.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 px-4">
           {[
             { title: 'Team Workspaces', num: '01', desc: 'Secure shared contexts for medical units and legal departments to collaborate on complex cases.' },
             { title: 'RBAC Controls', num: '02', desc: 'Fine-grained access controls to ensure sensitive patient and client data is only seen by authorized personnel.' },
             { title: 'Custom Model Tuning', num: '03', desc: 'Train CreíbleAI on your proprietary library of case law or clinical guidelines in an isolated silo.' }
           ].map((box, i) => (
             <div key={i} className="p-10 rounded-[2rem] bg-surface-container/10 border border-white/5 hover:bg-surface-container/20 transition-all cursor-default">
                <span className="text-3xl font-mono opacity-20 block mb-6">{box.num}</span>
                <h3 className="text-lg font-bold mb-4">{box.title}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed opacity-60 leading-[1.8]">{box.desc}</p>
             </div>
           ))}
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-20 bg-gradient-to-br from-secondary/10 to-primary/10 border border-white/5 p-12 rounded-[3.5rem] items-center relative overflow-hidden">
           <div className="flex-1 z-10">
              <h2 className="text-3xl font-headline font-bold mb-4">Request a Sandbox</h2>
              <p className="text-on-surface-variant/80 text-sm mb-8 leading-relaxed max-w-lg">
                Experience the full power of CreíbleAI within your existing infrastructure. Our enterprise sandbox provides 14-day full access to clinical, legal, and normal reasoning modes.
              </p>
              <button className="px-8 py-3 rounded-full bg-secondary text-on-secondary font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-secondary/20">
                 Contact Sales
              </button>
           </div>
           <div className="shrink-0 z-10">
              <span className="material-symbols-outlined text-[8rem] text-secondary/40" style={{ fontVariationSettings: "'wght' 200" }}>domain</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseScreen;

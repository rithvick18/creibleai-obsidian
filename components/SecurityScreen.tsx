import React from 'react';

const SecurityScreen: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-28 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 mb-20 bg-surface-container-low/30 p-12 rounded-[40px] border border-white/5 backdrop-blur-3xl">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#00E5FF]">Military Grade Security</span>
            </div>
            <h1 className="text-5xl font-headline font-black mb-6 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent leading-tight">
              Privacy First. <br />Always.
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              CreíbleAI is architected with a zero-trust model. Your clinical and legal data never leaves your context without explicit authorization.
            </p>
          </div>
          <div className="w-64 h-64 relative flex items-center justify-center shrink-0">
             <div className="absolute inset-0 bg-[#00E5FF]/10 blur-[60px] rounded-full"></div>
             <span className="material-symbols-outlined text-9xl text-[#00E5FF] opacity-80" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
             <div className="absolute inset-0 border border-[#00E5FF]/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {[
            { icon: 'lock', title: 'End-to-End Encryption', desc: 'All data is encrypted in transit and at rest using AES-256 standards with client-managed keys.' },
            { icon: 'emergency', title: 'HIPAA Compliant', desc: 'Enterprise-grade clinical data handling meeting strict healthcare privacy regulations.' },
            { icon: 'policy', title: 'SOC2 Type II', desc: 'Third-party audited security controls ensuring your data remains protected under strict oversight.' },
            { icon: 'gavel', title: 'Legal Privilege', desc: 'Architected to preserve attorney-client privilege through isolated compute environments.' }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-3xl bg-surface-container/20 border border-white/5 hover:border-[#00E5FF]/20 transition-all group">
              <span className="material-symbols-outlined text-3xl text-[#00E5FF] mb-4 group-hover:scale-110 transition-transform">{item.icon}</span>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityScreen;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, ShieldCheck, ArrowRight, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('rajeshwar.sharma@cmpdi.co.in');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent, role?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      await api.login(role, email);
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const quickRoles = [
    { label: 'Super Admin', role: 'SUPER_ADMIN', email: 'rajeshwar.sharma@cmpdi.co.in', name: 'Dr. Rajeshwar Sharma (CMPDI HQ)' },
    { label: 'Officer', role: 'OFFICER', email: 'skverma.officer@coalindia.in', name: 'Sunil K. Verma (Coal India HQ)' },
    { label: 'Analyst', role: 'ANALYST', email: 'pbannerjee.analyst@secl.gov.in', name: 'Pooja Bannerjee (SECL Bilaspur)' },
    { label: 'Auditor', role: 'AUDITOR', email: 'asengupta.auditor@cag.gov.in', name: 'Amitabh Sengupta (C&AG / MoC)' },
  ];

  return (
    <div className="min-h-screen w-screen bg-coal-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Subtle Earth/Coal Texture Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-coal-900 border border-coal-800 rounded-2xl shadow-2xl overflow-hidden p-8 space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500 to-amber-700 flex items-center justify-center text-coal-950 shadow-lg mx-auto">
            <Flame className="w-7 h-7 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-coal-50 uppercase tracking-wider">
              COAL<span className="text-gold-400">INTELLIGENCE</span> AI
            </h1>
            <p className="text-xs text-coal-400 font-mono mt-0.5">
              AI-Powered Geological, Mining & Reporting Intelligence
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-coal-800 text-[10px] font-mono text-gold-400 border border-coal-700">
            CMPDI / Coal India Limited (CIL)
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-coal-300 uppercase tracking-wider text-[10px] block mb-1">
              Authorized Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-coal-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-coal-950 border border-coal-800 rounded-lg text-coal-100 placeholder-coal-500 focus:outline-none focus:border-gold-500/60 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-coal-300 uppercase tracking-wider text-[10px] block mb-1">
              Statutory Security Key / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-coal-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-coal-950 border border-coal-800 rounded-lg text-coal-100 placeholder-coal-500 focus:outline-none focus:border-gold-500/60 font-mono"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gold-600 hover:bg-gold-500 disabled:opacity-50 text-coal-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            {loading ? 'Authenticating...' : 'Sign In to Command Center'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* 1-Click Role Switcher Demo Quick-Logins (Section 3) */}
        <div className="pt-4 border-t border-coal-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-coal-400 tracking-wider block text-center">
            One-Click Quick Evaluation Roles:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {quickRoles.map((qr) => (
              <button
                key={qr.role}
                onClick={(e) => handleLogin(e as any, qr.role)}
                className="p-2 rounded-lg bg-coal-950 hover:bg-coal-800 border border-coal-800 hover:border-coal-700 text-left transition-all group"
              >
                <p className="text-[11px] font-bold text-coal-200 group-hover:text-gold-400 transition-colors">
                  {qr.label}
                </p>
                <p className="text-[9px] text-coal-400 truncate">{qr.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Integrity Seal */}
        <div className="text-center pt-2 text-[10px] text-coal-500 font-mono flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Statutory Evidence Protocol Enforced</span>
        </div>
      </div>
    </div>
  );
};

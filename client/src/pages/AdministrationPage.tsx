import React, { useState, useEffect } from 'react';
import { Users, Shield, Cpu, Activity, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

export const AdministrationPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(d => setUsers(d.users || []))
      .catch(console.error);

    api.getSystemHealth().then(setHealth).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="border-b border-coal-800 pb-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-widest">
            Security & System Diagnostics
          </span>
          <span className="text-coal-400">•</span>
          <span className="text-xs text-coal-400 font-mono">Role-Based Access Control (RBAC)</span>
        </div>
        <h1 className="text-2xl font-extrabold text-coal-50 mt-1">
          System Administration & RBAC Management
        </h1>
        <p className="text-xs text-coal-400 mt-1">
          Manage authorized personnel roles, view background queue diagnostics, and monitor system health.
        </p>
      </div>

      {/* Queue Diagnostics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-coal-900 border border-coal-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-coal-400 font-semibold uppercase">
            <span>OCR Worker Queue</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-coal-100">0 Pending</p>
          <span className="text-[10px] text-emerald-400 font-mono">All Batches Processed</span>
        </div>

        <div className="p-4 rounded-xl bg-coal-900 border border-coal-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-coal-400 font-semibold uppercase">
            <span>Validation Conflicts</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-red-400">
            {health?.queues?.validationConflicts ?? 3} Active
          </p>
          <span className="text-[10px] text-coal-400 font-mono">Awaiting Analyst Review</span>
        </div>

        <div className="p-4 rounded-xl bg-coal-900 border border-coal-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-coal-400 font-semibold uppercase">
            <span>Pending Reports</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-amber-400">
            {health?.queues?.pendingReports ?? 1} Awaiting
          </p>
          <span className="text-[10px] text-coal-400 font-mono">Officer Sign-Off Queue</span>
        </div>

        <div className="p-4 rounded-xl bg-coal-900 border border-coal-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-coal-400 font-semibold uppercase">
            <span>AI Provider Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-sm font-mono font-bold text-emerald-400 mt-1">
            {health?.aiEngine?.mode?.toUpperCase() || 'MOCK'} ENGINE ACTIVE
          </p>
          <span className="text-[10px] text-coal-400 font-mono">Low Latency Structured Query</span>
        </div>
      </div>

      {/* Users and Roles Table (Section 31) */}
      <div className="bg-coal-900 border border-coal-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-coal-850 border-b border-coal-800 flex items-center justify-between text-xs font-bold text-coal-300">
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gold-400" />
            Authorized Personnel Directory ({users.length})
          </span>
          <span className="font-mono text-coal-400 text-[11px]">Enforced RBAC Hierarchy</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-coal-800 bg-coal-950 text-[10px] uppercase font-bold text-coal-400 tracking-wider">
                <th className="py-3 px-4">Name & Email</th>
                <th className="py-3 px-4">Designated Security Role</th>
                <th className="py-3 px-4">Department / Division</th>
                <th className="py-3 px-4">Subsidiary Jurisdiction</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coal-800 text-coal-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-coal-850/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-coal-100">{u.name}</p>
                    <p className="text-[11px] text-coal-400 font-mono">{u.email}</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.role === 'SUPER_ADMIN' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                      u.role === 'OFFICER' ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40' :
                      u.role === 'ANALYST' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                      'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-coal-300">
                    {u.department}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-coal-300">
                    {u.subsidiary}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

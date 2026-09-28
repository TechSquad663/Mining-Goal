import React, { useState, useEffect } from 'react';
import { Search, Bell, Shield, User as UserIcon, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';
import { User, NotificationItem } from '../../types';

interface TopbarProps {
  onOpenSearch: () => void;
  currentUser: User | null;
  onUserChange: (user: User) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenSearch, currentUser, onUserChange }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [usersList, setUsersList] = useState<User[]>([]);

  useEffect(() => {
    api.getNotifications().then(setNotifications).catch(console.error);
    api.getUsers()
      .then(users => {
        if (users) setUsersList(users);
      })
      .catch(console.error);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRoleSwitch = async (role: string) => {
    try {
      const res = await api.login(role);
      onUserChange(res.user);
      setShowRoleMenu(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <header className="h-16 bg-coal-900 border-b border-coal-800 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Global Search Trigger & Demo Data Alert */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-coal-950 border border-coal-800 text-coal-400 hover:text-coal-200 hover:border-coal-700 transition-colors text-xs w-64 md:w-80 justify-between group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-coal-400 group-hover:text-gold-400 transition-colors" />
            <span>Search records, mines, reports...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-coal-850 border border-coal-700 font-mono text-[10px] text-coal-400">
            Ctrl+K
          </kbd>
        </button>

        {/* Mandatory Demo Data Banner tag (Section 34) */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/60 border border-amber-800/80 text-amber-400 text-[11px] font-semibold tracking-wider font-mono">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>DEMO DATA — CMPDI / CIL REPOSITORY</span>
        </div>
      </div>

      {/* Right: Operational Health Badges, Notifications, User Menu */}
      <div className="flex items-center gap-4">
        {/* Command Center Status Badges */}
        <div className="hidden xl:flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-900/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Operational
          </div>
          <div className="flex items-center gap-1.5 text-gold-400 px-2 py-0.5 rounded bg-gold-950/40 border border-gold-900/60">
            <span className="w-2 h-2 rounded-full bg-gold-500" />
            AI Engine: Active (Mock Mode)
          </div>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-lg bg-coal-800/80 hover:bg-coal-750 text-coal-300 hover:text-coal-100 border border-coal-700/60 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-coal-900 border border-coal-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
              <div className="px-4 py-3 bg-coal-850 border-b border-coal-700 flex items-center justify-between">
                <span className="text-xs font-bold text-coal-100">Operational Alerts & Updates</span>
                <span className="text-[10px] font-mono text-coal-400">{unreadCount} unread</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-coal-800">
                {notifications.map(n => (
                  <div 
                    key={n.id} 
                    onClick={() => handleMarkAsRead(n.id)}
                    className={`p-3 hover:bg-coal-800/60 cursor-pointer transition-colors ${!n.read ? 'bg-coal-850/40' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <p className={`text-xs font-semibold ${!n.read ? 'text-gold-400' : 'text-coal-300'}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-coal-400 font-mono">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-coal-400 mt-1 leading-snug">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-3 rounded-lg bg-coal-800/80 hover:bg-coal-750 border border-coal-700/60 transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-md bg-gold-600/20 border border-gold-500/40 flex items-center justify-center text-gold-400 font-bold text-xs">
              {currentUser?.name.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-coal-100 leading-none truncate max-w-[120px]">
                {currentUser?.name || 'Authorized User'}
              </p>
              <p className="text-[10px] font-mono text-gold-400 mt-0.5 leading-none">
                {currentUser?.role || 'ANALYST'}
              </p>
            </div>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-coal-900 border border-coal-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in p-2">
              <div className="px-3 py-2 border-b border-coal-800 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-coal-400">Switch Security Role</span>
                <p className="text-xs text-coal-300 mt-0.5">{currentUser?.subsidiary}</p>
              </div>
              <div className="space-y-1">
                {usersList.map(u => (
                  <button
                    key={u.id}
                    onClick={() => handleRoleSwitch(u.role)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs text-left transition-colors ${
                      currentUser?.role === u.role ? 'bg-gold-500/10 text-gold-400 font-bold' : 'text-coal-300 hover:bg-coal-800'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-coal-200">{u.name}</p>
                      <span className="text-[10px] font-mono text-coal-400">{u.role}</span>
                    </div>
                    {currentUser?.role === u.role && (
                      <CheckCircle2 className="w-4 h-4 text-gold-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

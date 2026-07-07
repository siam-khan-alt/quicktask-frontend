'use client';

import { useAuth } from '@/context/AuthContext';
import { LogOut, User, Crown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    toast.success('👋 Logged out successfully!');
    logout();
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 w-full border-b border-border-muted bg-background/80 px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight text-white">
            Quick<span className="text-primary">Task</span>
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            user?.isPremium ? 'bg-premium/10 border border-premium/20 text-premium' : 'bg-zinc-800 text-zinc-400'
          }`}>
            {user?.isPremium && <Crown className="h-3 w-3" />}
            {user?.isPremium ? 'Premium' : 'Free Plan'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface border border-border-muted">
              <User className="h-4 w-4 text-zinc-400" />
            </div>
            <span className="hidden sm:inline font-medium">{user?.name}</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl bg-surface border border-border-muted px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-surface-hover hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

      </div>
    </nav>
  );
}
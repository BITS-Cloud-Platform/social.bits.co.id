import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, User, LogOut, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/auth';
import { api } from '../lib/api';
import { cn } from '../lib/utils';
import { Tooltip } from './ui';

const navItems = [
  { to: '/dashboard', icon: LayoutGrid, label: 'Projects' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try { await api.auth.logout(); } catch { /* ignore */ }
    clearAuth();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-zinc-950 border-r border-zinc-800">
      {/* Logo */}
      <div className="flex h-14 items-center px-4 border-b border-zinc-800">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-zinc-100">
          <Shield className="h-5 w-5 text-zinc-400" />
          <span className="text-sm hidden lg:block">SocialManager</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <Tooltip key={to} content={label}>
            <Link
              to={to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                location.pathname.startsWith(to)
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden lg:block">{label}</span>
            </Link>
          </Tooltip>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-zinc-800 p-2">
        <div className="flex items-center gap-2 px-3 py-2 mb-1">
          <div className="h-6 w-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-100 shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <span className="hidden lg:block text-xs text-zinc-400 truncate max-w-[100px]">{user?.name}</span>
        </div>
        <Tooltip content="Logout">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800/50 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="hidden lg:block">Logout</span>
          </button>
        </Tooltip>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-56 h-full"><SidebarContent /></div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-14 xl:w-48 h-screen flex-col fixed left-0 top-0">
        <SidebarContent />
      </div>
    </>
  );
}

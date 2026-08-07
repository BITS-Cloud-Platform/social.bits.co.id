import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/auth';
import { api } from '../lib/api';
import { cn } from '../lib/utils';
import { Tooltip } from './ui';

const navItems = [
  { to: '/dashboard', icon: LayoutGrid, label: 'Projects' },
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
      <div className="flex h-14 items-center justify-center border-b border-zinc-800">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-zinc-100">
          <span className="text-base">Social Manager</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ to, icon: Icon, label }) => (
          <Tooltip key={to} content={label}>
            <Link
              to={to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                location.pathname.startsWith(to)
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              )}
            >
              <Icon className="h-5 w-5" />
            </Link>
          </Tooltip>
        ))}
      </nav>

      {/* User Profile + Logout */}
      <div className="border-t border-zinc-800 p-3 space-y-2">
        {/* Profile Link */}
        <Tooltip content="Profile Settings">
          <Link
            to="/profile"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-100 transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-violet-600 flex items-center justify-center text-sm font-semibold text-white shrink-0">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-zinc-200 truncate">{user?.name}</div>
              <div className="text-xs text-zinc-500">View profile</div>
            </div>
          </Link>
        </Tooltip>
        
        {/* Logout */}
        <Tooltip content="Sign out">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800/50 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-xs">Sign out</span>
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
      <div className="hidden lg:flex lg:w-64 h-screen flex-col fixed left-0 top-0">
        <SidebarContent />
      </div>
    </>
  );
}

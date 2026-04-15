import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutGrid, Zap, Package, ShoppingCart, Search, Bell, Settings, FileText, HelpCircle, Plus, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'OVERVIEW', path: '/', icon: LayoutGrid },
    { name: 'GENERATE', path: '/generate', icon: Zap },
    { name: 'PRODUCTS', path: '/products', icon: Package },
    { name: 'ORDERS', path: '/orders', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-black">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#f4f4f5] border-r-2 border-black flex flex-col shrink-0 z-10 hidden md:flex h-screen sticky top-0">
        <div className="p-6 border-b-2 border-black bg-white">
          <h1 className="text-2xl font-bold tracking-tighter uppercase">PAGEFORGE</h1>
        </div>
        
        <div className="p-4 flex-1">
          <div className="bg-white brutalist-border p-3 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-[var(--color-neon)] animate-pulse"></div>
              <span className="font-bold text-sm">TERMINAL_V1</span>
            </div>
            <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider line-clamp-1">User: {user?.name || 'GUEST'}</div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 font-medium transition-colors brutalist-border",
                    isActive ? "bg-[var(--color-neon)] brutalist-shadow-sm translate-x-[-2px] translate-y-[-2px]" : "bg-white hover:bg-gray-100"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 space-y-4">
          <button 
            onClick={logout}
            className="w-full bg-white border-2 border-black brutalist-shadow-sm py-3 font-bold flex items-center justify-center gap-2 hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none transition-all"
          >
            <LogOut className="w-5 h-5" />
            LOGOUT_SESSION
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b-2 border-black bg-white flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-8 md:hidden">
            <h1 className="text-xl font-bold tracking-tighter uppercase">PAGEFORGE</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "font-bold text-sm tracking-wider uppercase transition-colors relative",
                    isActive ? "text-[var(--color-neon-dark)]" : "text-gray-500 hover:text-black"
                  )}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-[var(--color-neon)]"></span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="CMD+K TO SEARCH" 
                className="pl-9 pr-4 py-2 brutalist-border bg-[#f4f4f5] text-sm font-mono focus:outline-none focus:bg-white w-64"
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-none transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 ml-2 pl-4 border-l-2 border-black">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black uppercase text-gray-400">Identity_Live</p>
                <p className="text-xs font-bold">{user?.name}</p>
              </div>
              <div className="w-10 h-10 brutalist-border overflow-hidden bg-gray-200">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="User" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-50">
          {children}
        </main>
        
        {/* Footer Status Bar */}
        <footer className="h-10 border-t-2 border-black bg-white flex items-center justify-between px-6 text-[10px] font-mono uppercase text-gray-500 shrink-0">
          <div>© 2024 PAGEFORGE // SYSTEM_UPTIME: 99.98% // SESSION: {user?.id} // STATUS: AUTHENTICATED</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[var(--color-neon)]"></div>
              ALL SYSTEMS OPERATIONAL
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

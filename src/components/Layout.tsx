import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutGrid, Zap, Package, ShoppingCart, Search, Bell, Settings, FileText, HelpCircle, Plus, LogOut, Target, ChevronLeft, ChevronRight } from 'lucide-react';
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
    { name: 'IDENTIFIANTS', path: '/identifiant', icon: Target },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-black">
      {/* Sidebar */}
      <aside className="w-20 bg-[#f4f4f5] border-r-2 border-black flex flex-col shrink-0 z-10 hidden md:flex h-screen sticky top-0 transition-all duration-300 group/sidebar hover:w-64">
        <div className="p-4 border-b-2 border-black bg-white flex flex-col items-center justify-center h-20 overflow-hidden">
          <h1 className="text-xl font-black tracking-tighter uppercase whitespace-nowrap transition-all duration-300 group-hover/sidebar:text-2xl group-hover/sidebar:block hidden">PAGEFORGE</h1>
          <h1 className="text-2xl font-black tracking-tighter uppercase transition-all duration-300 group-hover/sidebar:hidden block">P</h1>
        </div>
        
        <div className="p-4 flex-1">

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 font-medium transition-colors brutalist-border overflow-hidden",
                    "justify-center group-hover/sidebar:justify-start p-3 group-hover/sidebar:px-4 group-hover/sidebar:py-3",
                    isActive ? "bg-[var(--color-neon)] brutalist-shadow-sm translate-x-[-2px] translate-y-[-2px]" : "bg-white hover:bg-gray-100"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 font-bold uppercase tracking-tight">
                    {item.name}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 space-y-4">
          <button 
            onClick={logout}
            className="w-full bg-white border-2 border-black brutalist-shadow-sm font-bold flex items-center justify-center gap-2 hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none transition-all p-3 group-hover/sidebar:py-3"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 hidden group-hover/sidebar:block">LOGOUT</span>
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
        <main className={cn(
          "flex-1 bg-gray-50",
          location.pathname.startsWith('/generate') ? "overflow-hidden" : "p-4 md:p-8 overflow-y-auto"
        )}>
          {children}
        </main>
        
      </div>
    </div>
  );
}

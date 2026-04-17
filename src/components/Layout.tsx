import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutGrid, Zap, Package, ShoppingCart, Settings, FileText, HelpCircle, Plus, LogOut, Target, ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className="h-screen flex flex-col font-sans text-black overflow-hidden relative">
      {/* Header */}
      <header className="h-20 border-b-2 border-black bg-white flex items-center justify-between px-6 sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black tracking-tighter uppercase">PAGEFORGE</h1>
          <div className="h-8 w-0.5 bg-black mx-4 hidden md:block"></div>
        </div>
        
        <div className="flex items-center gap-4">
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

      <div className="flex-1 flex relative overflow-hidden">
        {/* Sidebar Space Placeholder */}
        <div className="w-20 shrink-0 border-r-2 border-black hidden md:block bg-[#f4f4f5]"></div>
        
        {/* Sidebar (Absolute Overlap) */}
        <aside className="absolute left-0 top-0 bottom-0 w-20 bg-[#f4f4f5] border-r-2 border-black flex flex-col z-30 hidden md:flex transition-all duration-300 group/sidebar hover:w-64 overflow-y-auto brutalist-shadow-lg">
          <div className="p-2 flex-1">
            <nav className="space-y-3">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex items-center font-bold transition-all duration-300 brutalist-border relative group/link",
                      "justify-center group-hover/sidebar:justify-start p-3 group-hover/sidebar:px-6 group-hover/sidebar:py-4 group-hover/sidebar:gap-4",
                      isActive ? "bg-[var(--color-neon)] brutalist-shadow-sm translate-x-[-2px] translate-y-[-2px]" : "bg-white hover:bg-gray-100"
                    )}
                  >
                    <item.icon className="w-6 h-6 shrink-0" />
                    <span className="whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 uppercase tracking-tighter text-sm hidden group-hover/sidebar:inline-block">
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
              className="w-full bg-white border-2 border-black brutalist-shadow-sm font-bold flex items-center justify-center group-hover/sidebar:justify-start hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none transition-all p-3 group-hover/sidebar:px-6 group-hover/sidebar:py-4 group-hover/sidebar:gap-4"
            >
              <LogOut className="w-6 h-6 shrink-0" />
              <span className="whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 hidden group-hover/sidebar:block uppercase tracking-tighter text-sm">LOGOUT</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={cn(
          "flex-1 bg-gray-50 overflow-y-auto relative min-h-0",
          location.pathname.startsWith('/generate') ? "" : "p-4 md:p-8"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}

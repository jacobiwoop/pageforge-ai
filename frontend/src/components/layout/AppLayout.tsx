import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  LayoutTemplate,
  ShoppingCart,
  BarChart,
  Settings,
  Sparkles,
  Search,
  Bell,
  Menu
} from "lucide-react";

export default function AppLayout() {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/app" },
    { icon: FolderOpen, label: "Projets", path: "/app/editor/new" },
    { icon: LayoutTemplate, label: "Templates", path: "/app/templates" },
    { icon: ShoppingCart, label: "Commandes", path: "/app/orders" },
    { icon: BarChart, label: "Analytics", path: "/app/analytics" },
    { icon: Settings, label: "Paramètres", path: "/app/settings" },
  ];

  const pageTitle = navItems.find((item) => {
    if (item.path === '/app' && location.pathname === '/app') return true;
    if (item.path !== '/app' && location.pathname.startsWith(item.path)) return true;
    return false;
  })?.label || "PageForge";

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A] text-white">
      {/* Mobile Header inline */}
      <div className="md:hidden fixed top-0 inset-x-0 h-16 bg-[#111] border-b border-white/5 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FF3A8C]" />
          <span className="font-bold">PageForge</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Sidebar Desktop */}
      <div 
        className={`hidden md:flex flex-col border-r border-white/5 bg-[#0A0A0A] transition-all duration-300 z-20 overflow-hidden absolute inset-y-0 left-0 hover:w-[240px] ${isSidebarHovered ? 'w-[240px]' : 'w-[72px]'}`}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
        <div className="h-16 flex items-center px-5 border-b border-white/5 shrink-0 whitespace-nowrap overflow-hidden">
          <Sparkles className="w-6 h-6 text-[#FF3A8C] shrink-0" />
          <span className={`font-bold ml-3 transition-opacity duration-300 ${isSidebarHovered ? 'opacity-100' : 'opacity-0'}`}>PageForge</span>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
          {navItems.map((item) => {
            const isActive = item.path === '/app' 
              ? location.pathname === '/app' 
              : location.pathname.startsWith(item.path);

            return (
              <NavLink 
                key={item.label}
                to={item.path}
                className={`flex items-center h-12 rounded-xl transition-all overflow-hidden ${isActive ? 'bg-white/10 text-white' : 'text-[#888] hover:text-white hover:bg-white/5'}`}
              >
                <div className="w-[48px] shrink-0 flex items-center justify-center">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className={`font-medium whitespace-nowrap transition-opacity duration-300 ${isSidebarHovered ? 'opacity-100' : 'opacity-0'}`}>
                  {item.label}
                </span>
              </NavLink>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5 shrink-0 overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary shrink-0 flex items-center justify-center font-bold text-sm shadow-lg">JD</div>
            <div className={`transition-opacity duration-300 whitespace-nowrap ${isSidebarHovered ? 'opacity-100' : 'opacity-0'}`}>
              <div className="font-medium text-sm">Jane Doe</div>
              <div className="text-xs text-[#FF3A8C] font-semibold">Pro Plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden">
          <div className="w-64 h-full bg-[#111] p-4 pt-20 flex flex-col gap-2">
            {navItems.map((item) => (
               <NavLink 
               key={item.label}
               to={item.path}
               onClick={() => setIsMobileMenuOpen(false)}
               className="flex items-center h-12 rounded-xl px-4 gap-3 text-[#888] hover:text-white hover:bg-white/5"
             >
               <item.icon className="w-5 h-5" />
               <span className="font-medium">{item.label}</span>
             </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 bg-[#0A0A0A] ${isSidebarHovered ? 'md:ml-[240px]' : 'md:ml-[72px]'} pt-16 md:pt-0`}>
        {/* TopBar */}
        {!location.pathname.includes('/app/editor') && (
          <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-[#0A0A0A]/80 backdrop-blur z-10 hidden md:flex">
            <h1 className="font-bold text-lg">{pageTitle}</h1>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Search className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className="w-64 bg-[#111] border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF3A8C] transition-colors"
                 />
              </div>
              <button className="relative text-[#888] hover:text-white">
                <Bell className="w-5 h-5" />
                <div className="absolute 1 top-0 right-0 w-2 h-2 rounded-full bg-[#FF3A8C] border-2 border-[#0A0A0A]" />
              </button>
            </div>
          </header>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


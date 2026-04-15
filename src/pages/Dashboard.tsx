import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Eye, Target, Activity, Edit2, TrendingUp, AlertTriangle, ShoppingCart, Zap, Upload, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const API_BASE = "http://localhost:8000";

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/stats`).then(res => res.json()),
      fetch(`${API_BASE}/api/products`).then(res => res.json())
    ]).then(([statsData, productsData]) => {
      setStats(statsData);
      setProducts(productsData.slice(0, 3)); 
    }).catch(e => console.error(e));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="TOTAL REVENUE" 
          value={stats ? `$${stats.total_revenue.toLocaleString()}` : <Loader2 className="w-6 h-6 animate-spin" />} 
          change="SYNCED" 
          changeLabel="DATABASE LIVE" 
          icon={<div className="w-12 h-8 border-2 border-gray-200 rounded flex items-center justify-center"><div className="w-4 h-4 rounded-full border-2 border-gray-200"></div></div>}
        />
        <StatCard 
          title="TOTAL ORDERS" 
          value={stats ? stats.total_orders.toString() : <Loader2 className="w-6 h-6 animate-spin" />} 
          change="REAL" 
          changeLabel="VERIFIED" 
          icon={<ShoppingCart className="w-10 h-10 text-gray-200" />}
        />
        <StatCard 
          title="PAGES/SESSIONS" 
          value={stats ? stats.total_generations.toString() : <Loader2 className="w-6 h-6 animate-spin" />} 
          change="SUCCESS" 
          changeLabel="SQLITE STORE" 
          icon={<Target className="w-10 h-10 text-gray-200" />}
        />
        <div className="bg-black text-white brutalist-border p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xs font-bold text-[var(--color-neon)] tracking-wider mb-2">AI EFFICIENCY</h3>
            <div className="text-5xl font-bold text-[var(--color-neon)] mb-4">{stats ? `${stats.ai_efficiency}%` : '--'}</div>
            <div className="text-[10px] font-mono text-[var(--color-neon-dark)]">CORE LOAD: STABLE</div>
          </div>
          <div className="absolute right-0 bottom-0 w-32 h-32 opacity-20">
            <Activity className="w-full h-full text-[var(--color-neon)]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Products */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-tighter">RECENT PRODUCTS</h2>
              <p className="text-xs font-mono text-gray-500 uppercase">TRACKING_METRICS_V2.0</p>
            </div>
            <button className="px-4 py-2 bg-white brutalist-border text-sm font-bold uppercase hover:bg-gray-100 transition-colors">
              EXPORT REPORT
            </button>
          </div>

          <div className="space-y-4">
            {products.length === 0 ? (
              <div className="p-10 border-2 border-dashed border-gray-300 text-center text-gray-500 font-mono text-sm">
                NO PRODUCTS SYNCHRONIZED.
              </div>
            ) : (
              products.map((p, i) => (
                <ProductRow 
                  key={i}
                  name={p.name} 
                  status={p.status} 
                  sales={Math.floor(Math.random() * 100).toString()}
                  revenue={`$${Math.floor(Math.random() * 1000)}`} 
                  roas="N/A" 
                  image={`https://api.dicebear.com/7.x/shapes/svg?seed=${p.id}&backgroundColor=00fc40`}
                />
              ))
            )}
          </div>
        </div>

        {/* Activity Flux */}
        <div className="bg-white brutalist-border p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-8">
            <Activity className="w-5 h-5" />
            <h2 className="text-xl font-bold uppercase tracking-tighter">ACTIVITY FLUX</h2>
          </div>

          <div className="relative flex-1">
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-black"></div>
            
            <div className="space-y-8 relative">
              <TimelineItem 
                time="14:22:01" 
                title="NEW SALE RECORDED" 
                desc="Product ID: #849202 processed successfully." 
                highlight="+$420.00"
                icon={<ShoppingCart className="w-4 h-4 text-white" />}
                iconBg="bg-[var(--color-neon-dark)]"
              />
              <TimelineItem 
                time="13:45:12" 
                title="AI OPTIMIZATION TRIGGERED" 
                desc="Neural-Sync Watch X1 bidding adjusted by 12%." 
                icon={<Zap className="w-4 h-4 text-black" />}
                iconBg="bg-white"
              />
              <TimelineItem 
                time="12:10:05" 
                title="STOCK ALERT" 
                desc="Velocity Runner Red reaching critical low levels (12 units)." 
                icon={<AlertTriangle className="w-4 h-4 text-white" />}
                iconBg="bg-[var(--color-alert)]"
              />
              <TimelineItem 
                time="11:30:58" 
                title="CAMPAIGN SCALED" 
                desc="Budget increase for 'Summer Reach' approved by AI." 
                icon={<TrendingUp className="w-4 h-4 text-white" />}
                iconBg="bg-[var(--color-neon-dark)]"
              />
            </div>
          </div>

          <button className="w-full mt-8 bg-black text-white py-3 font-bold uppercase text-sm hover:bg-gray-800 transition-colors">
            VIEW FULL TERMINAL LOGS
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, changeLabel, icon }: { title: string, value: string, change: string, changeLabel: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white brutalist-border p-6 flex flex-col justify-between relative">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase">{title}</h3>
        <div className="text-gray-300">{icon}</div>
      </div>
      <div>
        <div className="text-4xl font-bold tracking-tighter mb-4">{value}</div>
        <div className="flex items-center gap-2">
          <span className="bg-[var(--color-neon)] px-2 py-0.5 text-xs font-bold brutalist-border">{change}</span>
          <span className="text-[10px] font-mono text-gray-500 uppercase">{changeLabel}</span>
        </div>
      </div>
    </div>
  );
}

function ProductRow({ name, status, sales, revenue, roas, image, isDraft = false }: { name: string, status: string, sales: string, revenue: string, roas: string, image: string, isDraft?: boolean }) {
  return (
    <div className="bg-white brutalist-border p-4 flex items-center gap-6">
      <div className="w-20 h-20 brutalist-border shrink-0 bg-gray-100">
        <img src={image} alt={name} className={cn("w-full h-full object-cover", isDraft && "grayscale")} />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h4 className="font-bold text-lg uppercase tracking-tight">{name}</h4>
          <span className={cn(
            "px-2 py-0.5 text-[10px] font-bold uppercase brutalist-border",
            status === 'OPTIMIZED' ? "bg-[var(--color-neon)]" :
            status === 'SCALING' ? "bg-[var(--color-neon)]" :
            "bg-gray-200 text-gray-600"
          )}>
            {status}
          </span>
        </div>
        
        <div className="flex items-center gap-6 text-xs font-mono">
          <div><span className="text-gray-500">SALES:</span> <span className="font-bold">{sales}</span></div>
          <div><span className="text-gray-500">REVENUE:</span> <span className="font-bold">{revenue}</span></div>
          <div><span className="text-gray-500">ROAS:</span> <span className="font-bold">{roas}</span></div>
        </div>
      </div>

      <div className="flex flex-col gap-2 shrink-0">
        <button className="w-10 h-10 brutalist-border flex items-center justify-center hover:bg-[var(--color-neon)] transition-colors">
          <Edit2 className="w-4 h-4" />
        </button>
        <button className="w-10 h-10 brutalist-border flex items-center justify-center hover:bg-[var(--color-neon)] transition-colors">
          {isDraft ? <Upload className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function TimelineItem({ time, title, desc, highlight, icon, iconBg }: { time: string, title: string, desc: string, highlight?: string, icon: React.ReactNode, iconBg: string }) {
  return (
    <div className="flex gap-4 relative">
      <div className={cn("w-8 h-8 rounded-none brutalist-border flex items-center justify-center shrink-0 z-10", iconBg)}>
        {icon}
      </div>
      <div className="pb-2">
        <div className="text-[10px] font-mono text-gray-500 mb-1">{time}</div>
        <div className="font-bold text-sm uppercase mb-1">{title}</div>
        <p className="text-xs text-gray-600 mb-1">{desc}</p>
        {highlight && <div className="text-xs font-bold text-[var(--color-neon-dark)]">{highlight}</div>}
      </div>
    </div>
  );
}

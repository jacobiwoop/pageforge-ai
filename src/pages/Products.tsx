import React, { useState, useEffect } from 'react';
import { Download, Filter, ExternalLink, Copy, Settings, Terminal, Loader2, Edit3 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  url: string;
  date: string;
  time: string;
  status: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE = import.meta.env.DEV ? "http://localhost:8000" : "";

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/products`).then(res => res.json()),
      fetch(`${API_BASE}/api/stats`).then(res => res.json())
    ]).then(([productsData, statsData]) => {
      setProducts(productsData);
      setStats(statsData);
    }).catch(e => {
      console.error("Failed to fetch products/stats", e);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-2">PRODUCTS_VAULT</h1>
          <div className="inline-block bg-black text-[var(--color-neon)] px-3 py-1 text-xs font-mono uppercase">
            {isLoading ? "DATABASE_QUERY_IN_PROGRESS..." : `DB_QUERY_SUCCESS // ${products.length} ENTRIES FOUND`}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-3 bg-white brutalist-border flex items-center gap-2 text-sm font-bold uppercase hover:bg-gray-100 transition-colors">
            <span className="text-gray-500 text-xs">FILTER_STATUS</span>
            ALL_STATUS
          </button>
        </div>
      </div>

      <div className="bg-white brutalist-border overflow-x-auto brutalist-shadow">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-black text-white text-xs font-bold uppercase tracking-wider">
              <th className="p-4 border-r border-gray-800">PREVIEW</th>
              <th className="p-4 border-r border-gray-800">IDENTITY_META</th>
              <th className="p-4 border-r border-gray-800">STATUS</th>
              <th className="p-4 border-r border-gray-800">GENERATED_ON</th>
              <th className="p-4">PROCESS</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-20 text-center">
                  <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" />
                  <p className="font-mono text-xs uppercase text-gray-400">Retrieving_Data_Streams...</p>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-20 text-center">
                  <p className="font-mono text-xs uppercase text-gray-400">No_Products_Detected_In_Vault</p>
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <ProductTableRow 
                  key={p.id}
                  image={`https://api.dicebear.com/7.x/shapes/svg?seed=${p.id}&backgroundColor=00fc40`}
                  name={p.name}
                  id={p.id}
                  status={p.status}
                  date={p.date}
                  time={p.time}
                  url={`${API_BASE}${p.url}`}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white brutalist-border p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xs font-bold tracking-wider uppercase">ACTIVE_PAGES</h3>
            <Copy className="w-5 h-5 text-black bg-[var(--color-neon)] p-0.5" />
          </div>
          <div>
            <div className="text-6xl font-bold tracking-tighter mb-4">{products.length}</div>
            <div className="w-full h-2 bg-gray-200 brutalist-border mb-2">
              <div className="h-full bg-[var(--color-neon)] w-[100%] border-r-2 border-black"></div>
            </div>
            <div className="text-[10px] font-mono text-gray-500 uppercase">SYNCHRONIZED</div>
          </div>
        </div>

        <div className="bg-white brutalist-border p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xs font-bold tracking-wider uppercase">PAGES / SESSIONS</h3>
            <Settings className="w-5 h-5 text-white bg-black p-0.5" />
          </div>
          <div>
            <div className="text-6xl font-bold tracking-tighter mb-4">{stats ? stats.total_generations : <Loader2 className="w-8 h-8 animate-spin" />}</div>
            <div className="flex gap-1 mb-2">
              {[1,2,3,4].map(i => <div key={i} className="w-4 h-4 bg-[var(--color-neon)] brutalist-border"></div>)}
              <div className="w-4 h-4 bg-gray-200 brutalist-border"></div>
            </div>
            <div className="text-[10px] font-mono text-gray-500 uppercase">SQLITE STORE LOGS</div>
          </div>
        </div>

        <div className="bg-black text-white brutalist-border p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-4 h-4 text-[var(--color-neon)]" />
              <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--color-neon)]">SYSTEM_INSIGHT</h3>
            </div>
            <p className="text-xs font-mono text-gray-400 mb-6 leading-relaxed">
              Neural patterns indicate a <span className="text-[var(--color-neon)] font-bold">14% increase</span> in generation efficiency for brutalist components. Recommended action: Synchronize metadata for all 'Draft' status items to optimize local cache.
            </p>
            <button className="px-4 py-2 border-2 border-[var(--color-neon)] text-[var(--color-neon)] text-xs font-bold uppercase hover:bg-[var(--color-neon)] hover:text-black transition-colors">
              RUN_OPTIMIZATION
            </button>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
            <Terminal className="w-48 h-48 text-[var(--color-neon)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductTableRow({ image, name, id, status, date, time, url, disabled = false }: any) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="p-4 border-r-2 border-black w-24">
        <div className="w-16 h-16 brutalist-border bg-gray-200">
          <img src={image} alt={name} className={cn("w-full h-full object-cover", disabled && "grayscale opacity-50")} />
        </div>
      </td>
      <td className="p-4 border-r-2 border-black">
        <div className="font-bold text-sm uppercase tracking-tight mb-1">{name}</div>
        <div className="text-[10px] font-mono text-gray-500 uppercase bg-gray-100 inline-block px-1">ID: {id}</div>
      </td>
      <td className="p-4 border-r-2 border-black">
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase brutalist-border",
          status === 'LIVE' ? "bg-[var(--color-neon)]" :
          status === 'GENERATING' ? "bg-gray-200 text-gray-500" :
          "bg-white"
        )}>
          {status === 'LIVE' && <div className="w-2 h-2 bg-black"></div>}
          {status}
        </div>
      </td>
      <td className="p-4 border-r-2 border-black font-mono text-xs">
        <div className="text-gray-500">{date}</div>
        <div className="font-bold">{time}</div>
      </td>
      <td className="p-4 flex gap-2">
        <a 
          href={url}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "px-4 py-2 brutalist-border inline-flex items-center gap-2 text-xs font-bold uppercase transition-colors bg-white hover:bg-[var(--color-neon)]",
            disabled && "opacity-50 pointer-events-none"
          )}
        >
          <ExternalLink className="w-3 h-3" />
          PREVIEW
        </a>
        <Link 
          to={`/generate?session_id=${id}`}
          className={cn(
            "px-4 py-2 brutalist-border inline-flex items-center gap-2 text-xs font-bold uppercase transition-colors bg-black text-white hover:bg-gray-800",
            disabled && "opacity-50 pointer-events-none"
          )}
        >
          <Edit3 className="w-3 h-3 text-[var(--color-neon)]" />
          EDIT_SESSION
        </Link>
      </td>
    </tr>
  );
}

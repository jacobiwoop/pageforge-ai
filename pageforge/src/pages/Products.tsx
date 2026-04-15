import { Download, Filter, ExternalLink, Copy, Settings, Terminal } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Products() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-2">PRODUCTS</h1>
          <div className="inline-block bg-black text-[var(--color-neon)] px-3 py-1 text-xs font-mono uppercase">
            DB_QUERY_SUCCESS // 1,240 ENTRIES FOUND
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-3 bg-white brutalist-border flex items-center gap-2 text-sm font-bold uppercase hover:bg-gray-100 transition-colors">
            <span className="text-gray-500 text-xs">FILTER_STATUS</span>
            ALL_STATUS
          </button>
          <button className="px-6 py-3 bg-[var(--color-neon)] brutalist-border brutalist-shadow flex items-center gap-2 text-sm font-bold uppercase hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all">
            <Download className="w-4 h-4" />
            EXPORT_CSV
          </button>
        </div>
      </div>

      <div className="bg-white brutalist-border overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-black text-white text-xs font-bold uppercase tracking-wider">
              <th className="p-4 border-r border-gray-800">PREVIEW</th>
              <th className="p-4 border-r border-gray-800">IDENTITY_META</th>
              <th className="p-4 border-r border-gray-800">STATUS</th>
              <th className="p-4 border-r border-gray-800">TIMESTAMP</th>
              <th className="p-4">PROCESS</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            <ProductTableRow 
              image="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=100&h=100"
              name="NEON_PROCESSOR_V4"
              id="XP-882-ALPHA"
              status="LIVE"
              date="2023.10.24"
              time="14:42:01"
              action="SANDBOX"
            />
            <ProductTableRow 
              image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=100&h=100"
              name="CYBER_DECK_MODULE"
              id="CD-001-BETA"
              status="GENERATING"
              date="2023.10.25"
              time="09:12:44"
              action="SANDBOX"
              disabled
            />
            <ProductTableRow 
              image="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=100&h=100"
              name="VOID_SENSOR_ARRAY"
              id="VS-999-DELTA"
              status="DRAFT"
              date="2023.10.22"
              time="22:01:15"
              action="SANDBOX"
            />
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
            <div className="text-6xl font-bold tracking-tighter mb-4">842</div>
            <div className="w-full h-2 bg-gray-200 brutalist-border mb-2">
              <div className="h-full bg-[var(--color-neon)] w-[75%] border-r-2 border-black"></div>
            </div>
            <div className="text-[10px] font-mono text-gray-500 uppercase">ALLOCATION_REMAINING: 25%</div>
          </div>
        </div>

        <div className="bg-white brutalist-border p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xs font-bold tracking-wider uppercase">AI_GENERATED</h3>
            <Settings className="w-5 h-5 text-white bg-black p-0.5" />
          </div>
          <div>
            <div className="text-6xl font-bold tracking-tighter mb-4">1.2k</div>
            <div className="flex gap-1 mb-2">
              {[1,2,3,4].map(i => <div key={i} className="w-4 h-4 bg-[var(--color-neon)] brutalist-border"></div>)}
              <div className="w-4 h-4 bg-gray-200 brutalist-border"></div>
            </div>
            <div className="text-[10px] font-mono text-gray-500 uppercase">AVERAGE_LATENCY: 44MS</div>
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

function ProductTableRow({ image, name, id, status, date, time, action, disabled = false }: any) {
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
      <td className="p-4">
        <button 
          disabled={disabled}
          className={cn(
            "px-4 py-2 brutalist-border flex items-center gap-2 text-xs font-bold uppercase transition-colors",
            disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-[var(--color-neon)]"
          )}
        >
          <ExternalLink className="w-3 h-3" />
          {action}
        </button>
      </td>
    </tr>
  );
}

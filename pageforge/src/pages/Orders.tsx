import { Download, Filter, MoreVertical, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Orders() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <h1 className="text-2xl font-bold uppercase tracking-tighter">COMMAND_LOG_V3.0</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="TOTAL ORDERS" 
          value="1,284" 
          change="+12.5%" 
          changeLabel="VS LAST MONTH" 
        />
        <div className="bg-white brutalist-border p-6 flex flex-col justify-between">
          <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-4">ACTIVE PROCESSING</h3>
          <div>
            <div className="text-4xl font-bold tracking-tighter mb-4">42</div>
            <div className="w-full h-2 bg-gray-200 brutalist-border">
              <div className="h-full bg-[var(--color-neon-dark)] w-[60%] border-r-2 border-black"></div>
            </div>
          </div>
        </div>
        <StatCard 
          title="REVENUE TODAY" 
          value="$12.4K" 
          changeLabel="REAL-TIME TELEMETRY" 
          noChangeBadge
        />
        <StatCard 
          title="AVG VALUE" 
          value="$294.00" 
          changeLabel="EFFICIENCY: 98.4%" 
          noChangeBadge
        />
      </div>

      <div className="bg-white brutalist-border flex flex-col">
        <div className="p-6 border-b-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold uppercase tracking-tighter">ORDER LEDGER_</h2>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-white brutalist-border text-xs font-bold uppercase hover:bg-gray-100 transition-colors">
              FILTER_BY_STATUS
            </button>
            <button className="px-4 py-2 bg-[var(--color-neon)] brutalist-border text-xs font-bold uppercase hover:bg-[var(--color-neon-dark)] transition-colors">
              EXPORT_CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider border-b-2 border-black">
                <th className="p-4">ID_ORDER</th>
                <th className="p-4">CLIENT_ENTITY</th>
                <th className="p-4">PRODUCT_MODEL</th>
                <th className="p-4">AMOUNT_USD</th>
                <th className="p-4">TIMESTAMP</th>
                <th className="p-4">STATUS_FLAG</th>
                <th className="p-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-mono text-xs">
              <OrderRow 
                id="#ORD-9421-X"
                client="Aris Thorne"
                avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Aris"
                product="Neural Link v4"
                amount="$1,299.00"
                date="2023-11-24"
                time="14:22:01"
                status="PAID"
              />
              <OrderRow 
                id="#ORD-9422-B"
                client="Elowen Stark"
                avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Elowen"
                product="Edge Processor XL"
                amount="$3,450.00"
                date="2023-11-24"
                time="13:45:55"
                status="PENDING"
              />
              <OrderRow 
                id="#ORD-9423-Z"
                client="Marcus Vane"
                avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
                product="Quantum Core S1"
                amount="$12,000.00"
                date="2023-11-24"
                time="11:10:12"
                status="SHIPPED"
              />
              <OrderRow 
                id="#ORD-9424-P"
                client="Liora Chen"
                avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Liora"
                product="Optic Array G7"
                amount="$840.00"
                date="2023-11-24"
                time="10:02:44"
                status="PAID"
              />
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t-2 border-black flex items-center justify-between bg-gray-50 text-[10px] font-mono uppercase">
          <div>DISPLAYING_RECORDS: 1-4 OF 1,284</div>
          <div className="flex gap-1">
            <button className="w-8 h-8 brutalist-border bg-white flex items-center justify-center hover:bg-gray-100">&lt;</button>
            <button className="w-8 h-8 brutalist-border bg-[var(--color-neon)] flex items-center justify-center font-bold">1</button>
            <button className="w-8 h-8 brutalist-border bg-white flex items-center justify-center hover:bg-gray-100">2</button>
            <button className="w-8 h-8 brutalist-border bg-white flex items-center justify-center hover:bg-gray-100">3</button>
            <button className="w-8 h-8 brutalist-border bg-white flex items-center justify-center hover:bg-gray-100">&gt;</button>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-alert)] brutalist-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="bg-black text-white p-2 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold uppercase text-sm mb-1">SYSTEM_ALERT: MAINTENANCE_INCOMING</h4>
            <p className="text-[10px] font-mono uppercase">GLOBAL CLUSTER SYNC SCHEDULED IN 14 MINUTES. SOME TRANSACTION LOGS MAY EXPERIENCE LATENCY.</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-white brutalist-border text-xs font-bold uppercase hover:bg-gray-100 transition-colors whitespace-nowrap">
          ACKNOWLEDGE_EVENT
        </button>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, changeLabel, noChangeBadge = false }: any) {
  return (
    <div className="bg-white brutalist-border p-6 flex flex-col justify-between">
      <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-4">{title}</h3>
      <div>
        <div className="text-4xl font-bold tracking-tighter mb-4">{value}</div>
        <div className="flex items-center gap-2">
          {!noChangeBadge && change && (
            <span className="bg-[var(--color-neon)] px-2 py-0.5 text-xs font-bold brutalist-border">{change}</span>
          )}
          <span className="text-[10px] font-mono text-gray-500 uppercase">{changeLabel}</span>
        </div>
      </div>
    </div>
  );
}

function OrderRow({ id, client, avatar, product, amount, date, time, status }: any) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="p-4 font-bold">{id}</td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 brutalist-border bg-gray-200 shrink-0">
            <img src={avatar} alt={client} className="w-full h-full object-cover" />
          </div>
          <span className="font-bold font-sans text-sm">{client}</span>
        </div>
      </td>
      <td className="p-4 font-sans text-sm">{product}</td>
      <td className="p-4 font-bold">{amount}</td>
      <td className="p-4 text-[10px]">
        <div className="text-gray-500">{date}</div>
        <div>{time}</div>
      </td>
      <td className="p-4">
        <span className={cn(
          "px-2 py-1 text-[10px] font-bold uppercase brutalist-border",
          status === 'PAID' ? "bg-[var(--color-neon)]" :
          status === 'SHIPPED' ? "bg-black text-white" :
          "bg-gray-200"
        )}>
          {status}
        </span>
      </td>
      <td className="p-4 text-center">
        <button className="p-1 hover:bg-gray-200 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}

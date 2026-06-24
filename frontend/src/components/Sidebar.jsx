import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  AlertCircle,
  Activity,
  X,
  Server,
  Zap
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'jobs', label: 'Delivery Logs', icon: Layers },
    { id: 'failed', label: 'Failed Deliveries', icon: AlertCircle },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-64 border-r border-zinc-900 bg-zinc-950 transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        <div className="p-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-blue-500 text-white rounded flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap size={16} fill="white" />
            </div>
            <span className="font-bold text-zinc-100 tracking-tight">Holden</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 hover:bg-zinc-900 rounded-md text-zinc-500"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4">Orchestration</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-zinc-900 text-zinc-100 ring-1 ring-zinc-800 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
              }`}
            >
              <item.icon size={16} className={activeTab === item.id ? 'text-zinc-100' : 'text-zinc-500'} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-zinc-900 mt-auto shrink-0 bg-zinc-950">
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server size={12} className="text-zinc-500" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Cluster VM</span>
              </div>
              <div className="flex items-center gap-1">
                 <div className="w-1 h-1 rounded-full bg-emerald-500" />
                 <span className="text-[9px] font-bold text-emerald-500 uppercase">Online</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={12} className="text-zinc-500" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Redis 7.2</span>
              </div>
              <div className="flex items-center gap-1">
                 <div className="w-1 h-1 rounded-full bg-emerald-500" />
                 <span className="text-[9px] font-bold text-emerald-500 uppercase">Active</span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-[10px]">
               <span className="text-zinc-600 font-medium">Node Version</span>
               <span className="text-zinc-400 font-mono">v20.20.2</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

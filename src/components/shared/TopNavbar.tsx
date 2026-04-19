import React, { useState, useEffect } from 'react';
import { Search, Command, Sun, Moon, Bell, Menu, Activity } from 'lucide-react';
import { useStore } from '@/store/useStore';

const TopNavbar = () => {
  const { toggleSidebar } = useStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className={cn(
      "h-[80px] flex items-center justify-between px-6 lg:px-12 z-40 transition-all duration-300 sticky top-0",
      isScrolled ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800" : "bg-white/50 dark:bg-slate-950/50"
    )}>
      {/* Mobile Branding */}
      <div className="flex items-center gap-3 lg:hidden">
        <button 
          onClick={toggleSidebar}
          className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-lg active:scale-95 transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tighter text-slate-900 dark:text-white leading-none">EvoDoc</span>
          <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest leading-none">Portal</span>
        </div>
      </div>

      {/* Search Interaction - Hidden on small mobile */}
      <div className="relative w-full max-w-lg group hidden md:block">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Global search (Cmd + K)"
          className="w-full h-12 bg-slate-100/50 dark:bg-slate-900/50 border border-transparent focus:border-blue-500/30 rounded-2xl pl-12 pr-24 text-sm font-medium text-slate-700 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 dark:text-slate-500 shadow-sm">
          <Command className="w-3 h-3" />
          <span className="text-[10px] font-bold">K</span>
        </div>
      </div>

      {/* Control Cluster */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 pr-4 border-r border-slate-200 dark:border-slate-800">
           <div className="flex flex-col items-end mr-2">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest leading-none">System Online</span>
              <span className="text-[9px] font-semibold text-slate-400 uppercase mt-0.5 tracking-tighter">Syncing Patient Records</span>
           </div>
           <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
           </div>
        </div>

        <button className="relative p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-premium transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-premium transition-all"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-3 ml-2 lg:ml-4 group cursor-pointer">
           <div className="text-right hidden sm:block">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Clinic A-12</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">Main Wing</div>
           </div>
           <div className="w-11 h-11 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Menu className="w-5 h-5" />
           </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;

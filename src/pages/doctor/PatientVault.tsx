import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronRight, 
  ShieldCheck, 
  Activity, 
  Fingerprint,
  MoreVertical,
  ExternalLink,
  ArrowUpDown,
  FileText,
  Clock,
  Heart,
  Droplets,
  Calendar
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/utils/helpers';
import { useNavigate } from 'react-router-dom';

const PatientVault = () => {
  const { patients } = useStore();
  const [search, setSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState('all');
  const navigate = useNavigate();

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.mrn.toLowerCase().includes(q);
      const matchBlood = bloodFilter === 'all' || p.blood === bloodFilter;
      return matchSearch && matchBlood;
    });
  }, [patients, search, bloodFilter]);

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header Context */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">
            <ShieldCheck className="w-5 h-5" /> Secured Health Records
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Clinical Vault</h1>
          <p className="text-slate-500 font-bold max-w-sm text-sm uppercase tracking-widest opacity-80 pt-1">Advanced Patient Identity Archive</p>
        </div>
        
        <div className="flex gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
           <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Records:</span>
              <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">{patients.length}</span>
           </div>
        </div>
      </header>

      {/* Control Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by legal name or MRN lookup..."
            className="w-full h-16 pl-16 pr-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] text-sm font-bold shadow-premium outline-none focus:border-blue-500 transition-all dark:text-white placeholder:text-slate-300"
          />
        </div>
        <div className="relative group">
           <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
             <Droplets className="w-5 h-5" />
           </div>
           <select 
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
            className="w-full h-16 pl-16 pr-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] text-sm font-bold shadow-premium outline-none appearance-none cursor-pointer focus:border-blue-500 dark:text-white"
           >
             <option value="all">Global Blood Range</option>
             {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
               <option key={bg} value={bg}>Type {bg} Group</option>
             ))}
           </select>
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPatients.map((p, i) => (
          <div 
            key={p.id}
            onClick={() => navigate(`/doctor/patients/${p.id}`)}
            className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer relative overflow-hidden active:scale-95"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-colors" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-start justify-between">
                <div className="w-20 h-20 rounded-[1.75rem] bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center font-black text-3xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent group-hover:rotate-6 transition-all duration-500 shadow-inner-soft">
                  {p.name.charAt(0)}
                </div>
                <div className="flex flex-col items-end gap-2">
                   <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-[9px] font-black text-blue-600 uppercase tracking-widest rounded-lg border border-blue-100 dark:border-blue-800">
                      IDENTIFIED
                   </div>
                   <div className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-tighter tabular-nums">{p.mrn}</div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-2 uppercase group-hover:text-blue-600 transition-colors">{p.name}</h3>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>{p.gender}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-200" />
                  <span>38 Yrs</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 group-hover:bg-blue-50 transition-colors">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Heart className="w-3 h-3 text-rose-500" /> Vitals</div>
                    <div className="text-xs font-black text-slate-900 dark:text-white">{p.blood} Unit</div>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 group-hover:bg-blue-50 transition-colors">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar className="w-3 h-3 text-blue-500" /> Intake</div>
                    <div className="text-xs font-black text-slate-900 dark:text-white">Active Feed</div>
                 </div>
              </div>

              <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="relative group/lock">
                      <ShieldCheck className="w-5 h-5 text-emerald-500 transition-all duration-300 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-emerald-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                    </div>
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Verified Vault Access</span>
                 </div>
                 <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">View Record</span>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
         <div className="py-40 flex flex-col items-center gap-8 animate-scale-in">
            <div className="w-24 h-24 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-premium flex items-center justify-center relative">
               <Users className="w-10 h-10 text-slate-200" />
               <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-rose-500 border-4 border-white dark:border-slate-950 flex items-center justify-center"><X className="w-4 h-4 text-white" /></div>
            </div>
            <div className="text-center space-y-2">
               <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Zero Vault Matches</h3>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest max-w-[240px]">The criteria provided does not match any active clinical identity.</p>
            </div>
            <button 
              onClick={() => { setSearch(''); setBloodFilter('all'); }}
              className="px-10 py-4 bg-blue-600 text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-vibrant hover:scale-105 transition-all"
            >
              Flush Search Filters
            </button>
         </div>
      )}
    </div>
  );
};

export default PatientVault;

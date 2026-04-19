import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  MoreVertical, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpDown,
  FileDown,
  Activity,
  Plus,
  User,
  Stethoscope,
  ChevronDown
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { format } from 'date-fns';
import { cn } from '@/utils/helpers';
import { AppointmentStatus } from '@/types';
import { useToast } from '@/components/ui/toast';

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: AppointmentStatus }) => {
  const styles = {
    scheduled: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 border-blue-100 dark:border-blue-900/30",
    completed: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-900/30",
    cancelled: "bg-rose-50 text-rose-500 dark:bg-rose-500/10 border-rose-100 dark:border-rose-900/30",
  };

  return (
    <span className={cn(
      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 w-fit",
      styles[status]
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full", status === 'scheduled' ? 'bg-blue-500' : status === 'completed' ? 'bg-emerald-500' : 'bg-rose-500')} />
      {status}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const AppointmentList = () => {
  const { appointments, patients, doctors, updateAppointmentStatus } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const { addToast } = useToast();

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appt => {
      const patient = patients.find(p => p.id === appt.patientId);
      const doctor = doctors.find(d => d.id === appt.doctorId);
      
      const q = search.toLowerCase();
      const matchesSearch = !q || 
        patient?.name.toLowerCase().includes(q) || 
        patient?.mrn.toLowerCase().includes(q) ||
        appt.type.toLowerCase().includes(q);
        
      const matchesStatus = statusFilter === 'all' || appt.status === statusFilter;
      const matchesDoctor = doctorFilter === 'all' || appt.doctorId === doctorFilter;
      const matchesDate = !dateFilter || appt.date === dateFilter;
      
      return matchesSearch && matchesStatus && matchesDoctor && matchesDate;
    }).sort((a,b) => a.time.localeCompare(b.time));
  }, [appointments, patients, doctors, search, statusFilter, doctorFilter, dateFilter]);

  const handleStatusChange = (appointmentId: string, newStatus: AppointmentStatus, patientName: string) => {
    updateAppointmentStatus(appointmentId, newStatus);
    addToast({
      type: newStatus === 'completed' ? 'success' : 'warning',
      title: `Identity Confirmed: ${newStatus}`,
      message: `The encounter for ${patientName} has been synchronized as ${newStatus}.`
    });
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] bg-blue-50 dark:bg-blue-900/20 px-5 py-2 rounded-2xl border border-blue-100 dark:border-blue-900/30 w-fit">
            <Activity className="w-4 h-4" /> Clinical Encounter Registry
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Active Schedule</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px] opacity-70">Synchronizing clinician throughput with patient inflow.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all shadow-sm">
            <FileDown className="w-4 h-4" /> Export Archive
          </button>
          <button 
             onClick={() => window.location.href = '/nurse/appointments/new'}
             className="flex items-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-vibrant hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Register Encounter
          </button>
        </div>
      </header>

      {/* Operations Control */}
      <div className="bg-white dark:bg-slate-900 p-10 lg:p-12 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-premium space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-10 gap-y-8">
          <div className="lg:col-span-2 space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Identity Search</label>
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by legal name, MRN or clinical procedure..."
                className="w-full h-16 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl pl-14 pr-6 text-sm font-bold outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all dark:text-white placeholder:font-medium placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Clinical Specialist</label>
            <div className="relative">
              <Stethoscope className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <select 
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="w-full h-16 pl-12 pr-10 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-black uppercase tracking-widest outline-none apperance-none cursor-pointer focus:border-blue-500 transition-all dark:text-white"
              >
                <option value="all">Global On-Call</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Encounter Date</label>
             <div className="relative">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full h-16 pl-12 pr-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 p-1.5 bg-slate-50 dark:bg-slate-950 rounded-2xl w-fit border border-slate-100 dark:border-slate-800 shadow-inner-soft">
          {(['all', 'scheduled', 'completed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                statusFilter === status 
                  ? "bg-white dark:bg-slate-800 text-blue-600 shadow-premium border border-slate-100 dark:border-slate-700 scale-105" 
                  : "text-slate-400 hover:text-blue-500"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Encounter Vault */}
      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Patient Identity</th>
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Provider</th>
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Schedule block</th>
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Procedure</th>
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Status</th>
                <th className="px-10 py-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredAppointments.map((appt, i) => {
                const patient = patients.find(p => p.id === appt.patientId);
                const doctor = doctors.find(d => d.id === appt.doctorId);
                return (
                  <tr key={appt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-[1.25rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black text-xl shadow-premium group-hover:rotate-6 transition-transform">
                          {patient?.name.charAt(0)}
                        </div>
                        <div>
                           <div className="text-base font-black text-slate-900 dark:text-white tracking-tight uppercase mb-1.5">{patient?.name}</div>
                           <div className="flex items-center gap-3">
                              <span className="text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{patient?.mrn}</span>
                              <div className="w-1 h-1 rounded-full bg-blue-500" />
                              <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{patient?.blood} Group</span>
                           </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex flex-col">
                         <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{doctor?.name}</span>
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{doctor?.specialty}</span>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white tabular-nums">
                           <Clock className="w-3.5 h-3.5 text-blue-500" /> {appt.time} EST
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{appt.date}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest rounded-lg border border-slate-200 dark:border-slate-800">
                        {appt.type}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-center flex justify-center">
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                         {appt.status === 'scheduled' && (
                           <>
                             <button 
                               onClick={() => handleStatusChange(appt.id, 'completed', patient?.name || 'Patient')}
                               title="Match Success"
                               className="w-11 h-11 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 dark:border-emerald-800 flex items-center justify-center shadow-sm"
                             >
                               <CheckCircle className="w-5 h-5" />
                             </button>
                             <button 
                               onClick={() => handleStatusChange(appt.id, 'cancelled', patient?.name || 'Patient')}
                               title="Abort Encounter"
                               className="w-11 h-11 bg-rose-50 dark:bg-rose-900/20 rounded-xl text-rose-500 hover:bg-rose-600 hover:text-white transition-all border border-rose-100 dark:border-rose-800 flex items-center justify-center shadow-sm"
                             >
                               <XCircle className="w-5 h-5" />
                             </button>
                           </>
                         )}
                         <button 
                           className="w-11 h-11 bg-white dark:bg-slate-800 rounded-xl text-slate-300 hover:text-blue-600 transition-all border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-sm"
                         >
                           <MoreVertical className="w-5 h-5" />
                         </button>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Footer Navigation */}
        <div className="px-10 py-8 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
             Total encounters Synchronized: <span className="text-slate-900 dark:text-white">{filteredAppointments.length}</span>
           </div>
           <div className="flex items-center gap-4">
             <button className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-300 hover:text-blue-600 transition-all shadow-sm flex items-center justify-center">
               <ChevronLeft className="w-6 h-6" />
             </button>
             <div className="flex items-center gap-2">
               <button className="w-12 h-12 rounded-2xl bg-blue-600 text-white text-[11px] font-black shadow-vibrant">1</button>
               <button className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 text-slate-400 text-[11px] font-black border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all">2</button>
             </div>
             <button className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-300 hover:text-blue-600 transition-all shadow-sm flex items-center justify-center">
               <ChevronRight className="w-6 h-6" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentList;

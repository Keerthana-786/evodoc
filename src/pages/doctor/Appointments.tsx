import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Search,
  Clock,
  User,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  BarChart3,
  Heart,
  Stethoscope,
  TrendingUp,
  Filter,
  Bell,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { format, isToday, isFuture, isPast } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/helpers';
import { AppointmentStatus } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type TimeTab = 'upcoming' | 'today' | 'past';
type StatusTab = AppointmentStatus | 'all';

// ─── Constants ────────────────────────────────────────────────────────────────

const AVATAR_PALETTE: Record<number, { bg: string; text: string }> = {
  0: { bg: 'bg-blue-100 dark:bg-blue-900/40',    text: 'text-blue-700 dark:text-blue-300' },
  1: { bg: 'bg-teal-100 dark:bg-teal-900/40',    text: 'text-teal-700 dark:text-teal-300' },
  2: { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-300' },
  3: { bg: 'bg-rose-100 dark:bg-rose-900/40',    text: 'text-rose-700 dark:text-rose-300' },
  4: { bg: 'bg-amber-100 dark:bg-amber-900/40',  text: 'text-amber-700 dark:text-amber-300' },
  5: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300' },
};

const TYPE_STYLES: Record<string, string> = {
  'GENERAL CONSULTATION': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  'FOLLOW-UP':            'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  'EMERGENCY':            'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800',
  'ROUTINE CHECKUP':      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
};

const STATUS_CONFIG = {
  scheduled: { label: 'Scheduled', dot: 'bg-blue-500',    pill: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', border: 'border-l-blue-500' },
  completed: { label: 'Completed', dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', border: 'border-l-emerald-500' },
  cancelled: { label: 'Cancelled', dot: 'bg-slate-400',   pill: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400', border: 'border-l-slate-400' },
};

const NAV_ITEMS = [
  { icon: BarChart3,    label: 'Dashboard',      active: false, to: '/doctor/dashboard' },
  { icon: Calendar,     label: 'Medical Roster', active: true, to: '/doctor/appointments'  },
  { icon: User,         label: 'Patients',       active: false, to: '/doctor/dashboard' },
  { icon: Clock,        label: 'Schedule',       active: false, to: '/doctor/dashboard' },
  { icon: AlertCircle,  label: 'Alerts',         active: false, to: '/doctor/dashboard' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const Avatar = ({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) => {
  const idx = (name?.charCodeAt(0) ?? 0) % 6;
  const p = AVATAR_PALETTE[idx];
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? '?';
  const sz = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-14 h-14 text-xl' : 'w-11 h-11 text-sm';
  return (
    <div className={cn('rounded-full flex items-center justify-center font-bold flex-shrink-0 ring-2 ring-white dark:ring-slate-900', sz, p.bg, p.text)}>
      {initials}
    </div>
  );
};

const TypeBadge = ({ type }: { type: string }) => (
  <span className={cn(
    'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap border capitalize',
    TYPE_STYLES[type.toUpperCase()] ?? 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
  )}>
    {type.toLowerCase()}
  </span>
);

const StatusPill = ({ status }: { status: AppointmentStatus }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide', cfg.pill)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const DUMMY_APPOINTMENTS = [
  { id: '1', patientId: 'p1', date: new Date().toISOString().split('T')[0], time: '09:00', type: 'GENERAL CONSULTATION', status: 'scheduled' as AppointmentStatus },
  { id: '2', patientId: 'p2', date: new Date().toISOString().split('T')[0], time: '10:30', type: 'FOLLOW-UP',            status: 'scheduled' as AppointmentStatus },
  { id: '3', patientId: 'p3', date: new Date().toISOString().split('T')[0], time: '12:00', type: 'EMERGENCY',            status: 'scheduled' as AppointmentStatus },
  { id: '4', patientId: 'p4', date: new Date().toISOString().split('T')[0], time: '14:30', type: 'ROUTINE CHECKUP',      status: 'completed' as AppointmentStatus },
  { id: '5', patientId: 'p5', date: new Date().toISOString().split('T')[0], time: '16:00', type: 'GENERAL CONSULTATION', status: 'cancelled' as AppointmentStatus },
];

const DUMMY_PATIENTS = [
  { id: 'p1', name: 'Arjun Mehta',   mrn: 'MRN-2026-0001' },
  { id: 'p2', name: 'Priya Sharma',  mrn: 'MRN-2026-0002' },
  { id: 'p3', name: 'Deepak Nair',   mrn: 'MRN-2026-0005' },
  { id: 'p4', name: 'Meena Pillai',  mrn: 'MRN-2026-0006' },
  { id: 'p5', name: 'Ravi Kumar',    mrn: 'MRN-2026-0003' },
];

const Appointments = () => {
  const navigate = useNavigate();
  const store = useStore();
  const appointments = store.appointments?.length ? store.appointments : DUMMY_APPOINTMENTS;
  const patients     = store.patients?.length     ? store.patients     : DUMMY_PATIENTS;

  const [search,       setSearch]       = useState('');
  const [activeTab,    setActiveTab]    = useState<TimeTab>('today');
  const [statusFilter, setStatusFilter] = useState<StatusTab>('all');

  const filtered = useMemo(() => {
    return appointments.filter(a => {
      const patient = patients.find(p => p.id === a.patientId);
      const q = search.toLowerCase();
      const matchSearch = !q ||
        patient?.name.toLowerCase().includes(q) ||
        patient?.mrn.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      const d = new Date(a.date);
      const matchTab =
        activeTab === 'today'    ? isToday(d) :
        activeTab === 'upcoming' ? isFuture(d) || isToday(d) :
                                   isPast(d) && !isToday(d);
      return matchSearch && matchStatus && matchTab;
    }).sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return diff !== 0 ? diff : a.time.localeCompare(b.time);
    });
  }, [appointments, patients, search, activeTab, statusFilter]);

  const todayCount    = appointments.filter(a => isToday(new Date(a.date))).length;
  const upcomingCount = appointments.filter(a => isFuture(new Date(a.date)) || isToday(new Date(a.date))).length;

  const getStatusCount = (status: AppointmentStatus | 'all') => {
    if (status === 'all') return appointments.length;
    return appointments.filter(a => a.status === status).length;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Page Heading (since we removed the specific header, we can add a subtle page title if needed, but AppShell usually handles global title) */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Medical Roster</h1>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-blue-600" /> {format(new Date(), 'EEEE, d MMMM yyyy')}
          </p>
        </div>
      </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Daily Load */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 border-l-[4px] border-l-blue-500 p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white tabular-nums leading-none">{todayCount}</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1.5 flex flex-col gap-1">
                  Daily Load
                   <span className="flex items-center gap-1 text-[10px] text-emerald-500 lowercase normal-case">
                    <TrendingUp className="w-3 h-3" /> +8% vs yesterday
                  </span>
                </div>
              </div>
            </div>
            {/* Upcoming */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 border-l-[4px] border-l-teal-500 p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white tabular-nums leading-none">{upcomingCount}</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1.5 flex flex-col gap-1">
                  Upcoming
                  <span className="flex items-center gap-1 text-[10px] text-teal-500 normal-case">
                    Next 7 days schedule
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by patient name or MRN..."
              className="w-full h-12 pl-11 pr-16 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/10 transition-all shadow-sm"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 pointer-events-none">
              <span className="text-[10px] font-bold text-slate-500">⌘K</span>
            </div>
          </div>

          {/* Filters row */}
          <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
            {/* Status filter pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {(['all', 'scheduled', 'completed', 'cancelled'] as const).map(s => {
                const isActive = statusFilter === s;
                const count = getStatusCount(s);
                const styles: Record<string, string> = {
                  all:       isActive ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-slate-400',
                  scheduled: isActive ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 text-blue-600 border border-blue-200 dark:border-blue-900/50 hover:border-blue-400',
                  completed: isActive ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900 text-emerald-600 border border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-400',
                  cancelled: isActive ? 'bg-slate-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-slate-400',
                };
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={cn('px-4 py-1.5 rounded-full text-[11px] font-bold capitalize transition-all duration-200 flex items-center gap-2', styles[s])}
                  >
                    {s}
                    <span className={cn('px-1.5 py-0.5 rounded-md text-[9px] font-black', isActive ? 'bg-white/20 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400')}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Time segmented control */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
              {(['upcoming', 'today', 'past'] as const).map(tab => {
                const isActive = activeTab === tab;
                const isTodayTab = tab === 'today';
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-[10px] font-bold capitalize transition-all duration-200 flex items-center gap-2',
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    {tab}
                    {isTodayTab && (
                       <span className={cn('w-2 h-2 rounded-full ring-4 ring-emerald-500/20', todayCount > 0 ? 'bg-emerald-500' : 'bg-slate-300')} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center gap-2 px-1">
            <span className="text-[11px] font-bold text-slate-400">
              Showing {filtered.length} {filtered.length === 1 ? 'appointment' : 'appointments'} · Sorted by time
            </span>
          </div>

          {/* Appointment cards */}
          <div className="space-y-4 pb-12">
            {filtered.length > 0 ? (
              filtered.map((appt, idx) => {
                const patient = patients.find(p => p.id === appt.patientId);
                const statusCfg = STATUS_CONFIG[appt.status];
                return (
                  <div
                    key={appt.id}
                    onClick={() => navigate(`/doctor/patients/${appt.patientId}`)}
                    className={cn(
                      "group bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center gap-6 transition-all cursor-pointer relative overflow-hidden active:scale-[0.98]",
                      "border-l-[6px] hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/5 hover:border-l-teal-400",
                      statusCfg.border
                    )}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* Hover flash border effect */}
                    <div className="absolute left-0 top-0 w-1.5 h-full bg-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-center gap-5 flex-1 min-w-0">
                      <Avatar name={patient?.name ?? 'U'} size="lg" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="font-black text-slate-900 dark:text-white text-lg tracking-tighter truncate leading-none uppercase">
                            {patient?.name ?? 'Unknown Patient'}
                          </span>
                          <StatusPill status={appt.status} />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-bold uppercase tracking-widest flex-wrap">
                          <span className="text-slate-500">{patient?.mrn}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-200" />
                          <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                            <Clock className="w-3.5 h-3.5" /> {appt.time} EST
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-50 dark:border-slate-800/50">
                      <TypeBadge type={appt.type} />
                      <div className="w-10 h-10 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-300 group-hover:border-teal-200 dark:group-hover:border-teal-800 group-hover:text-teal-500 transition-all font-black bg-slate-50/50 dark:bg-slate-800/30">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 py-32 flex flex-col items-center justify-center text-center animate-scale-in">
                <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-8 relative">
                   <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                   <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm">
                      <Search className="w-4 h-4 text-slate-400" />
                   </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-3">No Clinical Results</h3>
                <p className="text-slate-400 font-medium max-w-xs mx-auto mb-8 text-sm">No appointments match your current filters. Try adjusting your clinical search criteria.</p>
                <button
                  onClick={() => { setSearch(''); setStatusFilter('all'); setActiveTab('today'); }}
                  className="px-10 py-4 bg-teal-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-vibrant hover:bg-teal-600 transition-all flex items-center gap-3"
                >
                  <Filter className="w-4 h-4" /> Clear All Filters
                </button>
              </div>
            )}
          </div>

    </div>
  );
};

export default Appointments;

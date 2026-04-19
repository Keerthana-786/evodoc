import React, { useMemo, useState } from 'react';
import {
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Plus,
  Clock,
  ArrowRight,
  ExternalLink,
  FileText,
  Activity,
  Heart,
  Stethoscope,
  ChevronRight,
  Bell,
  Search,
  Moon,
  Sun,
  Zap,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { format } from 'date-fns';
import { cn } from '@/utils/helpers';

import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/toast';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendType: 'up' | 'down' | 'alert';
  icon: React.ElementType;
  accent: 'blue' | 'emerald' | 'indigo' | 'rose' | 'amber';
  delay?: number;
}

// ─── Palette map ──────────────────────────────────────────────────────────────

const ACCENT = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-l-blue-500', iconBg: 'bg-blue-100 dark:bg-blue-900' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-l-emerald-500', iconBg: 'bg-emerald-100 dark:bg-emerald-900' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-l-indigo-500', iconBg: 'bg-indigo-100 dark:bg-indigo-900' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-600 dark:text-rose-400', border: 'border-l-rose-500', iconBg: 'bg-rose-100 dark:bg-rose-900' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-l-amber-500', iconBg: 'bg-amber-100 dark:bg-amber-900' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const Avatar = ({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const sz = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-14 h-14 text-lg' : 'w-11 h-11 text-sm';
  return (
    <div className={cn('rounded-full flex items-center justify-center font-black flex-shrink-0 ring-2 ring-white dark:ring-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-500', sz)}>
      {initials}
    </div>
  );
};

const StatCard = ({ title, value, trend, trendType, icon: Icon, accent, delay = 0 }: StatCardProps) => {
  const p = ACCENT[accent];
  return (
    <div
      className={cn(
        "relative bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 flex flex-col gap-4 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-500 cursor-default overflow-hidden border-l-[6px]",
        p.border
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative flex items-center justify-between">
        <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm', p.iconBg)}>
          <Icon className={cn('w-6 h-6', p.text)} />
        </div>
        <span className={cn(
          'flex items-center gap-1.5 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest',
          trendType === 'up' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' :
            trendType === 'alert' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/30' :
              'bg-slate-50 text-slate-500 dark:bg-slate-800'
        )}>
          {trendType === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : trendType === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
          {trend}
        </span>
      </div>

      <div>
        <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums leading-none mb-2">{value}</div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { appointments, patients } = useStore();
  const today = format(new Date(), 'yyyy-MM-dd');
  const [dark, setDark] = useState(false);

  const todayAppointments = useMemo(
    () => appointments.filter(a => a.date === today && a.doctorId === 'd1'),
    [appointments, today]
  );

  const thisWeekAppointments = useMemo(() => {
    const now = new Date();
    const endOfWeek = new Date();
    endOfWeek.setDate(now.getDate() + 7);
    return appointments.filter(a => {
      const d = new Date(a.date);
      return d >= now && d <= endOfWeek && a.doctorId === 'd1';
    });
  }, [appointments]);

  const STATS: StatCardProps[] = [
    { title: "Today's Load", value: String(todayAppointments.length), trend: `${todayAppointments.length > 2 ? '+12%' : 'Active'}`, trendType: 'up', icon: Calendar, accent: 'blue' },
    { title: "Week Throughput", value: String(thisWeekAppointments.length), trend: 'View Schedule', trendType: 'alert', icon: Clock, accent: 'amber', delay: 100 },
    { title: 'Clinical Vault', value: String(patients.length), trend: 'Records State', trendType: 'up', icon: Users, accent: 'indigo', delay: 200 },
    { title: 'Active Alerts', value: '3', trend: 'Priority', trendType: 'alert', icon: AlertCircle, accent: 'rose', delay: 300 },
  ];

  return (
    <div className={cn('min-h-screen transition-colors', dark ? 'dark' : '')}>
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen p-8 lg:p-12 space-y-12 font-sans">

        {/* ── Top Bar ─────────────────────────────────────────────────── */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 animate-slide-up">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase">
              Hello, <span className="text-blue-600">Dr. Kavitha</span>
            </h1>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/10" />
                Medical Vault Sync Active
              </span>
              <span>·</span>
              {format(new Date(), 'EEEE, d MMM yyyy · HH:mm')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
               <input placeholder="Search Clinical Archive..." className="h-12 pl-12 pr-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase tracking-widest outline-none focus:border-blue-600 transition-all w-64 shadow-sm" />
            </div>
            <button className="relative w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-all shadow-sm">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white dark:border-slate-900" />
            </button>
            <button
              onClick={() => setDark(d => !d)}
              className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center hover:scale-105 transition-all shadow-premium"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* ── Hero Banner ─────────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 dark:bg-slate-950 p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between border-4 border-white dark:border-slate-800 shadow-2xl animate-scale-in">
          <div className="relative z-10 space-y-8 max-w-xl">
            <div className="inline-flex items-center gap-3 bg-blue-600/20 border border-blue-500/20 text-blue-300 text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.3em]">
              <Activity className="w-4 h-4 text-emerald-400" />
              Live Clinical Feed
            </div>
            <p className="text-white text-3xl lg:text-4xl font-black tracking-tight leading-[1.1]">
              You have{' '}
              <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">
                {todayAppointments.length || 4} patients
              </span>{' '}
              in queue today. All clinical systems optimized.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => window.location.href = '/nurse/appointments'}
                className="flex items-center gap-3 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest px-8 py-4.5 rounded-2xl hover:scale-105 transition-all shadow-vibrant"
              >
                <Users className="w-4 h-4" /> Global Directory
              </button>
              <button 
                onClick={() => window.location.href = '/doctor/appointments'}
                className="flex items-center gap-3 bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest px-8 py-4.5 rounded-2xl hover:bg-white/20 transition-all backdrop-blur-xl"
              >
                <Calendar className="w-4 h-4 text-blue-400" /> Medical Roster
              </button>
            </div>
          </div>
          <div className="hidden lg:flex flex-col items-center gap-4 relative z-10">
            <div className="w-32 h-32 rounded-[2.5rem] bg-white/5 border-2 border-white/10 flex items-center justify-center rotate-12 shadow-inner-soft group hover:rotate-0 transition-transform duration-700">
              <Stethoscope className="w-16 h-16 text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black px-6 py-2.5 rounded-full uppercase tracking-widest">
              <Heart className="w-4 h-4 animate-pulse" /> Vitals Unified
            </div>
          </div>
          {/* Abstract elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] -mb-40" />
        </div>

        {/* ── Stats Grid ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        {/* ── Secondary Layout ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Encounters */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-8 lg:p-10 shadow-premium">
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Clinical Queue</h2>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Clock className="w-3.5 h-3.5 text-blue-600" /> Real-time Encounter Flow
                </div>
              </div>
              <button onClick={() => navigate('/doctor/appointments')} className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] px-6 py-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
                Full Medical Roster
              </button>
            </div>

            <div className="space-y-6">
              {[
                { time: '09:00', name: 'Arjun Mehta', type: 'GENERAL', status: 'Active' },
                { time: '10:30', name: 'Priya Sharma', type: 'FOLLOW-UP', status: 'Pending' },
                { time: '12:00', name: 'Ravi Kumar', type: 'GENERAL', status: 'Pending' },
              ].map((item, i) => (
                <div key={i} onClick={() => navigate('/doctor/appointments')} className="group flex items-center gap-6 p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 hover:bg-white transition-all cursor-pointer shadow-sm hover:shadow-premium">
                  <div className="w-16 text-center border-r border-slate-200 dark:border-slate-800 pr-6 shrink-0">
                    <div className="text-base font-black text-slate-900 dark:text-white leading-none">{item.time}</div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">EST</div>
                  </div>
                  <Avatar name={item.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xl font-black text-slate-900 dark:text-white truncate tracking-tight uppercase leading-none mb-1.5">{item.name}</div>
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-black py-0.5 px-3 bg-blue-100 dark:bg-blue-900 text-blue-600 rounded-lg">{item.type}</span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identifier: MRN-2026-X84{i}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-blue-600 transition-all font-black" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-8">
            <div className="bg-slate-900 dark:bg-slate-800 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="relative z-10 space-y-8">
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">System Vitals</div>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                       <span className="text-[11px] font-bold text-slate-400 uppercase">Wait Time</span>
                       <span className="text-lg font-black tracking-tight">~12 Mins</span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                       <span className="text-[11px] font-bold text-slate-400 uppercase">Staff Ratio</span>
                       <span className="text-lg font-black tracking-tight">Optimal</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[11px] font-bold text-slate-400 uppercase">Vault Size</span>
                       <span className="text-lg font-black tracking-tight">1.2 TB</span>
                    </div>
                  </div>
                  <button onClick={() => window.alert('Diagnostic mode triggered.')} className="w-full py-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-vibrant group-hover:scale-105 transition-transform">
                    Diagnostic Report
                  </button>
               </div>
               <Activity className="absolute bottom-[-10%] right-[-10%] w-32 h-32 text-blue-600/10 group-hover:scale-110 transition-transform duration-700" />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 shadow-premium">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Rapid Actions</h3>
               <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Plus, label: 'Add Patient', color: 'text-emerald-500', action: () => navigate('/nurse/intake') },
                    { icon: FileText, label: 'Add Clinical Note', color: 'text-blue-500', action: () => navigate('/doctor/appointments') },
                    { icon: Zap, label: 'Emerg. Dispatch', color: 'text-rose-500', action: () => addToast({ type: 'warning', title: 'Dispatch Active', message: 'Medical emergency triggered.' }) },
                    { icon: Users, label: 'Consult Team', color: 'text-indigo-500', action: () => addToast({ type: 'info', title: 'Collaboration', message: 'Specialist team notified.' }) },
                  ].map((act, i) => (
                    <button 
                      key={i} 
                      onClick={act.action}
                      className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 hover:shadow-premium hover:-translate-y-1 transition-all"
                    >
                      <act.icon className={cn("w-6 h-6", act.color)} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center">{act.label}</span>
                    </button>
                  ))}
               </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
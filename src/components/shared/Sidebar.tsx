import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  UserPlus,
  Stethoscope,
  Settings,
  LogOut,
  ChevronRight,
  Activity,
  Heart,
  ShieldCheck,
  X
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/utils/helpers';

const Sidebar = () => {
  const { portalRole, setPortalRole, patients, isSidebarOpen, setSidebarOpen } = useStore();

  const nurseLinks = [
    { to: '/nurse/intake', icon: UserPlus, label: 'Patient Intake' },
    { to: '/nurse/appointments', icon: FileText, label: 'Appointments' },
    { to: '/nurse/appointments/new', icon: Calendar, label: 'Book Visit' }
  ];

  const doctorLinks = [
    { to: '/doctor/dashboard', icon: LayoutDashboard, label: 'Clinical Hub' },
    { to: '/doctor/appointments', icon: Calendar, label: 'Roster' },
    { to: '/doctor/patients', icon: Users, label: 'Vault' }
  ];

  const links = portalRole === 'nurse' ? nurseLinks : doctorLinks;

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed lg:sticky top-0 h-screen w-[280px] bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-500 z-[70]",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-8 pb-4">
          {/* Close button for mobile */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        {/* Brand Identity */}
        <div className="flex items-center gap-3.5 mb-12 group">
          <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-vibrant group-hover:rotate-6 group-hover:scale-105 transition-all duration-500">
            <Activity className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">EvoDoc</span>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mt-1">Advanced Portal</span>
          </div>
        </div>

        <nav className="space-y-1.5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-4 px-2 select-none">
            Main Menu
          </div>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group relative",
                  isActive 
                    ? "bg-white dark:bg-slate-900 text-blue-600 shadow-premium border border-slate-200 dark:border-slate-800" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:translate-x-1"
                )
              }
            >
              <div className="flex items-center gap-3.5">
                <link.icon className={cn("w-5 h-5 transition-all duration-300", "group-hover:text-blue-500")} />
                <span className="text-[13px] font-semibold tracking-tight">{link.label}</span>
              </div>
              <ChevronRight className={cn("w-3.5 h-3.5 transition-all opacity-0", "group-hover:opacity-100 group-hover:translate-x-0.5")} />
              
              {/* Active Indicator Dot */}
              <NavLink 
                to={link.to} 
                className={({ isActive }) => cn("absolute left-0 w-1 h-5 bg-blue-600 rounded-r-full transition-all duration-500", isActive ? "opacity-100" : "opacity-0")} 
              />
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-6">
        {/* Real-time Stats Cards */}
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-blue-500/30 transition-all">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Patients</span>
              <Users className="w-3.5 h-3.5 text-blue-500 opacity-50" />
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{patients.length}</div>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="bg-slate-200/50 dark:bg-slate-900/50 p-1 rounded-2xl flex gap-1 border border-slate-200/50 dark:border-slate-800/50">
          <button
            onClick={() => setPortalRole('nurse')}
            className={cn(
              "flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-500",
              portalRole === 'nurse' 
                ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            Nurse
          </button>
          <button
            onClick={() => setPortalRole('doctor')}
            className={cn(
              "flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-500",
              portalRole === 'doctor' 
                ? "bg-white dark:bg-slate-800 text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            Doctor
          </button>
        </div>

        {/* Profile Card */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-premium hover:border-blue-500/30 transition-all cursor-pointer group">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center font-bold text-xs text-white shadow-lg group-hover:scale-105 transition-transform">
                {portalRole === 'nurse' ? 'RP' : 'KI'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-slate-900 dark:text-white truncate tracking-tight">
                {portalRole === 'nurse' ? 'R. Preethi' : 'Dr. Kavitha Iyer'}
              </div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em] mt-0.5">
                {portalRole === 'nurse' ? 'Head Receptionist' : 'Senior Surgeon'}
              </div>
            </div>
            <LogOut className="w-4 h-4 text-slate-300 group-hover:text-rose-500 transition-colors" />
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
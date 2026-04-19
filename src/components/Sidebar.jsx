import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Stethoscope, ClipboardList, Calendar, Users, LayoutDashboard, Menu, X, Settings, LogOut, Activity
} from 'lucide-react';

const N_NAV = [
  { p:'/nurse/intake', l:'Patient Intake', ic:<ClipboardList size={18}/> },
  { p:'/nurse/registration', l:'Book Appointment', ic:<Calendar size={18}/> },
  { p:'/nurse/appointments', l:'Appointments', ic:<Calendar size={18}/> },
  { p:'/nurse/patients', l:'Patient Directory', ic:<Users size={18}/> },
];

const D_NAV = [
  { p:'/doctor/dashboard', l:'Dashboard', ic:<LayoutDashboard size={18}/> },
  { p:'/doctor/appointments', l:'Appointments', ic:<Calendar size={18}/> },
  { p:'/doctor/patients', l:'Patients', ic:<Users size={18}/> },
];

export function Sidebar({ portal }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = portal === 'nurse' ? N_NAV : D_NAV;
  const userInfo = portal === 'nurse'
    ? { nm:'R. Preethi', rl:'Head Receptionist', av:'RP' }
    : { nm:'Dr. Kavitha Iyer', rl:'Senior Physician', av:'KI' };

  return (
    <aside className="sb" style={{ 
      width: 280, 
      background: 'var(--gray-900)', 
      color: 'white',
      borderRight: '1px solid var(--gray-800)',
      boxShadow: 'var(--shadow-lg)'
    }}>
      <div className="sb-logo flex items-center gap-3 p-8 border-b border-gray-800">
        <div className="flex items-center justify-center" style={{ 
          width: 32, height: 32, background: 'var(--primary-500)', borderRadius: 6 
        }}>
          <Activity size={20} color="white" />
        </div>
        <div className="flex flex-col">
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.5 }}>EvoDoc</span>
          <span style={{ fontSize: 10, color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase' }}>Clinical OS</span>
        </div>
      </div>

      <div className={`sb-content flex-1 flex flex-col p-4 ${mobileOpen ? 'open' : ''}`}>
        <div className="mb-6 px-2">
          <div className="flex p-1 bg-gray-800 rounded-lg">
            <button 
              className={`flex-1 py-1.5 px-3 rounded-md transition-all text-xs font-semibold ${portal==='nurse' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
              onClick={() => navigate('/nurse/appointments')}
            >
              Nurse
            </button>
            <button 
              className={`flex-1 py-1.5 px-3 rounded-md transition-all text-xs font-semibold ${portal==='doctor' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
              onClick={() => navigate('/doctor/dashboard')}
            >
              Doctor
            </button>
          </div>
        </div>
        
        <nav className="flex flex-col gap-1">
          <div className="px-3 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Main Menu</div>
          {navItems.map(item => (
            <NavLink 
              key={item.p} 
              to={item.p}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${isActive ? 'bg-primary-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
              onClick={() => setMobileOpen(false)}
            >
              {item.ic}
              <span>{item.l}</span>
            </NavLink>
          ))}
        </nav>

        <nav className="flex flex-col gap-1 mt-8">
          <div className="px-3 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">System</div>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all text-sm font-medium border-none bg-none pointer">
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all text-sm font-medium border-none bg-none pointer" onClick={() => navigate('/')}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </nav>
        
        <div className="mt-auto p-4 bg-gray-800 rounded-xl flex items-center gap-3 border border-gray-700">
          <div className="u-av" style={{ 
            width: 40, height: 40, borderRadius: 10, background: 'var(--primary-500)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
          }}>
            {userInfo.av}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate" style={{ fontSize: 13, fontWeight: 600 }}>{userInfo.nm}</span>
            <span className="truncate" style={{ fontSize: 11, color: 'var(--gray-400)' }}>{userInfo.rl}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

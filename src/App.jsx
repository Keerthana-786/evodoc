import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  Stethoscope, Settings, User, LogOut, Info, X, Command, Search, Command as CommandIcon, 
  Sun, Moon, Activity, LayoutDashboard, Calendar, ClipboardList, Users 
} from 'lucide-react';

import { AppProvider, useAppContext } from './hooks/AppContext';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import { Sidebar } from './components/Sidebar';
import { Toaster, LoadingSpinner } from './components/UIComponents';

// Pages
import Dashboard from './pages/Dashboard';
import AppointmentList from './pages/AppointmentList';
import PatientIntake from './pages/PatientIntake';
import PatientDetails from './pages/PatientDetails';
import AppointmentRegistration from './pages/AppointmentRegistration';
import DoctorAppointments from './pages/Appointments';

function SmartSearch({ portal }) {
  const navigate = useNavigate();
  const { patients } = useAppContext();
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return patients.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.id.toString().includes(query)
    ).slice(0, 5);
  }, [query, patients]);

  return (
    <div className="relative" style={{ width: 400 }}>
      <div className="relative">
        <Search className="absolute" style={{ left: 12, top: 11, color: 'var(--gray-400)' }} size={16} />
        <input 
          className="w-full" 
          placeholder="Search patients, MRN (Cmd+K)..." 
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
          onFocus={() => setShowResults(true)}
          style={{ padding: '10px 40px', background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 10, outline: 'none', fontSize: 13 }}
        />
      </div>

      {showResults && query && (
        <>
          <div className="fixed inset-0" onClick={() => setShowResults(false)} style={{ zIndex: 40 }}></div>
          <div className="card absolute w-full mt-2 p-2 shadow-xl animate-in" style={{ zIndex: 50, background: 'white', border: '1px solid var(--gray-200)' }}>
            <div className="p-2" style={{ fontSize: 10, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Quick Results</div>
            {results.length > 0 ? (
              <div className="flex flex-col gap-1">
                {results.map(p => (
                  <div key={p.id} className="p-3 hover:bg-gray-50 pointer transition rounded-lg flex items-center justify-between" 
                    onClick={() => { navigate(portal === 'nurse' ? '/nurse/patients' : `/doctor/patient/${p.id}`); setShowResults(false); setQuery(''); }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>MRN-{p.id} • {p.age}y • {p.gender}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : <div className="p-4 text-center color-gray-400 text-xs">No matching patients found.</div>}
          </div>
        </>
      )}
    </div>
  );
}

function Layout({ portal }) {
  const navigate = useNavigate();
  const { addToast } = useAppContext();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [settings, setSettings] = useState({ darkMode: false });

  useKeyboardShortcuts([
    { key: 'k', action: () => { navigate(portal === 'nurse' ? '/nurse/patients' : '/doctor/patients'); }},
    { key: '/' , action: () => setShowShortcuts(true) },
    { key: 'Escape', action: () => setShowShortcuts(false) }
  ]);

  useEffect(() => {
    document.body.classList.toggle('dark', settings.darkMode);
  }, [settings.darkMode]);

  return (
    <div className="app flex w-full h-full relative" style={{ background: 'var(--gray-25)' }}>
      <Sidebar portal={portal} />
      
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="flex justify-between items-center px-8 border-b" style={{ height: 72, background: 'white' }}>
          <SmartSearch portal={portal} />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl border border-gray-100 mr-2">
               <button className={`p-2 rounded-lg transition-all border-none bg-none pointer ${!settings.darkMode ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400'}`} onClick={() => setSettings({ darkMode: false })}><Sun size={16} /></button>
               <button className={`p-2 rounded-lg transition-all border-none bg-none pointer ${settings.darkMode ? 'bg-gray-800 shadow-sm text-primary-400' : 'text-gray-400'}`} onClick={() => setSettings({ darkMode: true })}><Moon size={16} /></button>
            </div>
            <button className="p-2.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all border-none bg-none pointer" onClick={() => setShowShortcuts(true)}><Command size={20} /></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
        <Toaster />
      </main>

      {showShortcuts && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setShowShortcuts(false)}>
          <div className="card w-full max-w-sm p-6 bg-white shadow-2xl animate-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-6">
              <h3 className="m-0">Command Palette</h3>
              <X size={18} className="pointer text-gray-400" onClick={() => setShowShortcuts(false)} />
            </div>
            <div className="flex flex-col gap-2">
              {[
                { k: '⌘ + K', d: 'Global Patient Search' },
                { k: '⌘ + /', d: 'Keyboard Shortcut Help' },
                { k: '⌘ + N', d: 'Quick Registration' },
                { k: 'Esc', d: 'Exit / Dismiss' }
              ].map(s => (
                <div key={s.d} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{s.d}</span>
                  <kbd className="p-1 px-2 border rounded shadow-sm bg-white" style={{ fontSize: 11 }}>{s.k}</kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/doctor/dashboard" replace />} />
          
          <Route path="/nurse" element={<Layout portal="nurse" />}>
            <Route path="intake" element={<PatientIntake />} />
            <Route path="registration" element={<AppointmentRegistration />} />
            <Route path="appointments" element={<AppointmentList />} />
            <Route path="patients" element={<AppointmentList />} />
            <Route index element={<Navigate to="appointments" replace />} />
          </Route>

          <Route path="/doctor" element={<Layout portal="doctor" />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="patient/:id" element={<PatientDetails />} />
            <Route path="patients" element={<DoctorAppointments />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

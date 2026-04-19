import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Users, Clock, AlertCircle, TrendingUp, Activity, CheckCircle, Search, Plus, ExternalLink
} from 'lucide-react';
import { useAppContext } from '../hooks/AppContext';
import { formatDate, formatTime, getToday } from '../utils/helpers';
import { SkeletonLine } from '../components/UIComponents';

const AnimatedNumber = ({ value }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;
    let totalMiliseconds = 1000;
    let incrementTime = (totalMiliseconds / (end || 1));
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count}</span>;
};

const StatCard = ({ label, value, trend, icon: Icon, urgent = false }) => (
  <div className={`card p-6 relative hover-lift transition-all ${urgent ? 'border-danger-500' : ''}`} style={{ background: 'white' }}>
    <div className="flex justify-between items-start mb-4">
      <div style={{ 
        width: 40, height: 40, borderRadius: 10, 
        background: urgent ? 'var(--danger-50)' : 'var(--primary-50)',
        color: urgent ? 'var(--danger-500)' : 'var(--primary-500)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={20} />
      </div>
      {trend && (
        <div className="flex items-center gap-1" style={{ fontSize: 12, color: trend > 0 ? 'var(--accent-500)' : 'var(--danger-500)', fontWeight: 600 }}>
          <TrendingUp size={12} style={{ transform: trend > 0 ? 'none' : 'rotate(180deg)' }} />
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>
      <AnimatedNumber value={value} />
    </div>
    <div style={{ fontSize: 13, color: 'var(--gray-500)', fontWeight: 500 }}>{label}</div>
  </div>
);

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { appointments, patients, addToast } = useAppContext();
  const today = getToday();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const doctorAppts = useMemo(() => appointments.filter(a => a.doctorId === 1), [appointments]);
  const todayAppts = useMemo(() => 
    doctorAppts.filter(a => a.date === today).sort((a,b) => a.time.localeCompare(b.time)),
    [doctorAppts, today]
  );
  
  const stats = useMemo(() => ({
    todayTotal: todayAppts.length,
    completedToday: todayAppts.filter(a => a.status === 'completed').length,
    urgentCount: todayAppts.filter(a => a.type.toLowerCase().includes('urgent')).length,
    patientVolume: new Set(doctorAppts.map(a => a.patientId)).size
  }), [todayAppts, doctorAppts]);

  const recentActivity = useMemo(() => 
    doctorAppts.slice(0, 5).sort((a,b) => new Date(b.date) - new Date(a.date)),
    [doctorAppts]
  );

  if (loading) return (
    <div className="p-8">
      <SkeletonLine width="300px" height="40px" className="mb-8" />
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[1,2,3,4].map(i => <SkeletonLine key={i} width="100%" height="150px" />)}
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2"><SkeletonLine width="100%" height="400px" /></div>
        <div><SkeletonLine width="100%" height="400px" /></div>
      </div>
    </div>
  );

  return (
    <div className="pe animate-in p-8" style={{ background: 'var(--gray-25)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="m-0" style={{ fontSize: 28, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>
              Good morning, Dr. Kavitha
            </h1>
            <p className="m-0" style={{ fontSize: 15, color: 'var(--gray-500)' }}>
              Clinic throughput is normal today. You have {stats.todayTotal} patients scheduled.
            </p>
          </div>
          <div className="flex gap-3">
             <button className="btn btn-s" onClick={() => navigate('/doctor/patients')}><Search size={18} /> Directory</button>
             <button className="btn btn-p" onClick={() => navigate('/doctor/appointments')}><Clock size={18} /> Schedule</button>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-6 mb-10">
          <StatCard label="Patients Today" value={stats.todayTotal} trend={8} icon={Calendar} />
          <StatCard label="Completed Visits" value={stats.completedToday} trend={12} icon={CheckCircle} />
          <StatCard label="Unique Patients" value={stats.patientVolume} trend={-2} icon={Users} />
          <StatCard label="Urgent Cases" value={stats.urgentCount} icon={AlertCircle} urgent={stats.urgentCount > 0} />
        </div>

        <div className="grid grid-cols-3 gap-10">
          <div className="col-span-2">
            <h2 className="mb-6 flex items-center gap-2" style={{ fontSize: 18, fontWeight: 600 }}>
              <Clock size={20} color="var(--primary-600)" /> Today's Timeline
            </h2>
            <div className="card p-8 relative overflow-hidden" style={{ background: 'white' }}>
              <div style={{ position: 'absolute', left: 45, top: 0, bottom: 0, width: 2, background: 'var(--gray-100)' }} />
              {todayAppts.length > 0 ? todayAppts.map(a => (
                <div key={a.id} className="flex gap-8 relative pb-10 last:pb-0">
                  <div style={{ width: 60, fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', paddingTop: 18 }}>{formatTime(a.time)}</div>
                  <div style={{ 
                    width: 12, height: 12, borderRadius: '50%', background: 'white', border: '3px solid var(--primary-500)',
                    position: 'absolute', left: 40, top: 18, zIndex: 2
                  }} />
                  <div className="card flex-1 p-4 hover-lift transition pointer flex justify-between items-center" onClick={() => navigate('/doctor/patient/' + a.patientId)}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{a.patient}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{a.type}</div>
                    </div>
                    <div style={{ 
                      padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                      background: a.status === 'completed' ? 'var(--accent-50)' : 'var(--primary-50)',
                      color: a.status === 'completed' ? 'var(--accent-600)' : 'var(--primary-600)'
                    }}>
                      {a.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 color-gray-400">
                   <Activity size={40} className="mb-4 opacity-10" />
                   <div>No clinical sessions scheduled for today.</div>
                </div>
              )}
            </div>
          </div>

          <div>
             <h2 className="mb-6" style={{ fontSize: 18, fontWeight: 600 }}>Clinical Feed</h2>
             <div className="flex flex-col gap-3">
               {recentActivity.map(a => (
                 <div key={a.id} className="card p-4 hover-lift transition border-none shadow-sm flex gap-3 items-center pointer" onClick={() => navigate('/doctor/patient/' + a.patientId)}>
                   <div className="u-av" style={{ width: 36, height: 36, fontSize: 12, borderRadius: 10, background: 'var(--gray-100)', color: 'var(--gray-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     {a.patient.split(' ').map(n=>n[0]).join('')}
                   </div>
                   <div className="flex-1 overflow-hidden">
                     <div className="truncate" style={{ fontWeight: 600, fontSize: 14 }}>{a.patient}</div>
                     <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>Visit {formatDate(a.date)}</div>
                   </div>
                   <ExternalLink size={14} color="var(--gray-300)" />
                 </div>
               ))}
             </div>

             <div className="card mt-8 p-6 bg-primary-600 text-white border-none shadow-lg">
               <h3 className="m-0 mb-2" style={{ fontSize: 16, fontWeight: 700 }}>Hospital Announcements</h3>
               <p style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.5, marginBottom: 20 }}>New diagnostic protocols for COVID-24 variations are now effective. Please review section 4.2.</p>
               <button className="btn w-full bg-white text-primary-600 font-bold border-none">View Protocol</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
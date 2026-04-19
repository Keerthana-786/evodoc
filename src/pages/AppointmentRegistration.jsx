import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  User, Search, Stethoscope, Calendar, Clock, 
  Check, X, ChevronRight, Info, AlertCircle 
} from 'lucide-react';
import { useAppContext } from '../hooks/AppContext';
import { formatDate, formatTime } from '../utils/helpers';
import { SkeletonLine } from '../components/UIComponents';

export default function AppointmentRegistration() {
  const { patients, doctors, appointments, addAppointment, addToast } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ patientId: '', doctorId: '', date: new Date().toISOString().split('T')[0], time: '', type: 'Consultation', notes: '' });
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const filteredPatients = useMemo(() => {
    if (!search.trim()) return patients.slice(0, 5);
    return patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [patients, search]);

  const selectedPatient = useMemo(() => patients.find(p => p.id === form.patientId), [patients, form.patientId]);
  const selectedDoctor = useMemo(() => doctors.find(d => d.id === form.doctorId), [doctors, form.doctorId]);

  const timeSlots = useMemo(() => {
    if (!selectedDoctor) return [];
    const booked = appointments.filter(a => a.doctorId === selectedDoctor.id && a.date === form.date).map(a => a.time);
    return (selectedDoctor.slots || []).map(s => ({ time: s, booked: booked.includes(s) }));
  }, [selectedDoctor, form.date, appointments]);

  const handleSubmit = () => {
    addAppointment({ ...form, id: Date.now(), patient: selectedPatient.name, doctor: selectedDoctor.name, status: 'scheduled' });
    addToast('Appointment scheduled successfully', 'success');
    setShowConfirm(false);
    setForm({ patientId: '', doctorId: '', date: new Date().toISOString().split('T')[0], time: '', type: 'Consultation', notes: '' });
    setSearch('');
  };

  if (loading) return <div className="p-8"><SkeletonLine width="100%" height="600px" /></div>;

  return (
    <div className="pe animate-in p-8" style={{ background: 'var(--gray-25)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <header className="mb-10 text-center">
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--gray-900)' }}>Clinical Scheduling</h1>
          <p style={{ color: 'var(--gray-500)' }}>Coordinate patient visits with specialist availability.</p>
        </header>

        <div className="grid grid-cols-3 gap-10">
          <div className="col-span-2 flex flex-col gap-8">
            {/* Step 1: Patient */}
            <section className="card p-8 bg-white">
              <h3 className="flex items-center gap-2 mb-6" style={{ fontSize: 16, fontWeight: 700 }}>
                <div className="bg-primary-50 text-primary-600 rounded-lg p-2"><User size={18} /></div>
                 1. Select Patient
              </h3>
              <div className="relative">
                <input 
                  className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-primary-500 transition-all pl-12"
                  placeholder="Type name to search MRN database..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                />
                <Search className="absolute left-4 top-4 text-gray-400" size={20} />
                {showDropdown && (
                  <div className="absolute w-full mt-2 bg-white border rounded-xl shadow-xl z-10" ref={dropdownRef}>
                    {filteredPatients.map(p => (
                      <div key={p.id} className="p-4 hover:bg-gray-50 pointer transition flex justify-between items-center first:rounded-t-xl last:rounded-b-xl" onClick={() => { setForm(prev=>({...prev, patientId: p.id})); setSearch(p.name); setShowDropdown(false); }}>
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                        <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>MRN-{p.id}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Step 2: Doctor & Time */}
            <section className="card p-8 bg-white">
               <h3 className="flex items-center gap-2 mb-6" style={{ fontSize: 16, fontWeight: 700 }}>
                <div className="bg-primary-50 text-primary-600 rounded-lg p-2"><Stethoscope size={18} /></div>
                 2. Clinical Resources
              </h3>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Specialist</label>
                  <select className="w-full p-3 border border-gray-200 rounded-xl outline-none" value={form.doctorId} onChange={(e) => setForm(prev=>({...prev, doctorId: parseInt(e.target.value)}))}>
                    <option value="">Choose physician...</option>
                    {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)}
                  </select>
                </div>
                <div>
                   <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Date</label>
                   <input type="date" className="w-full p-3 border border-gray-200 rounded-xl outline-none" value={form.date} onChange={(e) => setForm(prev=>({...prev, date: e.target.value}))} />
                </div>
              </div>

              {selectedDoctor && (
                <div className="animate-in">
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-4 block">Available Slots</label>
                  <div className="grid grid-cols-4 gap-3">
                    {timeSlots.map(s => (
                       <button 
                        key={s.time}
                        disabled={s.booked}
                        className={`p-3 rounded-lg border font-bold text-xs transition-all ${s.booked ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' : form.time === s.time ? 'bg-primary-600 text-white border-primary-600 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:border-primary-500'}`}
                        onClick={() => setForm(prev => ({ ...prev, time: s.time }))}
                       >
                         {formatTime(s.time)}
                       </button>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Checkout Column */}
          <aside>
            <div className="card p-6 bg-gray-900 text-white sticky top-8 shadow-2xl">
              <h3 className="m-0 mb-6 flex items-center justify-between">
                Booking Preview
                <div className="w-2 h-2 rounded-full bg-accent-500 blink" />
              </h3>
              
              <div className="flex flex-col gap-6 mb-8">
                 <div className="flex flex-col gap-1 border-l-2 border-primary-500 pl-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Patient</span>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{selectedPatient?.name || '---'}</span>
                 </div>
                 <div className="flex flex-col gap-1 border-l-2 border-primary-500 pl-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Provider</span>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{selectedDoctor?.name || '---'}</span>
                 </div>
                 <div className="flex flex-col gap-1 border-l-2 border-primary-500 pl-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Schedule</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{form.date ? formatDate(form.date) : '---'} @ {form.time ? formatTime(form.time) : '--:--'}</span>
                 </div>
              </div>

              <div className="p-4 bg-gray-800 rounded-xl mb-8 flex justify-between items-center">
                 <span className="text-gray-400 text-xs">Clinical Fee</span>
                 <span className="text-xl font-bold">₹850.00</span>
              </div>

              <button 
                className="btn btn-p w-full py-4 text-base"
                disabled={!form.patientId || !form.doctorId || !form.time}
                style={{ opacity: (form.patientId && form.doctorId && form.time) ? 1 : 0.5 }}
                onClick={() => setShowConfirm(true)}
              >
                Confirm Session <ChevronRight size={18} />
              </button>
            </div>
          </aside>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          <div className="card w-full max-w-lg p-8 bg-white shadow-2xl animate-in text-center">
            <div className="w-16 h-16 bg-accent-50 text-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={32} />
            </div>
            <h2 className="m-0 mb-4">Validate Booking</h2>
            <p className="text-gray-500 mb-8 px-6">You are scheduling a <b>{form.type}</b> with <b>{selectedDoctor.name}</b> for <b>{selectedPatient.name}</b>. Proceed?</p>
            <div className="flex gap-4">
              <button className="btn btn-s flex-1 justify-center py-3" onClick={() => setShowConfirm(false)}>Review Details</button>
              <button className="btn btn-p flex-1 justify-center py-3" onClick={handleSubmit}>Schedule Appointment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

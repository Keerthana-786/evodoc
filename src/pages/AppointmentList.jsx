import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Edit, 
  X, 
  CheckCircle,
  Clock,
  User,
  Stethoscope,
  MoreVertical,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { useAppContext } from '../hooks/AppContext';
import { formatDate, formatTime } from '../utils/helpers';
import { SkeletonLine } from '../components/UIComponents';

export default function AppointmentList() {
  const navigate = useNavigate();
  const { appointments, updateAppointmentStatus, patients, doctors, addToast } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  }, []);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const [expandedId, setExpandedId] = useState(null);
  const [cancellingAppt, setCancellingAppt] = useState(null);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      const matchSearch = (a.patient && a.patient.toLowerCase().includes(search.toLowerCase())) || 
                          (a.doctor && a.doctor.toLowerCase().includes(search.toLowerCase())) ||
                          (a.id && a.id.toLowerCase().includes(search.toLowerCase()));
      
      const matchStatus = statusFilter.length === 0 || statusFilter.includes(a.status);
      const matchDoctor = doctorFilter === 'all' || a.doctorId === doctorFilter;
      
      let matchDate = true;
      if (dateRange.start) matchDate = matchDate && a.date >= dateRange.start;
      if (dateRange.end) matchDate = matchDate && a.date <= dateRange.end;
      
      return matchSearch && matchStatus && matchDoctor && matchDate;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [appointments, search, statusFilter, doctorFilter, dateRange]);

  const toggleStatusFilter = (status) => {
    setStatusFilter(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleCancel = (id) => {
    updateAppointmentStatus(id, 'cancelled');
    setCancellingAppt(null);
    addToast('Appointment cancelled successfully', 'success');
  };

  const activeFilters = useMemo(() => {
    const list = [];
    statusFilter.forEach(s => list.push({ type: 'status', label: s.charAt(0).toUpperCase() + s.slice(1), value: s }));
    if (doctorFilter !== 'all') {
      const doc = doctors.find(d => d.id === doctorFilter);
      list.push({ type: 'doctor', label: `Dr. ${doc?.name || 'Selected'}`, value: doctorFilter });
    }
    if (dateRange.start) list.push({ type: 'date', label: `From: ${dateRange.start}`, value: 'start' });
    if (dateRange.end) list.push({ type: 'date', label: `To: ${dateRange.end}`, value: 'end' });
    return list;
  }, [statusFilter, doctorFilter, dateRange, doctors]);

  return (
    <div className="cont">
      <header style={{ marginBottom: '32px' }}>
        <h1 className="pg-t" style={{ fontSize: "24px" }}>Appointment Registry</h1>
        <p className="pg-s">A comprehensive view of all clinical schedules and patient visits</p>
      </header>

      {/* FILTER BAR */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="sw" style={{ flex: 1, minWidth: '300px' }}>
            <Search className="s-ic2" size={18} />
            <input 
              className="si" 
              placeholder="Live search by patient or doctor..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: "var(--radius-md)" }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['scheduled', 'completed', 'cancelled'].map(s => (
              <button 
                key={s}
                onClick={() => toggleStatusFilter(s)}
                style={{
                  padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                  border: '1.5px solid var(--border-light)',
                  background: statusFilter.includes(s) ? 'var(--accent-color)' : '#fff',
                  color: statusFilter.includes(s) ? '#fff' : 'var(--tx-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <select 
            className="fi" 
            style={{ width: '200px', padding: '10px', borderRadius: '8px' }}
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
          >
            <option value="all">All Doctors</option>
            {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Calendar size={16} color="var(--tx-muted)" />
            <input
              type="date"
              className="fi"
              style={{ width: '140px', padding: '8px 12px', borderRadius: '8px' }}
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              placeholder="From date"
            />
            <span style={{ color: 'var(--tx-muted)', fontSize: '12px' }}>to</span>
            <input
              type="date"
              className="fi"
              style={{ width: '140px', padding: '8px 12px', borderRadius: '8px' }}
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              placeholder="To date"
            />
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
            {activeFilters.map((f, i) => (
              <span key={i} style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', 
                background: 'var(--accent-light)', color: 'var(--accent-color)', borderRadius: '6px', fontSize: '12px', fontWeight: '700'
              }}>
                {f.label}
                <X size={14} style={{ cursor: 'pointer' }} onClick={() => {
                  if (f.type === 'status') toggleStatusFilter(f.value);
                  if (f.type === 'doctor') setDoctorFilter('all');
                  if (f.value === 'start') setDateRange(prev => ({ ...prev, start: '' }));
                  if (f.value === 'end') setDateRange(prev => ({ ...prev, end: '' }));
                }} />
              </span>
            ))}
            <button 
              onClick={() => { setStatusFilter([]); setDoctorFilter('all'); setDateRange({ start: '', end: '' }); }}
              style={{ fontSize: '12px', fontWeight: '800', color: 'var(--tx-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* DATA TABLE */}
      {loading ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex gap-4 p-6 border-b" style={{ borderColor: '#f3f4f6' }}>
              <SkeletonLine width="48px" height="48px" style={{ borderRadius: '50%' }} />
              <div style={{ flex: 1 }}>
                <SkeletonLine width="200px" height="18px" />
                <SkeletonLine width="150px" height="12px" />
              </div>
              <SkeletonLine width="100px" height="32px" style={{ borderRadius: 20 }} />
            </div>
          ))}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="card text-center p-6" style={{ padding: '100px 40px' }}>
          <div className="flex items-center justify-center mx-auto mb-4" style={{ width: 64, height: 64, borderRadius: '50%', background: '#f8fafc', color: '#94a3b8' }}>
            <Calendar size={32} />
          </div>
          <h3 className="m-0" style={{ fontSize: 20, fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>No Appointments Found</h3>
          <p className="m-0 mx-auto" style={{ color: '#64748b', fontSize: 14, maxWidth: 300 }}>No schedules match your current filters. Try adjusting your search or date criteria.</p>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden', border: '1.5px solid var(--border-light)' }}>
          <div className="tbl-w" style={{ border: 'none' }}>
            <table style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <tr>
                  <th style={{ background: '#f8fafc', padding: '16px 24px' }}>Patient</th>
                  <th style={{ background: '#f8fafc' }}>Doctor</th>
                  <th style={{ background: '#f8fafc' }}>Date</th>
                  <th style={{ background: '#f8fafc' }}>Time</th>
                  <th style={{ background: '#f8fafc' }}>Type</th>
                  <th style={{ background: '#f8fafc' }}>Status</th>
                  <th style={{ background: '#f8fafc', width: '60px' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? filteredAppointments.map(a => (
                  <React.Fragment key={a.id}>
                    <tr className={expandedId === a.id ? 'active' : ''}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px' }}>
                            {a.patient.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div style={{ fontWeight: '600' }}>{a.patient}</div>
                        </div>
                      </td>
                      <td>{a.doctor}</td>
                      <td>{formatDate(a.date)}</td>
                      <td>{formatTime(a.time)}</td>
                      <td>{a.type}</td>
                      <td>
                        <div style={{ 
                          padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', 
                          background: a.status === 'completed' ? 'var(--success-bg)' : a.status === 'cancelled' ? 'var(--error-bg)' : 'var(--warning-bg)',
                          color: a.status === 'completed' ? 'var(--success)' : a.status === 'cancelled' ? 'var(--error)' : 'var(--warning)',
                          display: 'inline-block'
                        }}>
                          {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                        <button 
                          className="ic-b" 
                          onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                          style={{ background: expandedId === a.id ? '#f1f5f9' : 'none' }}
                        >
                          {expandedId === a.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </td>
                    </tr>
                    {expandedId === a.id && (
                      <tr className="expanded">
                        <td colSpan="7" style={{ padding: '24px', background: '#f8fafc', borderBottom: '1.5px solid var(--border-light)' }}>
                          <div style={{ display: 'flex', gap: '32px' }}>
                             <div style={{ flex: 1 }}>
                               <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--tx-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Appointment Notes</div>
                               <div style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--tx-primary)', background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                 {a.notes || "No clinical notes provided for this appointment."}
                               </div>
                             </div>
                             <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--tx-muted)', textTransform: 'uppercase' }}>Quick Actions</div>
                                {a.status === 'scheduled' && (
                                  <>
                                    <button 
                                      className="btn btn-p sm" 
                                      style={{ width: '100%', height: '36px' }}
                                      onClick={() => updateAppointmentStatus(a.id, 'completed')}
                                    >
                                      Mark Completed
                                    </button>
                                    <button 
                                      className="btn btn-s sm" 
                                      style={{ width: '100%', height: '36px', color: 'var(--error)' }}
                                      onClick={() => setCancellingAppt(a)}
                                    >
                                      Cancel Appointment
                                    </button>
                                  </>
                                )}
                                <button 
                                  className="btn btn-s sm" 
                                  style={{ height: '32px', gap: '4px' }}
                                  onClick={() => navigate('/nurse/patients')}
                                >
                                  View Patient Detail <ArrowRight size={14} />
                                </button>
                             </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )) : null}
              </tbody>
            </table>
          </div>
          
          {/* FOOTER */}
          <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1.5px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--tx-secondary)' }}>
              Showing {filteredAppointments.length} appointments
            </div>
            <div style={{ fontSize: '13px', color: 'var(--tx-muted)' }}>
              Total in system: {appointments.length}
            </div>
          </div>
        </div>
      )}

      {/* CANCEL MODAL */}
      {cancellingAppt && (
        <div className="ov">
          <div className="md" style={{ width: '400px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
               <AlertTriangle size={48} color="var(--error)" style={{ marginBottom: '16px' }} />
               <h3 className="md-t">Cancel Appointment?</h3>
               <p className="md-b">Are you sure you want to cancel {cancellingAppt.patient}'s appointment with {cancellingAppt.doctor}? This cannot be undone.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-s" style={{ flex: 1 }} onClick={() => setCancellingAppt(null)}>No, Keep It</button>
              <button className="btn btn-p" style={{ flex: 1, background: 'var(--error)' }} onClick={() => handleCancel(cancellingAppt.id)}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

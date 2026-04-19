import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, Clock, MapPin, Tag, CheckSquare, XSquare, MessageSquare, Phone, Mail, User, Edit, X, Check, AlertCircle, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppContext } from '../hooks/AppContext';
import { formatDate, formatTime, getToday } from '../utils/helpers';

export default function DoctorAppointments() {
  const navigate = useNavigate();
  const { appointments, doctors, patients, addToast, updateAppointmentStatus, updateAppointment } = useAppContext();
  const currentDoctor = doctors[0];

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [statusFilter, setStatusFilter] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [expandedCards, setExpandedCards] = useState(new Set());

  const toggleStatusFilter = (s) => setStatusFilter(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const toggleCardExpansion = (appointmentId) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(appointmentId)) {
        newSet.delete(appointmentId);
      } else {
        newSet.add(appointmentId);
      }
      return newSet;
    });
  };

  const stats = useMemo(() => {
    const isUpcoming = (a) => a.date >= getToday() && a.status === 'scheduled';
    const isPast = (a) => a.date < getToday() || a.status !== 'scheduled';
    const todayCount = appointments.filter(a => a.doctorId === currentDoctor?.id && a.date === getToday()).length;
    const thisWeekCount = appointments.filter(a => {
      const apptDate = new Date(a.date);
      const today = new Date();
      const weekFromNow = new Date(today);
      weekFromNow.setDate(today.getDate() + 7);
      return a.doctorId === currentDoctor?.id && apptDate >= today && apptDate <= weekFromNow && a.status === 'scheduled';
    }).length;

    return {
      upcoming: appointments.filter(a => a.doctorId === currentDoctor?.id && isUpcoming(a)).length,
      past: appointments.filter(a => a.doctorId === currentDoctor?.id && isPast(a)).length,
      today: todayCount,
      thisWeek: thisWeekCount
    };
  }, [appointments, currentDoctor]);

  const filtered = useMemo(() => {
    let appts = appointments.filter(a => a.doctorId === currentDoctor?.id);

    // Sort logic
    appts = appts.sort((a,b) => {
      const d = new Date(a.date) - new Date(b.date);
      if (d !== 0) return d;
      return a.time.localeCompare(b.time);
    });

    if (activeTab === 'upcoming') {
      appts = appts.filter(a => a.date >= getToday() && a.status === 'scheduled');
    } else if (activeTab === 'today') {
      appts = appts.filter(a => a.date === getToday());
    } else {
      appts = appts.filter(a => a.date < getToday() || a.status !== 'scheduled').reverse();
    }

    if (search) {
      appts = appts.filter(a => a.patient.toLowerCase().includes(search.toLowerCase()));
    }

    if (statusFilter.length > 0) {
      appts = appts.filter(a => statusFilter.includes(a.status));
    }

    return appts;
  }, [appointments, currentDoctor, activeTab, search, statusFilter]);

  const handleAppointmentAction = (action, appointment) => {
    switch (action) {
      case 'complete':
        updateAppointmentStatus(appointment.id, 'completed');
        addToast(`Appointment with ${appointment.patient} marked as completed`, 'success');
        break;
      case 'cancel':
        updateAppointmentStatus(appointment.id, 'cancelled');
        addToast(`Appointment with ${appointment.patient} cancelled`, 'warning');
        break;
      case 'reschedule':
        addToast('Opening reschedule dialog...', 'info');
        break;
      case 'notes':
        setSelectedAppointment(appointment);
        setAppointmentNotes(appointment.notes || '');
        setShowAppointmentModal(true);
        break;
      default:
        break;
    }
  };

  const saveAppointmentNotes = () => {
    if (selectedAppointment) {
      updateAppointment(selectedAppointment.id, { notes: appointmentNotes });
      addToast('Appointment notes updated successfully', 'success');
      setShowAppointmentModal(false);
      setSelectedAppointment(null);
      setAppointmentNotes('');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'scheduled': return '#eff6ff';
      case 'completed': return '#f0fdf4';
      case 'cancelled': return '#fef2f2';
      default: return '#f9fafb';
    }
  };

  const getPatientInfo = (appointment) => {
    return patients.find(p => p.id === appointment.patientId) || {};
  };

  return (
    <div className="pe">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{
          background: 'var(--accent-color)',
          borderRadius: "var(--radius-xl)",
          padding: '40px',
          marginBottom: '40px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-5%',
            width: '150px',
            height: '150px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '50%',
            filter: 'blur(30px)'
          }}></div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}>
                <Calendar size={32} />
              </div>
              <div>
                <h1 style={{ fontSize: "24px", fontWeight: '700', margin: 0, marginBottom: '4px' }}>
                  Schedule Management
                </h1>
                <p style={{ fontSize: '16px', opacity: 0.9, margin: 0 }}>
                  {currentDoctor?.specialty || 'Medical Professional'} • Manage your clinical appointments
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: "var(--radius-md)",
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>{stats.today}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Today</div>
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: "var(--radius-md)",
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>{stats.thisWeek}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>This Week</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div style={{
          background: 'white',
          borderRadius: "var(--radius-lg)",
          padding: '24px',
          marginBottom: '32px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
              <input
                type="text"
                placeholder="Search by patient name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {['scheduled', 'completed', 'cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => toggleStatusFilter(status)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: "var(--radius-xl)",
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    border: `2px solid ${statusFilter.includes(status) ? getStatusColor(status) : '#e5e7eb'}`,
                    background: statusFilter.includes(status) ? getStatusBg(status) : 'white',
                    color: statusFilter.includes(status) ? getStatusColor(status) : '#6b7280',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {status === 'scheduled' && <Clock size={14} />}
                  {status === 'completed' && <CheckSquare size={14} />}
                  {status === 'cancelled' && <XSquare size={14} />}
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '32px', position: 'relative' }}>
            {[
              { key: 'upcoming', label: 'Upcoming', count: stats.upcoming },
              { key: 'today', label: 'Today', count: stats.today },
              { key: 'past', label: 'Past', count: stats.past }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '12px 0',
                  background: 'none',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: activeTab === tab.key ? 'var(--accent-color)' : '#6b7280',
                  transition: 'color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {tab.label}
                <span style={{
                  background: activeTab === tab.key ? 'var(--accent-light)' : '#f3f4f6',
                  color: activeTab === tab.key ? 'var(--accent-color)' : '#6b7280',
                  padding: '2px 8px',
                  borderRadius: "var(--radius-md)",
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {tab.count}
                </span>
              </button>
            ))}

            <div style={{
              position: 'absolute',
              bottom: 0,
              left: activeTab === 'upcoming' ? 0 : activeTab === 'today' ? '140px' : '240px',
              width: '80px',
              height: '3px',
              background: 'var(--accent-color)',
              transition: 'all 0.3s ease',
              borderRadius: '3px 3px 0 0'
            }} />
          </div>
        </div>

        {/* Appointments List */}
        <div style={{ display: 'grid', gap: '16px' }}>
          {filtered.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              background: 'white',
              borderRadius: "var(--radius-lg)",
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              color: '#6b7280'
            }}>
              <Calendar size={64} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                {activeTab === 'upcoming' ? 'No Upcoming Appointments' :
                 activeTab === 'today' ? 'No Appointments Today' : 'No Past Appointments'}
              </div>
              <div>Time to focus on patient care or administrative tasks!</div>
            </div>
          ) : (
            filtered.map(appointment => {
              const patientInfo = getPatientInfo(appointment);
              const isExpanded = expandedCards.has(appointment.id);
              const isToday = appointment.date === getToday();

              return (
                <div
                  key={appointment.id}
                  style={{
                    background: 'white',
                    borderRadius: "var(--radius-lg)",
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: isToday ? '2px solid var(--accent-color)' : '1px solid #e5e7eb',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  {/* Main Appointment Card */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr auto',
                    padding: '24px',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleCardExpansion(appointment.id)}
                  >
                    {/* Time Slot */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isToday ? 'var(--accent-light)' : '#f8fafc',
                      borderRadius: "var(--radius-md)",
                      padding: '16px'
                    }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: isToday ? 'var(--accent-color)' : 'var(--bg-dark)',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {formatTime(appointment.time)}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        marginTop: '4px',
                        textTransform: 'uppercase'
                      }}>
                        {isToday ? 'Today' : formatDate(appointment.date).split(' ')[0]}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: '#9ca3af',
                        marginTop: '2px'
                      }}>
                        {formatDate(appointment.date)}
                      </div>
                    </div>

                    {/* Patient Info */}
                    <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div 
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'var(--accent-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            fontWeight: '700',
                            color: 'var(--accent-color)',
                            cursor: 'pointer'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/doctor/patient/' + appointment.patientId);
                          }}
                        >
                          {appointment.patient.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                          <div 
                            style={{ fontSize: '18px', fontWeight: '600', color: 'var(--bg-dark)', cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/doctor/patient/' + appointment.patientId);
                            }}
                          >
                            {appointment.patient}
                          </div>
                          <div style={{ fontSize: '14px', color: '#6b7280' }}>
                            {appointment.type}
                          </div>
                        </div>
                        <div style={{
                          padding: '4px 12px',
                          borderRadius: "var(--radius-lg)",
                          fontSize: '12px',
                          fontWeight: '600',
                          background: getStatusBg(appointment.status),
                          color: getStatusColor(appointment.status)
                        }}>
                          {appointment.status}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MessageSquare size={14} />
                          {appointment.notes ? (appointment.notes.length > 50 ? appointment.notes.substring(0, 50) + '...' : appointment.notes) : 'No notes'}
                        </div>
                        {patientInfo.phone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Phone size={14} />
                            {patientInfo.phone}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAppointmentAction('notes', appointment);
                        }}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#f3f4f6',
                          cursor: 'pointer',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                        onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                      >
                        <Edit size={16} color="#6b7280" />
                      </button>

                      {activeTab === 'upcoming' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAppointmentAction('complete', appointment);
                            }}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              border: 'none',
                              background: '#10b981',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'background 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#059669'}
                            onMouseLeave={(e) => e.target.style.background = '#10b981'}
                          >
                            Complete
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAppointmentAction('cancel', appointment);
                            }}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              border: 'none',
                              background: '#ef4444',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'background 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                            onMouseLeave={(e) => e.target.style.background = '#ef4444'}
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {isExpanded ? <ChevronUp size={20} color="#6b7280" /> : <ChevronDown size={20} color="#6b7280" />}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div style={{
                      borderTop: '1px solid #e5e7eb',
                      padding: '24px',
                      background: '#f9fafb'
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                        {/* Patient Details */}
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--bg-dark)', marginBottom: '12px' }}>
                            Patient Information
                          </h4>
                          <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: '#6b7280' }}>Age:</span>
                              <span style={{ fontWeight: '500' }}>{patientInfo.age || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: '#6b7280' }}>Gender:</span>
                              <span style={{ fontWeight: '500' }}>{patientInfo.gender || 'N/A'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: '#6b7280' }}>Blood Type:</span>
                              <span style={{ fontWeight: '500' }}>{patientInfo.bloodType || 'N/A'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Appointment Details */}
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--bg-dark)', marginBottom: '12px' }}>
                            Appointment Details
                          </h4>
                          <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: '#6b7280' }}>Type:</span>
                              <span style={{ fontWeight: '500' }}>{appointment.type}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: '#6b7280' }}>Duration:</span>
                              <span style={{ fontWeight: '500' }}>30 minutes</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: '#6b7280' }}>Room:</span>
                              <span style={{ fontWeight: '500' }}>Consultation Room 1</span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--bg-dark)', marginBottom: '12px' }}>
                            Quick Actions
                          </h4>
                          <div style={{ display: 'grid', gap: '8px' }}>
                            <button
                              onClick={() => handleAppointmentAction('reschedule', appointment)}
                              style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid #e5e7eb',
                                background: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.borderColor = 'var(--accent-color)';
                                e.target.style.background = 'var(--accent-light)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.borderColor = '#e5e7eb';
                                e.target.style.background = 'white';
                              }}
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => {
                                // In a real app, this would navigate to patient details with the specific patient ID
                                addToast(`Viewing patient record for ${appointment.patient}`, 'info');
                              }}
                              style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid #e5e7eb',
                                background: 'white',
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.borderColor = 'var(--accent-color)';
                                e.target.style.background = 'var(--accent-light)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.borderColor = '#e5e7eb';
                                e.target.style.background = 'white';
                              }}
                            >
                              View Patient Record
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Appointment Notes Modal */}
        {showAppointmentModal && selectedAppointment && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              borderRadius: "var(--radius-lg)",
              padding: '32px',
              width: '500px',
              maxWidth: '90vw',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--bg-dark)', margin: 0 }}>
                  Appointment Notes
                </h3>
                <button
                  onClick={() => setShowAppointmentModal(false)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#f3f4f6',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} color="#6b7280" />
                </button>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--bg-dark)', marginBottom: '4px' }}>
                  {selectedAppointment.patient}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {formatDate(selectedAppointment.date)} at {formatTime(selectedAppointment.time)}
                </div>
              </div>

              <textarea
                value={appointmentNotes}
                onChange={(e) => setAppointmentNotes(e.target.value)}
                placeholder="Add notes about this appointment..."
                style={{
                  width: '100%',
                  height: '120px',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  onClick={() => setShowAppointmentModal(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    background: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveAppointmentNotes}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--accent-color)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
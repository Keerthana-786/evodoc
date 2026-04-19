import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Edit, Save, X, Plus, AlertTriangle, User, Calendar, 
  Heart, Activity, Thermometer, Pill, Download, TrendingUp 
} from 'lucide-react';
import { useAppContext } from '../hooks/AppContext';
import { formatDate, calculateAge } from '../utils/helpers';
import { SkeletonLine } from '../components/UIComponents';

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, appointments, getNotesByPatient, addNote, addToast } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  }, [id]);

  const patient = useMemo(() => {
    const pid = id ? parseInt(id) : patients[0]?.id;
    return patients.find(p => p.id === pid);
  }, [id, patients]);

  const notes = useMemo(() => (patient ? getNotesByPatient(patient.id) : []), [patient, getNotesByPatient]);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addNote({ patientId: patient.id, doctor: 'Dr. Kavitha Iyer', note: noteText });
    setNoteText('');
    setShowNoteModal(false);
    addToast('Clinical note added', 'success');
  };

  if (loading) return (
    <div className="pe p-8">
      <SkeletonLine width="300px" height="40px" className="mb-8" />
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2"><SkeletonLine width="100%" height="400px" /></div>
        <div><SkeletonLine width="100%" height="400px" /></div>
      </div>
    </div>
  );

  if (!patient) return <div className="p-20 text-center">Patient not found</div>;

  const VitalSignItem = ({ label, value, unit, percentage, icon: Icon, color }) => (
    <div className="flex flex-col gap-2 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2" style={{ fontSize: '13px', color: 'var(--gray-500)', fontWeight: 500 }}>
          <Icon size={14} /> {label}
        </div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-900)' }}>{value} <span style={{ fontWeight: 400, color: 'var(--gray-400)' }}>{unit}</span></div>
      </div>
      <div style={{ width: '100%', height: 6, background: 'var(--gray-100)', borderRadius: 10, overflow: 'hidden' }}>
        <div className="transition-all" style={{ width: `${percentage}%`, height: '100%', background: color, borderRadius: 10 }} />
      </div>
    </div>
  );

  return (
    <div className="pe animate-in p-8">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex gap-6 items-center">
            <div className="u-av" style={{ width: 80, height: 80, fontSize: 24, borderRadius: 20, background: 'var(--primary-600)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {patient.name?.split(' ').map(n=>n[0]).join('')}
            </div>
            <div>
              <h1 className="m-0" style={{ fontSize: 28, fontWeight: 700, color: 'var(--gray-900)' }}>{patient.name}</h1>
              <div className="flex gap-4 mt-2" style={{ color: 'var(--gray-500)', fontSize: 13 }}>
                <span>MRN-2024-{patient.id}</span>
                <span>•</span>
                <span>{calculateAge(patient.dob)}y • {patient.gender}</span>
                <span>•</span>
                <span style={{ color: 'var(--danger-600)', fontWeight: 700 }}>B.Group: {patient.blood}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-s" onClick={() => window.print()}><Download size={18} /> Export</button>
            <button className="btn btn-p"><Edit size={18} /> Edit Profile</button>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-10">
          {/* Main Info */}
          <div className="col-span-2">
            <div className="mb-10">
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>🫀 Vital Monitoring</h2>
              <div className="card grid grid-cols-2 gap-x-12 p-8" style={{ background: 'white' }}>
                 <VitalSignItem label="Normal range" value="120/80" unit="mmHg" percentage={75} icon={Activity} color="var(--primary-500)" />
                 <VitalSignItem label="Heart Rate" value="72" unit="bpm" percentage={65} icon={Heart} color="var(--danger-500)" />
                 <VitalSignItem label="Temperature" value="98.6" unit="°F" percentage={80} icon={Thermometer} color="var(--warning-500)" />
                 <VitalSignItem label="Oxygen Sat." value="98" unit="%" percentage={98} icon={TrendingUp} color="var(--accent-500)" />
              </div>
            </div>

            <div className="mb-10">
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>💊 Active Treatment</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="card p-4 hover-lift transition">
                  <div className="flex justify-between items-start mb-2">
                    <div style={{ fontWeight: 600 }}>Lisinopril 10mg</div>
                    <Pill size={16} color="var(--primary-500)" />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>⏰ Once daily (Morning)</div>
                </div>
                <div className="card p-4 hover-lift transition">
                  <div className="flex justify-between items-start mb-2">
                    <div style={{ fontWeight: 600 }}>Metformin 500mg</div>
                    <Pill size={16} color="var(--primary-500)" />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>⏰ Twice daily (Morn/Eve)</div>
                </div>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>📋 Recent Clinical Notes</h2>
              <div className="flex flex-col gap-4">
                {notes.slice(0, 3).map(n => (
                  <div key={n.id} className="card p-6 border-none shadow-sm" style={{ background: '#f8fafc' }}>
                    <div className="flex justify-between mb-2">
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{n.doctor}</span>
                      <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>{formatDate(n.date)}</span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.6, margin: 0 }}>{n.note}</p>
                  </div>
                ))}
                {notes.length === 0 && <div className="text-center py-10 color-gray-400 border-dashed border-2 rounded-lg">No clinical notes recorded.</div>}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {patient.allergies && patient.allergies !== 'None' && (
              <div className="card p-6 mb-8" style={{ background: 'var(--danger-50)', border: '1.5px solid var(--danger-500)' }}>
                <div className="flex items-center gap-2 mb-3 font-bold text-danger-600">
                  <AlertTriangle size={18} /> ALLERGY ADVISORY
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--danger-600)' }}>{patient.allergies}</div>
              </div>
            )}

            <div className="card p-6 mb-8">
              <h3 className="mt-0 mb-4" style={{ fontSize: 15, fontWeight: 600 }}>Patient Identity</h3>
              <div className="flex flex-col gap-4">
                {[
                  { l: 'Contact', v: patient.contact },
                  { l: 'Age/Gender', v: `${calculateAge(patient.dob)}y / ${patient.gender}` },
                  { l: 'Address', v: patient.address || 'Chennai, Tamil Nadu' }
                ].map(i => (
                  <div key={i.l} className="flex flex-col">
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase' }}>{i.l}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-900)' }}>{i.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6 bg-gray-900 text-white">
              <h3 className="mt-0 mb-4" style={{ fontSize: 15, fontWeight: 600 }}>Quick Actions</h3>
              <div className="flex flex-col gap-2">
                 <button className="btn w-full bg-gray-800 border-none text-white hover:bg-gray-700" onClick={() => setShowNoteModal(true)}>
                   <Plus size={16} /> Add Clinical Note
                 </button>
                 <button className="btn w-full bg-gray-800 border-none text-white hover:bg-gray-700" onClick={() => navigate('/doctor/appointments')}>
                   <Calendar size={16} /> Schedule Follow-up
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showNoteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="card w-full max-w-md p-6 bg-white shadow-xl animate-in">
            <h3 className="mt-0 mb-4">Add Clinical Note</h3>
            <textarea 
              className="w-full p-4 border rounded-lg mb-4 outline-none focus:border-primary-500" 
              rows={5} 
              placeholder="Enter patient assessment, diagnosis or treatment plan..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button className="btn btn-s" onClick={() => setShowNoteModal(false)}>Cancel</button>
              <button className="btn btn-p" onClick={handleAddNote}>Save Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
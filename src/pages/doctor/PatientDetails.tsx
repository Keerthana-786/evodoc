import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  Heart, 
  Activity, 
  Pill, 
  AlertTriangle,
  ChevronRight,
  Plus,
  Save,
  Clock,
  ExternalLink,
  FileText,
  Edit,
  History,
  ShieldCheck,
  Phone,
  Mail,
  Droplet
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { format } from 'date-fns';
import { cn } from '@/utils/helpers';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, appointments, notes, addNote } = useStore();
  const [activeTab, setActiveTab] = useState<'history' | 'visits' | 'notes' | 'edit'>('history');
  const [newNote, setNewNote] = useState('');

  const patient = useMemo(() => patients.find(p => p.id === id), [patients, id]);
  const patientAppointments = useMemo(() => 
    appointments.filter(a => a.patientId === id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [appointments, id]
  );
  const patientNotes = useMemo(() => 
    notes.filter(n => n.patientId === id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [notes, id]
  );

  if (!patient) return (
    <div className="py-40 text-center flex flex-col items-center gap-6 animate-slide-up">
       <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 flex items-center justify-center shadow-premium mb-4">
          <AlertTriangle className="w-10 h-10 text-rose-500" />
       </div>
       <div className="space-y-2">
         <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Record Not Found</h2>
         <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto">The clinical identifier provided does not match any active patient record in the vault.</p>
       </div>
       <button onClick={() => navigate('/doctor/dashboard')} className="mt-4 px-10 py-4 bg-blue-600 text-white rounded-[1.25rem] font-black text-xs uppercase tracking-widest shadow-vibrant hover:scale-105 transition-all">Return to Clinical Hub</button>
    </div>
  );

  const handleSaveNote = () => {
    if (!newNote.trim()) return;
    addNote({
      id: Math.random().toString(36).substr(2, 9),
      patientId: patient.id,
      doctorId: 'd1',
      doctorName: 'Dr. Kavitha Iyer',
      date: format(new Date(), 'yyyy-MM-dd'),
      content: newNote
    });
    setNewNote('');
  };

  return (
    <div className="space-y-12 animate-slide-up pb-20">
      {/* Header Profile Section */}
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-premium flex flex-col lg:flex-row gap-12 items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="relative group">
          <div className="w-40 h-40 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-6xl text-white shadow-vibrant group-hover:rotate-3 transition-transform duration-500">
            {patient.name.charAt(0)}
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-emerald-500 border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex-1 text-center lg:text-left space-y-6 relative z-10">
           <div className="space-y-2">
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-1">{patient.name}</h1>
                <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-[9px] font-black text-blue-600 uppercase tracking-widest rounded-full border border-blue-100 dark:border-blue-800">
                  Active Patient
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800">
                  <Activity className="w-3.5 h-3.5 text-blue-500" /> {patient.mrn}
                </div>
                <div className="flex items-center gap-4 text-sm font-bold text-slate-500 dark:text-slate-400 tracking-tight">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> 38 Years</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <span className="flex items-center gap-1.5 underline decoration-blue-500/20 underline-offset-4">{patient.gender}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-black tracking-widest uppercase"><Droplet className="w-4 h-4 text-rose-500" /> {patient.blood} Group</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <div className="flex items-center gap-4 text-slate-400">
                    <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {patient.contact}</span>
                    <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {patient.email || 'patient@vault.med'}</span>
                  </div>
                </div>
              </div>
           </div>

           <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
             {patient.allergies.length > 0 ? patient.allergies.map(a => (
               <span key={a} className="px-4 py-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-rose-100 dark:border-rose-900/50 flex items-center gap-2">
                 <AlertTriangle className="w-3 h-3" /> {a}
               </span>
             )) : <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl">No Clinical Allergies Flagged</span>}
           </div>
        </div>
        
        <div className="flex flex-col gap-3 min-w-[200px]">
          <button onClick={() => setActiveTab('edit')} className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.25rem] font-black text-xs uppercase tracking-widest shadow-premium hover:shadow-vibrant hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3">
            <Edit className="w-4 h-4" /> Edit Record
          </button>
          <button onClick={() => window.alert('Share link copied to clipboard')} className="px-10 py-4 bg-blue-600 text-white rounded-[1.25rem] font-black text-xs uppercase tracking-widest shadow-vibrant hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
            <ExternalLink className="w-4 h-4" /> Share Clinical
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-[340px] space-y-4">
           {['history', 'visits', 'notes', 'edit'].map((tab) => (
             <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "w-full p-6 rounded-[2rem] flex items-center justify-between transition-all group border",
                activeTab === tab 
                  ? "bg-blue-600 text-white shadow-vibrant border-transparent translate-x-2" 
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-500/50 shadow-premium"
              )}
             >
               <div className="flex items-center gap-5">
                  <div className={cn(
                    "p-3 rounded-2xl transition-colors duration-500 shadow-sm",
                    activeTab === tab ? "bg-white/20" : "bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900 group-hover:text-blue-600"
                  )}>
                    {tab === 'history' && <Activity className="w-5 h-5" />}
                    {tab === 'visits' && <History className="w-5 h-5" />}
                    {tab === 'notes' && <FileText className="w-5 h-5" />}
                    {tab === 'edit' && <Edit className="w-5 h-5" />}
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">{tab === 'history' ? 'Background' : tab}</span>
               </div>
               <ChevronRight className={cn("w-4 h-4 transition-transform", activeTab === tab ? "rotate-90" : "group-hover:translate-x-1")} />
             </button>
           ))}

           <div className="mt-8 p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-premium relative overflow-hidden group border border-white/10">
              <div className="relative z-10 space-y-6">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> Emergency
                </div>
                <div className="space-y-1">
                  <div className="text-xl font-black tracking-tight">{patient.emergencyContact?.name}</div>
                  <div className="text-xs font-bold text-blue-100/70 uppercase tracking-widest">{patient.emergencyContact?.relationship}</div>
                </div>
                <div className="text-lg font-black tracking-tighter flex items-center gap-3 pt-2">
                   <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center"><Phone className="w-4 h-4" /></div>
                   {patient.emergencyContact?.contact}
                </div>
              </div>
              <Activity className="absolute bottom-[-10%] right-[-10%] w-32 h-32 text-blue-400/20 group-hover:scale-110 transition-transform duration-700" />
           </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-premium min-h-[500px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600 opacity-10" />
            
            {activeTab === 'history' && (
              <div className="space-y-16 animate-fade-in">
                 <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center"><Heart className="w-4 h-4 text-rose-500" /></div>
                      Chronic Conditions Radar
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {patient.conditions.map(c => (
                        <div key={c} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[1.75rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-rose-300 dark:hover:border-rose-900 transition-all cursor-pointer">
                           <div className="flex items-center gap-4">
                             <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse" />
                             <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{c}</span>
                           </div>
                           <Activity className="w-5 h-5 text-slate-200 dark:text-slate-700 group-hover:text-rose-500 transition-colors" />
                        </div>
                      ))}
                      {patient.conditions.length === 0 && <span className="text-sm font-bold text-slate-400 uppercase tracking-widest italic py-4">Clinical baseline: Stable (No Conditions)</span>}
                    </div>
                 </div>

                 <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center"><Pill className="w-4 h-4 text-blue-500" /></div>
                      Medication Regimen
                    </h3>
                    <div className="space-y-4">
                      {patient.medications ? (
                        <div className="p-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-900/30 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:shadow-premium transition-all">
                          <div className="flex items-center gap-6">
                            <div className="p-5 bg-white dark:bg-slate-800 rounded-[1.5rem] text-blue-600 shadow-premium transition-transform group-hover:rotate-12 group-hover:scale-110 duration-500"><Pill className="w-8 h-8 " /></div>
                            <div>
                               <div className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-2 tracking-tighter">{patient.medications}</div>
                               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                                 <Stethoscope className="w-4 h-4 text-blue-500" /> Prescribed: Dr. Kavitha Iyer • 12 Mar 2026
                               </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <button onClick={() => window.alert('Refill request sent.')} className="px-6 py-2.5 bg-white dark:bg-slate-800 text-[10px] font-black text-blue-600 uppercase tracking-widest rounded-xl shadow-sm border border-blue-50 dark:border-blue-900">Refill Request</button>
                          </div>
                        </div>
                      ) : <span className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">No pharma protocol on record</span>}
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'visits' && (
              <div className="space-y-12 animate-fade-in">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Patient Encounter Log</h3>
                   <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-full">{patientAppointments.length} Total Visits</div>
                </div>
                <div className="space-y-4">
                  {patientAppointments.map(appt => (
                    <div key={appt.id} className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-8 hover:border-blue-500/40 hover:bg-white dark:hover:bg-slate-800 shadow-sm hover:shadow-premium transition-all cursor-pointer group">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center font-black text-blue-600 shadow-sm transition-transform duration-500 group-hover:scale-110">
                           <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1.5 tracking-tighter">{appt.date}</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-3 h-3 text-blue-400" /> {appt.type}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className={cn(
                          "px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border",
                          appt.status === 'completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900" : "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900"
                        )}>
                          {appt.status}
                        </span>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-all font-black" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-12 animate-fade-in">
                <div className="space-y-6">
                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Secure Visit Entry</h3>
                   <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 flex flex-col gap-6 shadow-inner relative overflow-hidden group">
                      <div className="absolute top-0 right-10 w-20 h-20 bg-blue-600/5 rounded-full blur-2xl group-focus-within:bg-blue-600/20 transition-all" />
                      <textarea 
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Detail the clinical assessment, results and follow-up plan for this encounter..."
                        className="w-full h-40 bg-transparent outline-none text-base font-medium resize-none dark:text-white placeholder:text-slate-400 relative z-10"
                      />
                      <div className="flex justify-between items-center pt-8 border-t border-slate-200 dark:border-slate-700 relative z-10">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <ShieldCheck className="w-4 h-4 text-emerald-500" /> HIPAA Compliant Storage
                        </div>
                        <button 
                          onClick={handleSaveNote}
                          className="px-10 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-vibrant hover:scale-105 hover:bg-blue-700 transition-all flex items-center gap-3"
                        >
                          <Save className="w-4 h-4" /> Commit Clinical Note
                        </button>
                      </div>
                   </div>
                </div>

                <div className="space-y-10 pt-4">
                   <div className="flex items-end justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 border-l-4 border-blue-600 ml-1">Clinical Archives</h3>
                      <button onClick={() => window.alert('Exporting to PDF...')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">Export History <History className="w-3.5 h-3.5" /></button>
                   </div>
                   <div className="space-y-10">
                      {patientNotes.map(n => (
                        <div key={n.id} className="relative pl-12 before:absolute before:left-0 before:top-4 before:bottom-[-2.5rem] last:before:hidden before:w-1 before:bg-slate-100 dark:before:bg-slate-800 before:rounded-full">
                           <div className="absolute left-[-6px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-blue-600 shadow-premium" />
                           <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-premium transition-all group">
                              <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1">
                                   <div className="text-lg font-black text-slate-900 dark:text-white leading-none tracking-tighter group-hover:text-blue-600 transition-colors uppercase">{n.doctorName}</div>
                                   <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Encounter Verification Profile</div>
                                </div>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-4 py-1.5 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm">{n.date}</span>
                              </div>
                              <p className="text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-4 border-slate-100 dark:border-slate-800 pl-6 py-1">"{n.content}"</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;

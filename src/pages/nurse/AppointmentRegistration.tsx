import React, { useState, useMemo } from 'react';
import { 
  User, 
  Search, 
  UserPlus, 
  Stethoscope, 
  Calendar, 
  Clock, 
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Plus,
  Loader2,
  Printer,
  Download,
  Activity,
  ShieldCheck,
  ClipboardCheck,
  AlertCircle,
  AlertTriangle,
  Info,
  Users
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AppointmentType } from '@/types';
import { cn } from '@/utils/helpers';
import { useToast } from '@/components/ui/toast';
import { useNavigate } from 'react-router-dom';

// ─── Sub-components ───────────────────────────────────────────────────────────

const StepIndicator = ({ activeStep }: { activeStep: number }) => {
  const steps = ['Identity Verification', 'Clinical Resources', 'Final Review'];
  return (
    <div className="flex items-center justify-between gap-4 mb-20 relative max-w-3xl mx-auto">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 -z-10 rounded-full" />
      <div 
        className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 -z-10 rounded-full transition-all duration-700" 
        style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
      />
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isCompleted = activeStep > stepNum;
        const isActive = activeStep === stepNum;
        
        return (
          <div key={label} className="flex flex-col items-center gap-4 relative">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 shadow-premium",
              isActive 
                ? "bg-blue-600 text-white scale-110 rotate-3" 
                : isCompleted 
                  ? "bg-emerald-500 text-white" 
                  : "bg-white dark:bg-slate-900 text-slate-300 border-2 border-slate-100 dark:border-slate-800"
            )}>
              {isCompleted ? <CheckCircle className="w-6 h-6" /> : stepNum}
            </div>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap",
              isActive ? "text-blue-600" : "text-slate-400"
            )}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const AppointmentRegistration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { patients, doctors, addAppointment } = useStore();
  const { addToast } = useToast();

  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState<AppointmentType>('GENERAL CONSULTATION');
  const [notes, setNotes] = useState('');

  const filteredPatients = useMemo(() => {
    if (!search) return [];
    return patients.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.mrn.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 3);
  }, [patients, search]);

  const handleBooking = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    
    const newAppt = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: selectedPatient.id,
      doctorId: selectedDoctor.id,
      date,
      time,
      type,
      status: 'scheduled' as const,
      notes
    };
    
    addAppointment(newAppt);
    setIsSubmitting(false);
    setIsConfirmed(true);
    addToast({
      type: 'success',
      title: 'Encounter Validated',
      message: 'Clinical appointment has been synchronized with the medical roster.'
    });
  };

  if (isConfirmed) {
    return (
      <div className="max-w-3xl mx-auto py-20 animate-fade-in text-center">
        <div className="bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-100 dark:border-slate-800 p-20 shadow-premium space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <div className="relative inline-flex items-center justify-center">
            <div className="w-32 h-32 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center shadow-vibrant animate-scale-in">
              <ClipboardCheck className="w-14 h-14" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-lg flex items-center justify-center text-emerald-500 border border-emerald-100 dark:border-emerald-800">
               <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Clinical Pass Issued</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Identity and Resources Successfully Synchronized</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Patient Profile</div>
              <div className="text-xl font-black text-slate-900 dark:text-white uppercase mb-1">{selectedPatient.name}</div>
              <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{selectedPatient.mrn}</div>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Assigned Specialist</div>
              <div className="text-xl font-black text-slate-900 dark:text-white uppercase mb-1">{selectedDoctor.name}</div>
              <div className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">{selectedDoctor.specialty}</div>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-50 dark:border-slate-800 flex flex-col md:flex-row gap-6">
             <button onClick={() => navigate('/nurse/appointments')} className="flex-1 px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-premium hover:scale-105 transition-all">View All Encounters</button>
             <button className="flex-1 px-10 py-5 bg-white border border-slate-200 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
               <Printer className="w-4 h-4" /> Print Pass
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-40 animate-fade-in">
      <header className="mb-20 text-center space-y-6">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-vibrant">
           <Activity className="w-4 h-4" /> System Resource Allocation
        </div>
        <h1 className="text-6xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Register Encounter</h1>
        <p className="text-slate-500 font-bold max-w-sm mx-auto text-sm uppercase tracking-widest opacity-60">Deploy identity, time, and clinical assets.</p>
      </header>

      <StepIndicator activeStep={step} />

      <div className="bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-200 dark:border-slate-800 shadow-premium p-12 lg:p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 rounded-full blur-[60px] -mr-20 -mt-20" />
        
        {step === 1 && (
          <div className="space-y-16 animate-scale-in">
            {/* Identity Triage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
               <div 
                onClick={() => setSelectedPatient(null)}
                className={cn(
                  "p-10 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-500 group",
                  !selectedPatient && search === '' 
                    ? "bg-blue-600 border-transparent text-white shadow-vibrant" 
                    : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-300"
                )}
               >
                 <div className="flex items-start justify-between mb-8">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", !selectedPatient && search === '' ? "bg-white/20" : "bg-blue-600/10")}>
                      <UserPlus className={cn("w-7 h-7", !selectedPatient && search === '' ? "text-white" : "text-blue-600")} />
                    </div>
                    {!selectedPatient && search === '' && <CheckCircle className="w-6 h-6" />}
                 </div>
                 <h3 className="text-xl font-black uppercase tracking-tight mb-2">New Identity</h3>
                 <p className={cn("text-[10px] font-bold uppercase tracking-widest leading-loose", !selectedPatient && search === '' ? "text-blue-100" : "text-slate-400")}>
                    Create a clinical profile for a first-time system visit.
                 </p>
                  <button 
                  onClick={(e) => { e.stopPropagation(); navigate('/nurse/intake'); }}
                  className={cn(
                    "mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl transition-all",
                    !selectedPatient && search === '' ? "bg-white text-blue-600 font-black" : "bg-slate-900 text-white"
                  )}
                 >
                   Launch Intake Form <ArrowRight className="w-4 h-4" />
                 </button>
               </div>

               <div className={cn(
                  "p-10 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-inner-soft",
                  selectedPatient && "border-emerald-500 ring-2 ring-emerald-500/5"
               )}>
                 <div className="flex items-start justify-between mb-8">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                      <Users className="w-7 h-7 text-emerald-600" />
                    </div>
                    {selectedPatient && <div className="px-4 py-1.5 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm">Verified</div>}
                 </div>
                 <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Returning Patient</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                    Locate existing vault records via MRN or Legal Name.
                 </p>
                 <div className="mt-8 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="MRN or Name..."
                      className="w-full h-14 pl-14 pr-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold outline-none focus:border-blue-600 dark:text-white transition-all shadow-sm"
                    />
                 </div>
               </div>
            </div>

            {search && (
              <div className="space-y-4 pt-10 border-t border-slate-100 dark:border-slate-800 animate-slide-up">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-2 mb-6">Found in Vault</div>
                 {filteredPatients.map(p => (
                   <div 
                    key={p.id} 
                    onClick={() => setSelectedPatient(p)}
                    className={cn(
                      "p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex items-center justify-between",
                      selectedPatient?.id === p.id 
                        ? "border-emerald-500 bg-emerald-50/10 dark:bg-emerald-900/10 shadow-premium" 
                        : "border-transparent bg-white dark:bg-slate-900 hover:border-slate-200"
                    )}
                   >
                     <div className="flex items-center gap-6">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-black", selectedPatient?.id === p.id ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400")}>
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-base font-black text-slate-900 dark:text-white uppercase leading-none mb-1">{p.name}</div>
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{p.mrn}</div>
                        </div>
                     </div>
                     {selectedPatient?.id === p.id && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                   </div>
                 ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-12 animate-scale-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Medical Specialist</label>
                  <div className="grid grid-cols-1 gap-4">
                    {doctors.map(d => (
                      <div 
                        key={d.id}
                        onClick={() => setSelectedDoctor(d)}
                        className={cn(
                          "p-6 rounded-3xl border-2 transition-all duration-500 cursor-pointer flex items-center justify-between",
                          selectedDoctor?.id === d.id ? "bg-blue-600 border-transparent text-white shadow-premium" : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                        )}
                      >
                         <div className="flex items-center gap-4">
                           <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-sm", selectedDoctor?.id === d.id ? "bg-white/20" : "bg-blue-600 text-white")}>
                             <Stethoscope className="w-6 h-6" />
                           </div>
                           <div>
                              <div className="text-sm font-black uppercase tracking-tight leading-none mb-1">{d.name}</div>
                              <div className={cn("text-[9px] font-bold uppercase tracking-widest", selectedDoctor?.id === d.id ? "text-blue-100" : "text-slate-400")}>{d.specialty}</div>
                           </div>
                         </div>
                         {selectedDoctor?.id === d.id && <CheckCircle className="w-5 h-5" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Time Allocation</label>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="relative group">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full h-14 pl-12 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest outline-none" />
                         </div>
                         <div className="relative group">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full h-14 pl-12 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest outline-none" />
                         </div>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Encounter Priority</label>
                      <div className="grid grid-cols-2 gap-4">
                         {['GENERAL CONSULTATION', 'FOLLOW-UP', 'EMERGENCY', 'ROUTINE CHECKUP'].map(t => (
                           <button 
                            key={t}
                            onClick={() => setType(t as any)}
                            className={cn(
                              "px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                              type === t ? "bg-slate-900 text-white border-transparent" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400"
                            )}
                           >
                             {t}
                           </button>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-12 animate-scale-in">
             <div className="p-10 bg-slate-50 dark:bg-slate-950 rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-10">
                <div className="flex items-center gap-4 px-6 py-3 bg-emerald-500/10 text-emerald-600 rounded-2xl w-fit">
                   <ShieldCheck className="w-5 h-5" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Clinical Match Verified</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-2">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Patient Profile</div>
                      <div className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{selectedPatient?.name}</div>
                      <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">{selectedPatient?.mrn}</div>
                   </div>
                   <div className="space-y-2">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Physician & Timeline</div>
                      <div className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{selectedDoctor?.name}</div>
                      <div className="text-xs font-bold text-teal-600 uppercase tracking-widest">{date} · {time} EST</div>
                   </div>
                </div>

                <div className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Encounter Briefing / Clinical Notes</label>
                   <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="w-full p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] text-sm font-bold shadow-inner-soft outline-none resize-none" placeholder="Detail any critical symptoms or clinical request notes..." />
                </div>
             </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-16 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-10">
           <button 
             onClick={() => setStep(s => Math.max(1, s - 1))}
             disabled={step === 1}
             className="px-10 py-5 text-[11px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em] hover:text-blue-600 disabled:opacity-0 transition-all flex items-center gap-4"
           >
             <ChevronLeft className="w-5 h-5" /> Previous Step
           </button>
           
           <div className="flex gap-4">
              {step < 3 ? (
                <button 
                  onClick={() => setStep(s => Math.min(3, s + 1))}
                  disabled={(step === 1 && !selectedPatient) || (step === 2 && (!selectedDoctor || !date || !time))}
                  className="px-14 py-5 bg-blue-600 text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] shadow-vibrant hover:scale-105 active:scale-95 transition-all flex items-center gap-4 disabled:opacity-30 disabled:grayscale"
                >
                  Continuum <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={handleBooking}
                  disabled={isSubmitting}
                  className="px-20 py-6 bg-emerald-500 text-white rounded-3xl text-[12px] font-black uppercase tracking-[0.3em] shadow-vibrant hover:scale-105 active:scale-95 transition-all flex items-center gap-4 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <ClipboardCheck className="w-6 h-6" />}
                  Confirm Booking
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentRegistration;

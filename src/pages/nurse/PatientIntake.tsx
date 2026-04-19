import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  User, 
  MapPin, 
  Phone, 
  Heart, 
  ShieldCheck, 
  Save, 
  X,
  Plus,
  Loader2,
  Mail,
  Fingerprint,
  Activity,
  Droplets,
  Stethoscope,
  ChevronRight,
  Info,
  Calendar,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/utils/helpers';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/toast';

const intakeSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  dob: z.string().refine(val => {
    if (!val) return false;
    const date = new Date(val);
    return date < new Date();
  }, "Date of birth must be in the past"),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say'] as const, {
    errorMap: () => ({ message: "Please select a gender" })
  }),
  contact: z.string().regex(/^\+91\d{10}$/, "Valid Indian phone number required (+91 followed by 10 digits)"),
  address: z.string().min(1, "Address is required"),
  emergencyName: z.string().min(2, "Emergency name is required"),
  emergencyRelationship: z.string().min(1, "Relationship is required"),
  emergencyContact: z.string().regex(/^\+91\d{10}$/, "Valid phone number required (+91...)"),
  blood: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const, {
    errorMap: () => ({ message: "Select blood group" })
  }),
  allergies: z.array(z.string()).default([]),
  conditions: z.array(z.string()).default([]),
  medications: z.string().optional(),
});

type IntakeForm = z.infer<typeof intakeSchema>;

// ─── Sub-components ───────────────────────────────────────────────────────────

const FormField = ({ label, error, children, required, colSpan = "col-span-1" }: any) => (
  <div className={cn("space-y-2", colSpan)}>
    <div className="flex items-center justify-between px-1">
      <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {error && (
        <span className="text-[9px] font-bold text-rose-500 animate-fade-in flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </span>
      )}
    </div>
    <div className="relative group overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all bg-slate-50/50 dark:bg-slate-950/50 shadow-inner-soft">
       {children}
    </div>
  </div>
);

const SectionHeader = ({ icon: Icon, title, description, badge }: any) => (
  <div className="flex items-center gap-6 mb-10 pb-6 border-b border-slate-100 dark:border-slate-800">
    <div className="w-12 h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center shrink-0 shadow-premium group-hover:rotate-6 transition-transform">
      <Icon className="w-6 h-6" />
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">{title}</h2>
        {badge && <span className="text-[9px] font-black px-2 py-0.5 bg-blue-50 dark:bg-blue-900 text-blue-600 rounded-full">{badge}</span>}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{description}</p>
    </div>
  </div>
);

const TagInput = ({ label, tags, onAdd, onRemove, placeholder }: any) => {
  const [input, setInput] = useState('');
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      onAdd(input.trim());
      setInput('');
    }
  };
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">{label}</label>
      <div className="flex flex-wrap gap-2 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl min-h-[100px] shadow-inner-soft group focus-within:border-blue-400 transition-all">
        {tags.map((tag: string, i: number) => (
          <span key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white dark:bg-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg animate-scale-in">
            {tag}
            <button onClick={() => onRemove(tag)} className="hover:text-blue-300 transition-colors"><X className="w-3 h-3" /></button>
          </span>
        ))}
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 min-w-[150px] bg-transparent outline-none text-xs font-bold dark:text-white placeholder:text-slate-300 uppercase"
        />
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const PatientIntake = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { addPatient } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

  const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm<IntakeForm>({
    resolver: zodResolver(intakeSchema),
    mode: 'onChange',
    defaultValues: {
      allergies: [],
      conditions: [],
      contact: '+91',
      emergencyContact: '+91'
    }
  });

  const watchDob = watch('dob');

  useEffect(() => {
    if (watchDob) {
      const birthDate = new Date(watchDob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setCalculatedAge(age >= 0 ? age : null);
    }
  }, [watchDob]);

  const onSubmit = async (data: IntakeForm) => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    
    const mrn = `MRN-2026-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const newPatient = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      mrn,
      allergies,
      conditions,
      age: calculatedAge,
      emergencyContact: {
        name: data.emergencyName,
        relationship: data.emergencyRelationship,
        contact: data.emergencyContact
      }
    };
    
    addPatient(newPatient as any);
    addToast({
      type: 'success',
      title: 'Identity Encrypted',
      message: `Encounter identity ${data.fullName} registered under MRN: ${mrn}`
    });
    reset();
    setAllergies([]);
    setConditions([]);
    setIsSubmitting(false);
    navigate('/nurse/appointments');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-40">
      <header className="mb-20 text-center space-y-6">
        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-slate-900 dark:bg-blue-900/20 text-[10px] font-black text-white dark:text-blue-400 uppercase tracking-[0.3em] rounded-2xl shadow-premium">
           <Fingerprint className="w-5 h-5" /> Secure Clinical Registration
        </div>
        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Intake Vault</h1>
        <p className="text-slate-500 font-bold max-w-sm mx-auto text-sm">Deploy high-fidelity clinical identification for the EvoDoc network.</p>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-premium p-10 lg:p-16 space-y-24">
        
        {/* Section 1: Patient Details */}
        <section className="space-y-12">
          <SectionHeader icon={User} title="Primary Identity" description="Legal identification and contact baseline" badge="Phase 01" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <FormField label="Full Name" error={errors.fullName?.message} required>
              <input {...register('fullName')} className="w-full h-14 px-5 bg-transparent outline-none text-base font-bold dark:text-white" placeholder="Rahul Sharma" />
            </FormField>

            <FormField label="Date of Birth" error={errors.dob?.message} required>
              <div className="flex items-center w-full h-14 pr-4">
                <input type="date" {...register('dob')} className="flex-1 px-5 h-full bg-transparent outline-none text-base font-bold dark:text-white appearance-none" />
                {calculatedAge !== null && <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Age: {calculatedAge}</span>}
              </div>
            </FormField>

            <FormField label="Gender" error={errors.gender?.message} required>
              <select {...register('gender')} className="w-full h-14 px-5 bg-transparent outline-none text-base font-bold dark:text-white appearance-none cursor-pointer">
                <option value="">Select Identity</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </FormField>

            <FormField label="Contact Number" error={errors.contact?.message} required>
               <input {...register('contact')} className="w-full h-14 px-5 bg-transparent outline-none text-base font-bold dark:text-white tabular-nums" placeholder="+91" />
            </FormField>

            <FormField label="Residential Address" error={errors.address?.message} required colSpan="md:col-span-2">
              <input {...register('address')} className="w-full h-14 px-5 bg-transparent outline-none text-base font-bold dark:text-white" placeholder="Street address, City, Pincode" />
            </FormField>
          </div>
        </section>

        {/* Section 2: Emergency Details */}
        <section className="space-y-12">
          <SectionHeader icon={ShieldCheck} title="Emergency Bridge" description="Emergency contact and relationship verification" badge="Phase 02" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <FormField label="Contact Full Name" error={errors.emergencyName?.message} required>
              <input {...register('emergencyName')} className="w-full h-14 px-5 bg-transparent outline-none text-base font-bold dark:text-white" placeholder="e.g. Aditi Sharma" />
            </FormField>
            <FormField label="Relationship" error={errors.emergencyRelationship?.message} required>
               <input {...register('emergencyRelationship')} className="w-full h-14 px-5 bg-transparent outline-none text-base font-bold dark:text-white" placeholder="Spouse / Parent / Sibling" />
            </FormField>
            <FormField label="Emergency Phone" error={errors.emergencyContact?.message} required>
               <input {...register('emergencyContact')} className="w-full h-14 px-5 bg-transparent outline-none text-base font-bold dark:text-white tabular-nums" placeholder="+91" />
            </FormField>
          </div>
        </section>

        {/* Section 3: Clinical Details */}
        <section className="space-y-12">
          <SectionHeader icon={Heart} title="Clinical Baseline" description="Chronic conditions, allergies, and pharmaceuticals" badge="Phase 03" />
          <div className="space-y-10">
            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Blood Group <span className="text-rose-500">*</span></label>
               <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setValue('blood', bg as any, { shouldValidate: true })}
                    className={cn(
                      "h-12 flex items-center justify-center rounded-xl text-xs font-black border-2 transition-all",
                      watch('blood') === bg 
                        ? "bg-rose-600 border-transparent text-white shadow-vibrant scale-110" 
                        : "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400"
                    )}
                  >
                    {bg}
                  </button>
                ))}
              </div>
              {errors.blood && <p className="text-[9px] font-bold text-rose-500 mt-2">{errors.blood.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <TagInput 
                label="Clinical Allergies" 
                tags={allergies} 
                onAdd={(tag: string) => setAllergies([...allergies, tag])}
                onRemove={(tag: string) => setAllergies(allergies.filter(t => t !== tag))}
                placeholder="Type and press Enter..."
              />
              <TagInput 
                label="Chronic Conditions" 
                tags={conditions} 
                onAdd={(tag: string) => setConditions([...conditions, tag])}
                onRemove={(tag: string) => setConditions(conditions.filter(t => t !== tag))}
                placeholder="e.g. Diabetes, Asthma..."
              />
            </div>

            <FormField label="Active Medications (Dosage & Timing)" colSpan="col-span-1">
              <textarea 
                {...register('medications')} 
                rows={4}
                className="w-full p-6 bg-transparent outline-none text-base font-bold dark:text-white resize-none shadow-inner-soft"
                placeholder="Detail current pharmaceutical regiment..."
              />
            </FormField>
          </div>
        </section>

        {/* Submit Actions */}
        <div className="pt-10 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
           <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> HIPAA Compliant Encryption
           </div>
           <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => { reset(); setAllergies([]); setConditions([]); }}
                className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-all"
              >
                Reset Vault
              </button>
              <button 
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="px-14 py-5 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-vibrant hover:bg-blue-700 hover:scale-105 disabled:opacity-50 transition-all flex items-center gap-4 group"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 group-hover:scale-125 transition-all" />}
                Submit & Save 
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PatientIntake;

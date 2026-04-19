import React, { useState, useEffect, useMemo } from 'react';
import { User, Phone, Heart, Save, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { useAppContext } from '../hooks/AppContext';
import { validatePhone } from '../utils/helpers';

const FloatingInput = ({ label, field, type = "text", req = false, options = null, isTextArea = false, form, errors, validFields, handleFieldChange }) => (
  <div className="flex flex-col gap-1 mb-6">
    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase' }}>{label}{req && ' *'}</label>
    <div className="relative">
      {options ? (
        <select 
          className={`w-full p-3 border rounded-lg outline-none transition-all ${errors[field] ? 'border-danger-500' : validFields[field] ? 'border-accent-500' : 'border-gray-200 focus:border-primary-500'}`}
          value={form[field]}
          onChange={(e) => handleFieldChange(field, e.target.value)}
        >
          <option value="">Select...</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : isTextArea ? (
        <textarea
          className={`w-full p-3 border rounded-lg outline-none transition-all ${errors[field] ? 'border-danger-500' : validFields[field] ? 'border-accent-500' : 'border-gray-200 focus:border-primary-500'}`}
          style={{ minHeight: 100 }}
          value={form[field]}
          onChange={(e) => handleFieldChange(field, e.target.value)}
        />
      ) : (
        <input
          type={type}
          className={`w-full p-3 border rounded-lg outline-none transition-all ${errors[field] ? 'border-danger-500' : validFields[field] ? 'border-accent-500' : 'border-gray-200 focus:border-primary-500'}`}
          value={form[field]}
          onChange={(e) => handleFieldChange(field, e.target.value)}
        />
      )}
      {validFields[field] && <div className="absolute right-3 top-3 color-accent-500"><Check size={16} /></div>}
      {errors[field] && <div className="absolute right-3 top-3 color-danger-500"><AlertTriangle size={16} /></div>}
    </div>
    {errors[field] && <div style={{ fontSize: 10, color: 'var(--danger-600)', fontWeight: 600 }}>{errors[field]}</div>}
  </div>
);

export default function PatientIntake() {
  const { addPatient, addToast } = useAppContext();
  const emptyForm = { fullName: '', dob: '', gender: '', contact: '', email: '', eName: '', eRel: '', eCon: '', blood: '', allergies: '', conditions: '', medications: '' };
  
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [validFields, setValidFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = useMemo(() => {
    const required = ['fullName', 'dob', 'gender', 'contact', 'blood'];
    return required.every(f => form[f] && form[f].trim() !== '') && Object.values(errors).every(e => !e);
  }, [form, errors]);

  const completionPercentage = useMemo(() => {
    const required = ['fullName', 'dob', 'gender', 'contact', 'blood'];
    const completed = required.filter(f => form[f] && form[f].trim() !== '').length;
    return (completed / required.length) * 100;
  }, [form]);

  const handleFieldChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    let error = '';
    if (field === 'contact' && value && !validatePhone(value)) error = 'Invalid phone number';
    setErrors(prev => ({ ...prev, [field]: error }));
    const required = ['fullName', 'dob', 'gender', 'contact', 'blood'];
    setValidFields(prev => ({ ...prev, [field]: value && !error && (required.includes(field) ? value.trim() !== '' : true) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    addPatient({ ...form, id: Date.now() });
    addToast('Patient registered successfully', 'success');
    setForm(emptyForm);
    setIsSubmitting(false);
  };

  const inputProps = { form, errors, validFields, handleFieldChange };

  return (
    <div className="pe animate-in p-8" style={{ background: 'var(--gray-25)' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="m-0" style={{ fontSize: 28, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>New Patient Intake</h1>
            <p className="m-0" style={{ fontSize: 15, color: 'var(--gray-500)' }}>Establish clinical identity and demographic capture.</p>
          </div>
          <div className="text-right">
             <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gray-400)', marginBottom: 6, textTransform: 'uppercase' }}>Registration Health</div>
             <div className="flex items-center gap-3">
               <div style={{ width: 100, height: 6, background: 'var(--gray-100)', borderRadius: 10, overflow: 'hidden' }}>
                 <div style={{ width: `${completionPercentage}%`, height: '100%', background: 'var(--accent-500)', transition: 'width 0.4s ease' }} />
               </div>
               <span style={{ fontSize: 13, fontWeight: 700 }}>{Math.round(completionPercentage)}%</span>
             </div>
          </div>
        </header>

        <form onSubmit={handleSubmit}>
           <div className="mb-8">
             <h2 className="mb-6 flex items-center gap-2" style={{ fontSize: 16, fontWeight: 700 }}>
                <div className="flex items-center justify-center bg-primary-50 text-primary-600 rounded-lg" style={{ width: 32, height: 32 }}><User size={18} /></div>
                Personal Identity
             </h2>
             <div className="card p-8 grid grid-cols-2 gap-x-8" style={{ background: 'white' }}>
                <FloatingInput label="Full Name" field="fullName" req {...inputProps} />
                <FloatingInput label="Date of Birth" field="dob" type="date" req {...inputProps} />
                <FloatingInput label="Gender Identity" field="gender" options={['Male', 'Female', 'Non-binary', 'Other']} req {...inputProps} />
                <FloatingInput label="Primary Contact" field="contact" type="tel" req {...inputProps} />
                <FloatingInput label="Email Address" field="email" type="email" {...inputProps} />
             </div>
           </div>

           <div className="mb-8">
             <h2 className="mb-6 flex items-center gap-2" style={{ fontSize: 16, fontWeight: 700 }}>
                <div className="flex items-center justify-center bg-primary-50 text-primary-600 rounded-lg" style={{ width: 32, height: 32 }}><Phone size={18} /></div>
                Emergency Coordination
             </h2>
             <div className="card p-8 grid grid-cols-2 gap-x-8" style={{ background: 'white' }}>
                <FloatingInput label="Contact Representative" field="eName" req {...inputProps} />
                <FloatingInput label="Relationship" field="eRel" {...inputProps} />
                <FloatingInput label="Emergency Phone" field="eCon" type="tel" req {...inputProps} />
             </div>
           </div>

           <div className="mb-10">
             <h2 className="mb-6 flex items-center gap-2" style={{ fontSize: 16, fontWeight: 700 }}>
                <div className="flex items-center justify-center bg-primary-50 text-primary-600 rounded-lg" style={{ width: 32, height: 32 }}><Heart size={18} /></div>
                Clinical Background
             </h2>
             <div className="card p-8 flex flex-col" style={{ background: 'white' }}>
                <FloatingInput label="Blood Type" field="blood" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} req {...inputProps} />
                <FloatingInput label="Known Allergies" field="allergies" placeholder="Type 'None' if applicable" {...inputProps} />
                <FloatingInput label="Regular Medications" field="medications" isTextArea {...inputProps} />
             </div>
           </div>

           <div className="flex justify-between items-center pt-8 border-t border-gray-100">
              <button type="button" className="btn btn-s" onClick={() => setForm(emptyForm)}>Reset Form</button>
              <button 
                type="submit" 
                className="btn btn-p" 
                disabled={isSubmitting || !isFormValid}
                style={{ minWidth: 220, opacity: isFormValid ? 1 : 0.5 }}
              >
                {isSubmitting ? <Loader2 size={18} className="spin" /> : 'Finalize Registration'}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}

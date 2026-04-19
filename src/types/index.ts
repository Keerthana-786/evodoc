export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export type AppointmentType = 'General Consultation' | 'Follow-up' | 'Emergency' | 'Procedure';

export interface Patient {
  id: string;
  name: string;
  dob: string;
  gender: Gender;
  contact: string;
  email?: string;
  address?: string;
  blood: BloodGroup;
  allergies: string[];
  conditions: string[];
  medications: string;
  emergencyContact: {
    name: string;
    relationship: string;
    contact: string;
  };
  insurance?: {
    provider: string;
    id: string;
  };
  mrn: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  role: string;
  status: 'Available' | 'Busy';
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  confirmationNumber: string;
}

export interface Note {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  content: string;
}

export interface User {
  id: string;
  name: string;
  role: 'nurse' | 'doctor';
  email: string;
}

export type Role = 'nurse' | 'doctor';
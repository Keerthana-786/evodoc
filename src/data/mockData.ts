import { Patient, Doctor, Appointment, Note } from '../types';

export const mockDoctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Kavitha Iyer',
    specialty: 'General Medicine',
    role: 'Senior Physician',
    status: 'Available'
  },
  {
    id: 'd2',
    name: 'Dr. Rohan Menon',
    specialty: 'Cardiology',
    role: 'Consultant',
    status: 'Busy'
  },
  {
    id: 'd3',
    name: 'Dr. Anjali Singh',
    specialty: 'Paediatrics',
    role: 'Resident',
    status: 'Available'
  }
];

export const mockPatients: Patient[] = [
  {
    id: 'p1',
    name: 'Arjun Mehta',
    dob: '1985-06-15',
    gender: 'Male',
    contact: '+91 9876543210',
    email: 'arjun.mehta@email.com',
    blood: 'A+',
    allergies: ['Penicillin'],
    conditions: ['Hypertension'],
    medications: 'Amlodipine 5mg once daily',
    emergencyContact: {
      name: 'Sunita Mehta',
      relationship: 'Spouse',
      contact: '+91 9876543211'
    },
    mrn: 'MRN-2026-0001'
  },
  {
    id: 'p2',
    name: 'Priya Sharma',
    dob: '1992-03-22',
    gender: 'Female',
    contact: '+91 9876543220',
    blood: 'O-',
    allergies: ['Dust mites'],
    conditions: ['Asthma'],
    medications: 'Salbutamol inhaler as needed',
    emergencyContact: {
      name: 'Rajesh Sharma',
      relationship: 'Parent',
      contact: '+91 9876543221'
    },
    mrn: 'MRN-2026-0002'
  },
  {
    id: 'p3',
    name: 'Ravi Kumar',
    dob: '1978-11-05',
    gender: 'Male',
    contact: '+91 9876543230',
    blood: 'B+',
    allergies: ['Peanuts'],
    conditions: ['Type 2 Diabetes'],
    medications: 'Metformin 500mg twice daily',
    emergencyContact: {
      name: 'Leela Kumar',
      relationship: 'Spouse',
      contact: '+91 9876543231'
    },
    mrn: 'MRN-2026-0003'
  },
  {
    id: 'p4',
    name: 'Sunita Reddy',
    dob: '1965-09-12',
    gender: 'Female',
    contact: '+91 9876543240',
    blood: 'AB+',
    allergies: [],
    conditions: ['Hypothyroidism'],
    medications: 'Levothyroxine 50mcg once daily',
    emergencyContact: {
      name: 'Anil Reddy',
      relationship: 'Sibling',
      contact: '+91 9876543241'
    },
    mrn: 'MRN-2026-0004'
  },
  {
    id: 'p5',
    name: 'Deepak Nair',
    dob: '1998-01-30',
    gender: 'Male',
    contact: '+91 9876543250',
    blood: 'O+',
    allergies: ['Latex'],
    conditions: [],
    medications: 'None',
    emergencyContact: {
      name: 'Maya Nair',
      relationship: 'Parent',
      contact: '+91 9876543251'
    },
    mrn: 'MRN-2026-0005'
  },
  {
    id: 'p6',
    name: 'Meera Kapur',
    dob: '1990-12-08',
    gender: 'Female',
    contact: '+91 9876543260',
    blood: 'A-',
    allergies: ['Shellfish'],
    conditions: ['Migraine'],
    medications: 'Sumatriptan 50mg as needed',
    emergencyContact: {
      name: 'Vikram Kapur',
      relationship: 'Friend',
      contact: '+91 9876543261'
    },
    mrn: 'MRN-2026-0006'
  },
  {
    id: 'p7',
    name: 'Aditya Gupta',
    dob: '1982-04-18',
    gender: 'Male',
    contact: '+91 9876543270',
    blood: 'B-',
    allergies: [],
    conditions: ['GERD'],
    medications: 'Omeprazole 20mg once daily',
    emergencyContact: {
      name: 'Sarayu Gupta',
      relationship: 'Spouse',
      contact: '+91 9876543271'
    },
    mrn: 'MRN-2026-0007'
  },
  {
    id: 'p8',
    name: 'Kavya Pillai',
    dob: '2005-07-25',
    gender: 'Female',
    contact: '+91 9876543280',
    blood: 'AB-',
    allergies: ['Eggs'],
    conditions: ['Eczema'],
    medications: 'Hydrocortisone cream',
    emergencyContact: {
      name: 'Rohan Pillai',
      relationship: 'Parent',
      contact: '+91 9876543281'
    },
    mrn: 'MRN-2026-0008'
  },
  {
    id: 'p9',
    name: 'Suresh Patil',
    dob: '1970-02-14',
    gender: 'Male',
    contact: '+91 9876543290',
    blood: 'A+',
    allergies: [],
    conditions: ['Chronic Back Pain'],
    medications: 'Ibuprofen 400mg as needed',
    emergencyContact: {
      name: 'Sunita Patil',
      relationship: 'Spouse',
      contact: '+91 9876543291'
    },
    mrn: 'MRN-2026-0009'
  },
  {
    id: 'p10',
    name: 'Anita Desai',
    dob: '1988-10-10',
    gender: 'Female',
    contact: '+91 9876543201',
    blood: 'O+',
    allergies: ['Sulphur'],
    conditions: [],
    medications: 'None',
    emergencyContact: {
      name: 'Harsh Desai',
      relationship: 'Spouse',
      contact: '+91 9876543202'
    },
    mrn: 'MRN-2026-0010'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    doctorId: 'd1',
    date: '2026-04-19',
    time: '09:00',
    type: 'General Consultation',
    status: 'scheduled',
    confirmationNumber: 'APT-2026-1001'
  },
  {
    id: 'a2',
    patientId: 'p2',
    doctorId: 'd1',
    date: '2026-04-19',
    time: '10:00',
    type: 'Follow-up',
    status: 'scheduled',
    confirmationNumber: 'APT-2026-1002'
  },
  {
    id: 'a3',
    patientId: 'p3',
    doctorId: 'd2',
    date: '2026-04-19',
    time: '11:30',
    type: 'General Consultation',
    status: 'scheduled',
    confirmationNumber: 'APT-2026-1003'
  },
  {
    id: 'a4',
    patientId: 'p4',
    doctorId: 'd3',
    date: '2026-04-18',
    time: '14:00',
    type: 'Procedure',
    status: 'completed',
    confirmationNumber: 'APT-2026-0998'
  },
  {
    id: 'a5',
    patientId: 'p5',
    doctorId: 'd1',
    date: '2026-04-19',
    time: '12:00',
    type: 'Emergency',
    status: 'scheduled',
    confirmationNumber: 'APT-2026-1004'
  }
];

export const mockNotes: Note[] = [
  {
    id: 'n1',
    patientId: 'p1',
    doctorId: 'd1',
    doctorName: 'Dr. Kavitha Iyer',
    date: '2026-03-10',
    content: 'Patient presented with stable blood pressure. Continuing current medications.'
  },
  {
    id: 'n2',
    patientId: 'p3',
    doctorId: 'd2',
    doctorName: 'Dr. Rohan Menon',
    date: '2026-02-15',
    content: 'HbA1c levels showing improvement. Advised lifestyle modifications.'
  }
];

export const mockUser = {
  id: 'u1',
  name: 'Nurse Johnson',
  role: 'nurse' as const,
  email: 'nurse@hospital.com'
};
import { create } from 'zustand';
import { Patient, Doctor, Appointment, Note } from '../types';
import { mockPatients, mockDoctors, mockAppointments, mockNotes } from '../data/mockData.ts';

interface AppState {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  notes: Note[];
  portalRole: 'nurse' | 'doctor';
  isSidebarOpen: boolean;
  
  setPortalRole: (role: 'nurse' | 'doctor') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (patientId: string, updates: Partial<Patient>) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void;
  addNote: (note: Note) => void;
  checkAppointmentConflict: (doctorId: string, date: string, time: string, excludeId?: string) => boolean;
}

export const useStore = create<AppState>((set) => ({
  patients: mockPatients,
  doctors: mockDoctors,
  appointments: mockAppointments,
  notes: mockNotes,
  portalRole: 'doctor',
  isSidebarOpen: false,

  setPortalRole: (role) => set({ portalRole: role }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  
  addPatient: (patient) => set((state) => ({ 
    patients: [patient, ...state.patients] 
  })),

  updatePatient: (patientId, updates) => set((state) => ({
    patients: state.patients.map(p => p.id === patientId ? { ...p, ...updates } : p)
  })),

  addAppointment: (appointment) => set((state) => ({
    appointments: [appointment, ...state.appointments]
  })),

  updateAppointmentStatus: (appointmentId, status) => set((state) => ({
    appointments: state.appointments.map(a => a.id === appointmentId ? { ...a, ...status } : a)
  })),

  addNote: (note) => set((state) => ({
    notes: [note, ...state.notes]
  })),

  checkAppointmentConflict: (doctorId, date, time, excludeId) => {
    // Get current state
    const state = get();
    return state.appointments.some(appointment => 
      appointment.doctorId === doctorId &&
      appointment.date === date &&
      appointment.time === time &&
      appointment.status === 'scheduled' &&
      appointment.id !== excludeId
    );
  }
}));

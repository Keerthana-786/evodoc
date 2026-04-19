import { create } from 'zustand';
import { Patient, Doctor, Appointment, Note, User, Role } from '../types';
import { mockPatients, mockDoctors, mockAppointments, mockNotes, mockUser } from '../data/mockData.ts';

interface AppState {
  // Data
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  visitNotes: Note[];
  user: User;

  // UI State
  currentRole: Role;
  isLoading: boolean;
  searchQuery: string;

  // Actions
  setCurrentRole: (role: Role) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;

  // Patient actions
  addPatient: (patient: Omit<Patient, 'id' | 'mrn' | 'createdAt' | 'updatedAt'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;

  // Appointment actions
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;

  // Visit notes actions
  addVisitNote: (note: Omit<VisitNote, 'id' | 'createdAt'>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial data
  patients: mockPatients,
  doctors: mockDoctors,
  appointments: mockAppointments,
  visitNotes: mockNotes,
  user: mockUser,

  // UI State
  currentRole: 'doctor',
  isLoading: false,
  searchQuery: '',

  // Actions
  setCurrentRole: (role) => set({ currentRole: role }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setLoading: (loading) => set({ isLoading: loading }),

  // Patient actions
  addPatient: (patientData) => {
    const newPatient: Patient = {
      ...patientData,
      id: Date.now().toString(),
      mrn: `MRN-2026-${String(get().patients.length + 1).padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ patients: [...state.patients, newPatient] }));
  },

  updatePatient: (id, updates) => {
    set((state) => ({
      patients: state.patients.map((patient) =>
        patient.id === id
          ? { ...patient, ...updates, updatedAt: new Date().toISOString() }
          : patient
      ),
    }));
  },

  // Appointment actions
  addAppointment: (appointmentData) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ appointments: [...state.appointments, newAppointment] }));
  },

  updateAppointment: (id, updates) => {
    set((state) => ({
      appointments: state.appointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, ...updates, updatedAt: new Date().toISOString() }
          : appointment
      ),
    }));
  },

  cancelAppointment: (id) => {
    get().updateAppointment(id, { status: 'cancelled' });
  },

  // Visit notes actions
  addVisitNote: (noteData) => {
    const newNote: VisitNote = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ visitNotes: [...state.visitNotes, newNote] }));
  },
}));
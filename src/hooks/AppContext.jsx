import { createContext, useState, useEffect, useContext } from "react";
import { PATIENTS, DOCTORS, INIT_APPTS, INIT_NOTES } from "../data/mockData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [notes, setNotes] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeState = async () => {
      setLoading(true);
      try {
        const stored = localStorage.getItem("evodoc_data");
        if (stored) {
          const data = JSON.parse(stored);
          setPatients(data.patients || PATIENTS);
          setAppointments(data.appointments || INIT_APPTS);
          setDoctors(data.doctors || DOCTORS);
          setNotes(data.notes || INIT_NOTES);
        } else {
          setPatients(PATIENTS);
          setAppointments(INIT_APPTS);
          setDoctors(DOCTORS);
          setNotes(INIT_NOTES);
        }
      } catch (e) {
        console.error("Failed to load state", e);
        setPatients(PATIENTS);
        setAppointments(INIT_APPTS);
        setDoctors(DOCTORS);
        setNotes(INIT_NOTES);
      }
      setLoading(false);
    };
    initializeState();
  }, []);

  // Save to local storage on changes (Persistence)
  useEffect(() => {
    if (!loading && patients.length && appointments.length) {
      localStorage.setItem("evodoc_data", JSON.stringify({
        patients, appointments, doctors, notes
      }));
    }
  }, [patients, appointments, doctors, notes, loading]);

  // ===== TOAST SYSTEM =====
  const addToast = (message, type = "success", duration = 3500) => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id) => setToasts(p => p.filter(t => t.id !== id));

  // ===== PATIENT MANAGEMENT =====
  const addPatient = (patientData) => {
    try {
      const newPatient = { ...patientData, id: Date.now() };
      setPatients(p => [...p, newPatient]);
      addToast("✓ Patient added successfully", "success");
      return newPatient;
    } catch (e) {
      addToast("Failed to add patient", "error");
      return null;
    }
  };

  const updatePatient = (patientId, patientData) => {
    try {
      setPatients(p => p.map(patient =>
        patient.id === patientId ? { ...patient, ...patientData } : patient
      ));
      addToast("✓ Patient record updated", "success");
      return true;
    } catch (e) {
      addToast("Failed to update patient", "error");
      return false;
    }
  };

  const getPatientById = (patientId) => patients.find(p => p.id === patientId);

  const getPatientByName = (name) => patients.find(p =>
    p.name.toLowerCase().includes(name.toLowerCase())
  );

  const searchPatients = (query) => patients.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.contact.includes(query)
  );

  // ===== APPOINTMENT MANAGEMENT =====
  const addAppointment = (appointmentData) => {
    try {
      // Check for time conflict
      const existingAppt = appointments.find(a =>
        a.doctorId === appointmentData.doctorId &&
        a.date === appointmentData.date &&
        a.time === appointmentData.time &&
        a.status !== 'cancelled'
      );
      if (existingAppt) {
        addToast("⚠️ Time conflict: Doctor already has an appointment at this time", "error");
        return null;
      }

      const newAppointment = {
        ...appointmentData,
        id: Date.now(),
        status: "scheduled"
      };
      setAppointments(p => [...p, newAppointment]);
      addToast("✓ Appointment booked successfully", "success");
      return newAppointment;
    } catch (e) {
      addToast("Failed to book appointment", "error");
      return null;
    }
  };

  const updateAppointment = (appointmentId, appointmentData) => {
    try {
      setAppointments(p => p.map(appt =>
        appt.id === appointmentId ? { ...appt, ...appointmentData } : appt
      ));
      addToast("✓ Appointment updated", "success");
      return true;
    } catch (e) {
      addToast("Failed to update appointment", "error");
      return false;
    }
  };

  const updateAppointmentStatus = (id, status) => {
    updateAppointment(id, { status });
  };

  const getAppointmentsByDoctor = (doctorId, date = null) => {
    return appointments.filter(a => {
      const docMatch = a.doctorId === doctorId;
      const dateMatch = !date || a.date === date;
      return docMatch && dateMatch;
    });
  };

  const getAppointmentsByPatient = (patientId) =>
    appointments.filter(a => a.patientId === patientId);

  const getAppointmentsByDate = (date) =>
    appointments.filter(a => a.date === date);

  const getAppointmentsByStatus = (status) =>
    appointments.filter(a => a.status === status);

  const getUpcomingAppointments = (limit = 10) => {
    const today = new Date().toISOString().split('T')[0];
    return appointments
      .filter(a => a.date >= today && a.status === "scheduled")
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, limit);
  };

  // ===== CLINICAL NOTES MANAGEMENT =====
  const addNote = (noteData) => {
    try {
      const newNote = {
        ...noteData,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0]
      };
      setNotes(p => [...p, newNote]);
      addToast("✓ Clinical note added", "success");
      return newNote;
    } catch (e) {
      addToast("Failed to add note", "error");
      return null;
    }
  };

  const getNotesByPatient = (patientId) =>
    notes.filter(n => n.patientId === patientId).sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );

  // ===== DOCTOR MANAGEMENT =====
  const getDoctorById = (doctorId) => doctors.find(d => d.id === doctorId);

  const getDoctorBySpecialty = (specialty) =>
    doctors.filter(d => d.specialty.toLowerCase().includes(specialty.toLowerCase()));

  const getAvailableDoctors = () =>
    doctors.filter(d => d.available === true);

  // ===== DASHBOARD STATS =====
  const getDashboardStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppts = appointments.filter(a => a.date === today);
    const scheduledToday = todayAppts.filter(a => a.status === "scheduled").length;
    const completedToday = todayAppts.filter(a => a.status === "completed").length;

    return {
      totalPatients: patients.length,
      totalAppointments: appointments.length,
      appointmentsToday: todayAppts.length,
      scheduledToday,
      completedToday,
      totalDoctors: doctors.length,
      availableDoctors: doctors.filter(d => d.available).length
    };
  };

  const getContextValue = {

    patients,
    addPatient,
    updatePatient,
    getPatientById,
    getPatientByName,
    searchPatients,

    appointments,
    addAppointment,
    updateAppointment,
    updateAppointmentStatus,
    getAppointmentsByDoctor,
    getAppointmentsByPatient,
    getAppointmentsByDate,
    getAppointmentsByStatus,
    getUpcomingAppointments,

    notes,
    addNote,
    getNotesByPatient,

    doctors,
    getDoctorById,
    getDoctorBySpecialty,
    getAvailableDoctors,


    toasts,
    addToast,
    removeToast,


    loading,
    getDashboardStats
  };

  return (
    <AppContext.Provider value={getContextValue}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

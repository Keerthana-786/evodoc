import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/shared/AppShell';
import { ToastProvider } from './components/ui/toast';

// Lazy loading pages
const Dashboard = lazy(() => import('./pages/doctor/Dashboard'));
const DoctorAppointments = lazy(() => import('./pages/doctor/Appointments'));
const PatientDetails = lazy(() => import('./pages/doctor/PatientDetails'));
const PatientIntake = lazy(() => import('./pages/nurse/PatientIntake'));
const AppointmentList = lazy(() => import('./pages/nurse/AppointmentList'));
const AppointmentRegistration = lazy(() => import('./pages/nurse/AppointmentRegistration'));
const PatientVault = lazy(() => import('./pages/doctor/PatientVault'));

const App = () => {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/doctor/dashboard" replace />} />
        
        {/* Shared Shell Routes */}
        <Route element={<AppShell />}>
          {/* Nurse Portal */}
          <Route path="nurse/intake" element={<PatientIntake />} />
          <Route path="nurse/appointments" element={<AppointmentList />} />
          <Route path="nurse/appointments/new" element={<AppointmentRegistration />} />

          {/* Doctor Portal */}
          <Route path="doctor/dashboard" element={<Dashboard />} />
          <Route path="doctor/appointments" element={<DoctorAppointments />} />
          <Route path="doctor/patients" element={<PatientVault />} />
          <Route path="doctor/patients/:id" element={<PatientDetails />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  );
};

export default App;

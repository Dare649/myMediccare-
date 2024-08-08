import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import Signin from "./auth/Signin";
import OtpVerification from "./auth/OtpVerification";
import Signup from "./auth/Signup";
import Terms from "./terms_conditions/Terms";
import PatientProtectedRoute from './components/PatientProtectedRoute';
import PatientPrescriptions from "./pages/patient/PatientPrescriptions";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientNotification from './pages/patient/PatientNotification';
import PatientSettings from './pages/patient/PatientSettings';
import PatientMonitoring from "./pages/patient/PatientMonitoring";

const App = () => {
  const { token } = useAuthContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/terms-&-conditions" element={<Terms />} />
        {!token ? (
          <Route path="*" element={<Navigate to="/sign-in" replace />} />
        ) : (
          <>
            <Route element={<PatientProtectedRoute />}>
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/patient-appointments" element={<PatientAppointments />} />
              <Route path="/patient-prescription" element={<PatientPrescriptions />} />
              <Route path="/patient-settings" element={<PatientSettings />} />
              <Route path="/patient-notifications" element={<PatientNotification />} />
              <Route path="/patient-monitoring" element={<PatientMonitoring />} />
              <Route path="*" element={<Navigate to="/patient-dashboard" replace />} />
            </Route>
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;

import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
import { IntentProvider } from "./context/IntentContext";
import { DoctorProvider } from './context/DoctorContext';

// Pages and Components
import Home from "./pages/Home";
import Signin from "./auth/Signin";
import OtpVerification from "./auth/OtpVerification";
import Signup from "./auth/sign-up/Signup";
import Terms from "./terms_conditions/Terms";
import PatientProtectedRoute from './components/PatientProtectedRoute';
import PatientPrescriptions from "./pages/patient/PatientPrescriptions";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientNotification from './pages/patient/PatientNotification';
import PatientSettings from './pages/patient/PatientSettings';
import PatientMonitoring from "./pages/patient/PatientMonitoring";
import PatientWallet from "./pages/patient/PatientWallet";
import StripePayment from "./pages/patient/StripePayment";
import BookAppointment from './pages/patient/book-appointments/BookAppointment';
import DoctorDashboard from "./pages/doctors/dashboard/DoctorDashboard";
import DoctorRoute from "./components/DoctorRoute";
import Settings from "./pages/doctors/settings/Settings";

const App = () => {
  // Destructure token and user from AuthContext
  const { token, user } = useAuthContext();
  
  return (
    <BrowserRouter>
      <DoctorProvider>
        <IntentProvider>
          <Routes>
            {/* Routes for unauthenticated users */}
            {!token ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<Signin />} />
                <Route path="/sign-up" element={<Signup />} />
                <Route path="/otp-verification" element={<OtpVerification />} />
                <Route path="/terms-&-conditions" element={<Terms />} />
                <Route path="*" element={<Navigate to="/sign-in" replace />} />
              </>
            ) : (
              // Routes for authenticated users
              <>
                {user?.role === "patient" ? (
                  <>
                    <Route element={<PatientProtectedRoute />}>
                      <Route path="/patient-dashboard" element={<PatientDashboard />} />
                      <Route path="/patient-appointments" element={<PatientAppointments />} />
                      <Route path="/patient-prescriptions" element={<PatientPrescriptions />} />
                      <Route path="/patient-settings" element={<PatientSettings />} />
                      <Route path="/patient-notifications" element={<PatientNotification />} />
                      <Route path="/patient-monitoring" element={<PatientMonitoring />} />
                      <Route path="/patient-wallet" element={<PatientWallet />} />
                      <Route path="/stripe-payment" element={<StripePayment />} />
                      <Route path="/book-appointment" element={<BookAppointment />} />
                      <Route path="*" element={<Navigate to="/patient-dashboard" replace />} />
                    </Route>
                  </>
                ) : (
                  // Routes for doctors or other roles
                  <>
                    <Route element={<DoctorRoute/>}>
                      <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                      <Route path="/doctor-settings" element={<Settings />} />
                      <Route path="*" element={<Navigate to="/doctor-dashboard" replace />} />
                    </Route>
                  </>
                )}
              </>
            )}
          </Routes>
        </IntentProvider>
      </DoctorProvider>
    </BrowserRouter>
  );
};

export default App;

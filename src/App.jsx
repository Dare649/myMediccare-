import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
import { IntentProvider } from "./context/IntentContext";
import { CardProvider } from './context/CardContext';
import { DoctorProvider } from './context/DoctorContext';
import Client from './context/Client';



// Pages and Components
import Home from "./pages/Home";
import Signin from "./auth/Signin";
import OtpVerification from "./auth/OtpVerification";
import Signup from "./auth/sign-up/Signup";
import Terms from "./terms_conditions/Terms";
import PatientProtectedRoute from './components/PatientProtectedRoute';
import PatientPrescriptions from "./pages/patient/medications/PatientPrescriptions";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientNotification from './pages/patient/PatientNotification';
import PatientSettings from './pages/patient/PatientSettings';
import PatientWallet from "./pages/patient/PatientWallet";
import StripePayment from "./pages/patient/strip-payment/StripePayment";
import CardPayment from "./pages/patient/strip-payment/CardPayment";
import BookAppointment from './pages/patient/book-appointments/BookAppointment';
import DoctorDashboard from "./pages/doctors/dashboard/DoctorDashboard";
import DoctorRoute from "./components/DoctorRoute";
import Settings from "./pages/doctors/settings/Settings";
import DoctorAppointment from './components/video/DoctorAppointment';
import Records from './pages/patient/records/Records';
import Appointments from './pages/doctors/consultation/Appointments';
import VideoCall from "./components/call/VideoCall";
import PrescriptionList from './pages/patient/medications/PrescriptionList';
import ConsultationPrescriptionList from "./pages/patient/medications/ConsultationPrecriptionList";
import ViewPatient from "./pages/doctors/patient/ViewPatient";


const App = () => {
  // Destructure token and user from AuthContext
  const { token, user } = useAuthContext();

  return (
    <BrowserRouter>
      <DoctorProvider>
        <IntentProvider>
        <CardProvider>
          <Client>
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
                      <Route path="/patient-schedules" element={<PatientAppointments />} />
                      <Route path="/patient-medications" element={<PatientPrescriptions />} />
                      <Route path="/patient-settings" element={<PatientSettings />} />
                      <Route path="/patient-notifications" element={<PatientNotification />} />
                      <Route path="/patient-prescription-list/:id" element={<PrescriptionList />} />
                      <Route path="/patient-consultation-prescription-list/:id" element={<ConsultationPrescriptionList />} />
                      <Route path="/patient-transactions" element={<PatientWallet />} />
                      <Route path="/stripe-payment" element={<StripePayment />} />
                      <Route path="/card-payment" element={<CardPayment />} />
                      <Route path="/book-appointment" element={<BookAppointment />} />
                      <Route path="/consultation-video-call" element={<VideoCall />} />
                      <Route path="/patient-records" element={<Records />} />
                      <Route path="*" element={<Navigate to="/patient-dashboard" replace />} />
                    </Route>
                  </>
                ) : (
                  // Routes for doctors or other roles
                  <>
                    <Route element={<DoctorRoute/>}>
                      <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                      <Route path="/doctor-profile" element={<Settings />} />
                      <Route path="/doctor-appointments" element={<Appointments />} />
                      <Route path="/view-patient/:id" element={<ViewPatient />} />
                      {/* <Route path="/consultation-video-call" element={<VideoRoom />} /> */}
                      <Route path="/consultation-video-call" element={<VideoCall />} />
                      <Route path="/agora-video-call" element={<DoctorAppointment />} />
                      <Route path="*" element={<Navigate to="/doctor-dashboard" replace />} />
                    </Route>
                  </>
                )}
              </>
            )}
          </Routes>
          </Client>
        </CardProvider>
        </IntentProvider>
      </DoctorProvider>
    </BrowserRouter>
  );
};

export default App;

import { useState } from "react";
import SelectAppointment from "../book-appointments/SelectAppointment";
import Appointment from "../book-appointments/Appointment";
import AvailableDoctor from "../book-appointments/AvailableDoctor";
import BookingSummary from "../book-appointments/BookingSummary";
import Payment from "../book-appointments/Payments";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { axiosClient } from "../../../axios"; // Adjust path as needed
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

// Utility function to format the date in dd-mm-yyyy format
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const BookAppointment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const MySwal = withReactContent(Swal);
  const [formData, setFormData] = useState({
    date: "",
    start_time: "",
    time_slot: "",
    payment_method: "",
    type: "",
    symptoms: "",
    amount: "",
    payment_status: "",
  });

  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formattedData = {
        ...formData,
        date: formatDate(new Date(formData.date)), // Ensure date is formatted correctly
      };
      const response = await axiosClient.post(
        `/api/patient/doctor/${formData.doctorId}/book_appt`,
        formattedData
      );
      setLoading(false);
      MySwal.fire({
        icon: "success",
        title: "Success",
        text: response?.data?.message,
      }).then(()=>{
        window.location.reload("/patient-appointments");
      });
      // Redirect user or show a success message here
    } catch (error) {
      setLoading(false);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "An error occurred",
      });
    }
  };

  return (
    <section className="w-full h-full lg:p-5 sm:p-0">
      <div className="lg:p-10 sm:p-2 bg-white rounded-lg w-full h-full">
        <div className="flex flex-row items-center gap-x-10 mb-10">
          <button
            onClick={prevStep}
            className="bg-primary-100 p-3 text-white font-bold rounded-lg"
          >
            <FaLongArrowAltLeft />
          </button>
          <button
            onClick={nextStep}
            className="bg-primary-100 p-3 text-white font-bold rounded-lg"
          >
            <FaLongArrowAltRight />
          </button>
        </div>

        {currentStep === 1 && (
          <SelectAppointment
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        )}
        {currentStep === 2 && (
          <AvailableDoctor
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        )}
        {currentStep === 3 && (
          <Appointment
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        )}
        {currentStep === 4 && (
          <Payment
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {currentStep === 5 && (
          <BookingSummary
            formData={formData}
            handleSubmit={handleSubmit}
            prevStep={prevStep}
          />
        )}
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </section>
  );
};

export default BookAppointment;

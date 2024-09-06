import { useState, useEffect } from "react";
import { axiosClient } from "../../../axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

const Payment = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [consultationTypes, setConsultationTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [localData, setLocalData] = useState({
    amount: formData.amount || "",
    payment_status: formData.payment_status || "full", // Defaulting to "full"
    payment_method: formData.payment_method || "", // Payment method is set to wallet
    consultation_type: formData.consultation_type || "",
  });
  const MySwal = withReactContent(Swal);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLocalData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "consultation_type" || name === "payment_status") {
      const selectedType = consultationTypes.find(
        (type) => type.name === (name === "consultation_type" ? value : localData.consultation_type)
      );
      const selectedAmount = value === "full" ? selectedType.full_amount : selectedType.partial_amount;

      setLocalData((prev) => ({
        ...prev,
        amount: selectedAmount,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    const fetchAmounts = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/api/patient/appt/get_price/oc");
        setConsultationTypes(response.data.data || []);

        if (response.data.data && response.data.data.length > 0) {
          const initialType = response.data.data[0];
          setLocalData((prev) => ({
            ...prev,
            consultation_type: initialType.name,
            amount: initialType.full_amount,
          }));
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        MySwal.fire({
          text: error?.response?.data?.message || "An error occurred while fetching the amount",
          icon: "error",
          title: "Error",
        });
      }
    };

    fetchAmounts();
  }, []);

  const handleNext = async () => {
    // Update form data with the latest values
    updateFormData({
      ...formData,
      amount: localData.amount,
      payment_status: localData.payment_status,
      payment_method: localData.payment_method,
      consultation_type: localData.consultation_type,
    });
    nextStep(); 
  
    // // Check if the payment method is 'card'
    // if (localData.payment_method === "card") {
    //   try {
    //     setLoading(true);
    //     // Make an async call to the API to create the payment intent
    //     const response = await axiosClient.post("/api/patient/make_intent", {
    //       amount: localData.amount,
    //     });
    //     setLoading(false);
  
    //     // Navigate to the Stripe payment page upon successful intent creation
    //     if (response.data.success) {
    //       navigate("/stripe-payment");
    //     } else {
    //       // Handle API failure (optional: show an error message)
    //       console.error("Error creating payment intent:", response.data.message);
    //     }
    //   } catch (error) {
    //     // Handle errors during the API call
    //     console.error("Error during payment intent creation:", error);
    //   }
    // } else {
    //   // Proceed to the next step if the payment method is not 'card'
    //   nextStep();
    // }
  };
  

  return (
    <section className="lg:w-[50%] sm:w-full flex flex-col items-center justify-center mx-auto border-2 border-neutral-50 rounded-lg lg:p-3 sm:p-1 mb-8">
      <h2 className="capitalize lg:text-xl sm:lg px-5 font-bold">Payment</h2>
      <div className="w-full px-5">
        <div className="w-full my-3">
          <h2 className="font-semibold lg:text-lg sm:text-md mb-2 capitalize">Consultation Type</h2>
          <select
            className="outline-none border-2 border-neutral-50 focus:border-primary-100 px-3 py-2 w-full rounded-md capitalize"
            name="consultation_type"
            value={localData.consultation_type}
            onChange={handleChange}
          >
            {consultationTypes.map((type) => (
              <option key={type.name} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full my-3">
          <h2 className="font-semibold lg:text-lg sm:text-md mb-2 capitalize">payment method</h2>
          <select 
            name="payment_method"
            className="outline-none border-2 border-neutral-50 focus:border-primary-100 px-3 py-2 w-full rounded-md capitalize"
            value={localData.payment_method}
            onChange={handleChange}
          >
            <option value="">--select payment method--</option>
            <option value="wallet">wallet</option>
            <option value="stripe_status">card</option>
          </select>
        </div>
        <div className="w-full my-3">
          <h2 className="font-semibold lg:text-lg sm:text-md mb-2 capitalize">Payment Status</h2>
          <select
            className="outline-none border-2 border-neutral-50 focus:border-primary-100 px-3 py-2 w-full rounded-md capitalize"
            name="payment_status" // Using payment_status
            value={localData.payment_status}
            onChange={handleChange}
          >
            <option value="full">Full</option> {/* Changed to "full" */}
            <option value="partial">Partial</option> {/* Changed to "partial" */}
          </select>
        </div>
        <div className="w-full my-3">
          <h2 className="font-semibold lg:text-lg sm:text-md mb-2 capitalize">Amount</h2>
          <input
            type="text"
            className="outline-none border-2 border-neutral-50 focus:border-primary-100 px-3 py-2 w-full rounded-md"
            name="amount"
            placeholder="Amount"
            value={localData.amount}
            readOnly
          />
        </div>
        <div className="w-full mb-8">
          
          <button
            onClick={handleNext}
            disabled={loading}
            className="capitalize font-bold text-center bg-primary-100 w-full py-4 text-white rounded-lg"
          >
            {loading ? <CircularProgress color="inherit" />: "next"}
          </button>
        </div>
      </div>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </section>
  );
};

export default Payment;

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { FaRegCreditCard, FaArrowLeftLong } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { axiosClient } from "../../../axios";

// Load Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_MEDICARE_APP_STRIPE_KEY);

const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const StripeForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);
    const [cardData, setCardData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); // Added isProcessing state
    const location = useLocation();
    const { formData } = location.state || {};

    const handlePaymentIntent = async () => {
        if (!formData?.amount) {
            setError("Amount is required");
            return;
        }
    
        try {
            setLoading(true);
            const response = await axiosClient.post("/api/patient/make_intent", formData);
    
    
            if (response.data.error) {
                throw new Error(response.data.message);
            }
    
            // Ensure client secret is being saved
            setCardData({
                amount: formData.amount,
                paymentIntent: response.data.paymentIntent,
                ephemeralKey: response.data.ephemeralKey,
                customer: response.data.customer,
                publishableKey: response.data.publishableKey,
            });
    
            return response.data;
        } catch (error) {
            console.error("Payment Intent Error:", error);
            MySwal.fire({
                title: "Error",
                icon: "error",
                text: error.message || "An error occurred. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (isProcessing) return;
        setIsProcessing(true);
    
        const response = await handlePaymentIntent();
        if (!stripe || !elements) {
            setIsProcessing(false);
            return;
        }
    
        try {
            if (!cardData?.paymentIntent) {
                throw new Error("Client secret is missing. Please check your backend response.");
            }
    
    
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(cardData.paymentIntent, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                },
            });
    
            if (stripeError) {
                setError(stripeError.message);
                console.error("Stripe Error:", stripeError);
                return;
            }
    
            if (paymentIntent && paymentIntent.status === "succeeded") {
                console.log("Payment Successful:", paymentIntent);
    
                const updatedFormData = {
                    ...formData,
                    stripe_id: cardData.customer || '',
                    stripe_status: paymentIntent.status,
                };
    
                const formattedData = {
                    ...updatedFormData,
                    date: formatDate(new Date(formData.date)),
                };
    
                const response = await axiosClient.post(`/api/patient/doctor/${formData.doctorId}/book_appt`, formattedData);
    
                if (response.data.status === 1) {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Appointment booked successfully!",
                    }).then(() => {
                        navigate("/patient-schedules");
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: response?.data?.message,
                    }).then(() => {
                        navigate("/patient-schedules");
                    });
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Payment failed.",
                });
            }
        } catch (error) {
            console.error("Submission Error:", error);
            setError("An error occurred. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };
    

    return (
        <section className="lg:mt-40 sm:mt-10 w-full h-full lg:p-5 sm:p-0">
            <div className="lg:p-10 sm:p-2 bg-white rounded-lg w-full h-full">
                <h2 className="lg:text-2xl sm:text-lg font-bold text-center">
                    Complete Your Payment
                </h2>
                {/* {error && (
                    <div className="text-red-600 text-center font-semibold mb-2">
                        {error}
                    </div>
                )} */}
                <form className="max-w-lg m-auto p-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <div className="relative flex items-center justify-start border-2 border-gray-300 rounded-md mb-4 p-3">
                            <FaRegCreditCard className="absolute top-2 left-2 text-gray-600" size={30} />
                            <CardNumberElement
                                className="w-full ml-8 text-base font-medium"
                                options={{
                                    style: {
                                        base: {
                                            fontSize: "16px",
                                            color: "#424770",
                                            letterSpacing: "0.025em",
                                            fontFamily: "Source Code Pro, monospace",
                                            "::placeholder": {
                                                color: "#aab7c4",
                                            },
                                        },
                                        invalid: {
                                            color: "#9e2146",
                                        },
                                    },
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center justify-start border-2 border-gray-300 rounded-md p-3">
                                <CardExpiryElement
                                    className="w-full ml-2 text-base font-medium"
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: "16px",
                                                color: "#424770",
                                                letterSpacing: "0.025em",
                                                fontFamily: "Source Code Pro, monospace",
                                                "::placeholder": {
                                                    color: "#aab7c4",
                                                },
                                            },
                                            invalid: {
                                                color: "#9e2146",
                                            },
                                        },
                                    }}
                                />
                            </div>
                            <div className="flex items-center justify-start border-2 border-gray-300 rounded-md p-3">
                                <CardCvcElement
                                    className="w-full ml-2 text-base font-medium"
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: "16px",
                                                color: "#424770",
                                                letterSpacing: "0.025em",
                                                fontFamily: "Source Code Pro, monospace",
                                                "::placeholder": {
                                                    color: "#aab7c4",
                                                },
                                            },
                                            invalid: {
                                                color: "#9e2146",
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            className="w-full p-3 text-white bg-primary-100 font-bold rounded-md mt-4"
                            type="submit"
                            disabled={!stripe || loading}
                        >
                            {loading ? "Processing..." : "Pay Now"}
                        </button>
                    </div>
                </form>
                <div className="text-center mt-4">
                    <Link to="/patient-schedules" className="text-primary-100 underline">
                        <FaArrowLeftLong size={20} className="inline mr-2" />
                        Return to Booking Page
                    </Link>
                </div>
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

const StripeContainer = () => (
    <Elements stripe={stripePromise}>
        <StripeForm />
    </Elements>
);

export default StripeContainer;

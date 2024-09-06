import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import { useIntentContext } from "../../context/IntentContext";
import { axiosClient } from "../../axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaRegCreditCard, FaArrowLeftLong  } from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";

// Load Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_MEDICARE_APP_STRIPE_KEY);

const StripeForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { intentData } = useIntentContext(); // Getting intentData from context
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        try {
            setLoading(true);

            if (!intentData || !intentData.paymentIntent) {
                throw new Error("Client secret is missing. Please check your backend response.");
            }

            const clientSecret = intentData.paymentIntent;

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                },
            });

            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }

            // Check if the payment succeeded
            if (paymentIntent && paymentIntent.status === 'succeeded') {
                // The payment was successful
                console.log("Payment succeeded:", paymentIntent);

                // Calculate the amount by dividing by 100 and ensure it's a number
                const amountReceived = paymentIntent.amount;
                const amountInCurrency = amountReceived ? Number(amountReceived) / 100 : 0;

                // Ensure amountInCurrency is a number
                console.log('Amount:', amountInCurrency, 'Type:', typeof amountInCurrency);

                // Proceed with further actions, e.g., making a deposit
                const depositData = {
                    amount: amountInCurrency, // Amount divided by 100
                    customer_id: intentData.customer,
                    status: paymentIntent.status, // Use the status from paymentIntent
                    payment_method_id: paymentIntent.payment_method,
                };

                // Log depositData before sending
                console.log('Deposit Data:', depositData);

                const response = await axiosClient.post("/api/patient/wallet/make_deposit", depositData);

                if (response.data.status === 1) {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Deposit successful!" || response?.data?.message,
                    }).then(() => {
                        navigate("/patient-wallet");
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: response?.data?.message,
                    }).then(() => {
                        navigate("/stripe-payment");
                    });
                }

            } else {
                // Handle unsuccessful payment
                setError("Payment failed. Please try again.");
            }

            setLoading(false);
        } catch (err) {
            setError(err.message || "An error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <section className='w-full lg:p-10 sm:p-2'>
            <div className="bg-white rounded-lg pb-8">
                <div className='w-full lg:p-5 sm:p-3 flex flex-row items-center justify-between'>
                    <h2 className="font-bold first-letter:capitalize lg:text-2xl sm:text-lg">Enter Card Details</h2>
                    <Link to={"/patient-wallet"}>
                        <FaArrowLeftLong className='text-2xl cursor-pointer hover:text-primary-100' />
                    </Link>
                </div>
                <div className="lg:w-[50%] sm:w-full mx-auto">
                    <div className="mt-4  p-2 rounded w-full">
                        <div className="flex flex-row items-center gap-1 lg:text-lg sm:text-md font-bold capitalize">
                            <FaRegCreditCard/>
                            <h4>card number</h4>
                        </div>
                        <CardNumberElement className="p-2 mb-2 border-2 border-black rounded-lg w-full" />
                        <div className="flex flex-row items-center gap-1 lg:text-lg sm:text-md font-bold capitalize">
                            <FaRegCalendarAlt/>
                            <h4>expiry date</h4>
                        </div>
                        <CardExpiryElement className="p-2 mb-2 border-2 border-black rounded-lg w-full" />
                        <div className="flex flex-row items-center gap-1 lg:text-lg sm:text-md font-bold capitalize">
                            <FaRegCreditCard/>
                            <h4>cvv</h4>
                        </div>
                        <CardCvcElement className="p-2 border-2 border-black rounded-lg w-full" />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="w-[50%] flex items-center justify-center mx-auto">
                        <button 
                            onClick={handleSubmit} 
                            className=" px-4 py-2 bg-primary-100 text-white  text-center w-full rounded-lg"
                            disabled={!stripe || loading}
                        >
                            {loading ? "Processing..." : "Pay Now"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

const StripePayment = () => {
    return (
        <Elements stripe={stripePromise}>
            <StripeForm />
        </Elements>
    );
};

export default StripePayment;

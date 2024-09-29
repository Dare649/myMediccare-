import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { axiosClient } from "../axios";

const DoctorRating = ({ booking_id, handleClose }) => {
  const MySwal = withReactContent(Swal);
  const [formData, setFormData] = useState({
    rating: "",
    review: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};
    if (!formData.rating) {
      formErrors.rating = "Rating is required.";
    }
    if (!formData.review) {
      formErrors.review = "Review is required.";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await axiosClient.post(`/api/patient/appt/${booking_id}/send_review`, formData);
      setLoading(false);
      MySwal.fire({
        text: "Doctor rating was successful.",
        title: "Success",
        icon: "success",
      }).then(() => {
        handleClose();
        window.location.reload();
      });
    } catch (error) {
      setLoading(false);
      MySwal.fire({
        text: "Doctor rating failed, try again later.",
        title: "Error",
        icon: "error",
      }).then(() => {
        handleClose();
      });
    }
  };

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
    setErrors({ ...errors, rating: "" }); // Clear error if user selects a rating
  };

  return (
    <section className="lg:w-[50%] sm:w-full bg-white flex flex-col items-center justify-center rounded-lg lg:p-0 sm:p-5">
      <div className="w-full lg:p-5 sm:p-3 flex flex-row items-center justify-between ">
        <h2 className="font-bold capitalize lg:text-xl sm:text-mg">Rate Doctor</h2>
        <IoMdClose size={30} onClick={handleClose} className="text-red-500 cursor-pointer" />
      </div>
      <hr className="w-full bg-neutral-100 my-5" />
      <div className="w-full lg:p-5 sm:p-3">
        <form className="w-full" onSubmit={handleReview}>
          <div className="w-full flex flex-col items-center justify-center mx-auto">
            <h2 className="text-primary-100 font-bold capitalize mb-3">Ratings</h2>
            <div className="flex flex-row gap-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleRatingChange(star)}
                  className={`cursor-pointer hover:text-yellow-400 text-4xl ${
                    formData.rating >= star ? "text-yellow-400" : "text-neutral-50"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            {errors.rating && <p className="text-red-500 mt-2">{errors.rating}</p>}
          </div>
          <div className="w-full lg:my-3 sm:my-2">
            <h2 className="text-primary-100 font-bold capitalize mb-3">Review</h2>
            <textarea
              name="review"
              value={formData.review}
              onChange={(e) => {
                setFormData({ ...formData, review: e.target.value });
                setErrors({ ...errors, review: "" }); // Clear error if user enters review
              }}
              placeholder="Drop a review"
              className="outline-none border-2 border-neutral-50 p-2 w-full text-lg font-medium rounded-lg focus:border-primary-100"
            />
            {errors.review && <p className="text-red-500 mt-2">{errors.review}</p>}
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-primary-100 text-white text-center hover:text-primary-100 hover:bg-transparent lg:text-xl sm:text-md capitalize cursor-pointer hover:border-2 hover:border-primary-100 rounded-lg font-bold"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
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

export default DoctorRating;

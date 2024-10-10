// AddAccount.js
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { axiosClient } from "../../../axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuthContext } from "../../context/AuthContext";

const AddAccount = ({ handleClose, onClick }) => {
  const { updateUser } = useAuthContext(); // Use the context
  const [loading, setLoading] = useState(false);
  const MySwal = withReactContent(Swal);
  const [error, setError] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    sex: "",
    age: "",
    relationship: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});

    // Check if required fields are filled
    const requiredFields = ["name", "sex", "age", "relationship"];
    let formErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        formErrors[field] = `${field.replace("_", " ")} is required`;
      }
    });

    if (Object.keys(formErrors).length > 0) {
      setError(formErrors);
      return;
    }

    setLoading(true);

    try {
      console.log("Submitting formData:", formData); // Debugging line
      const response = await axiosClient.post("/api/patient/add_account", formData);
      setLoading(false);

      // Update user details in AuthContext
      updateUser(response.data.data.user); // Assuming response contains the new user data

      MySwal.fire({
        title: "Success!",
        text: "Account has been added successfully!",
        icon: "success",
      }).then(() => {
        handleClose();
      });
    } catch (error) {
      setLoading(false);
      console.error("Error submitting form:", error); // Debugging line
      MySwal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Something went wrong!",
        icon: "error",
      });
    }
  };

  return (
    <div className="lg:w-[50%] sm:w-full bg-white rounded-lg">
      <div className="flex flex-row items-center justify-between sm:p-2 lg:p-5">
        <h2 className="capitalize lg:text-2xl sm:text-lg font-bold">add account</h2>
        <IoMdClose size={30} className="text-red-500 font-bold cursor-pointer" onClick={onClick} />
      </div>
      <hr className="w-full bg-neutral-50 h-2 my-3" />
      <form onSubmit={handleSubmit} className="w-full sm:p-2 lg:p-5">
        <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-5">
          <div className="w-full">
            <h2 className="capitalize font-bold mb-2">name</h2>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              value={formData.name}
              className={`outline-none border-2 ${error.name ? "border-red-500" : "border-neutral-50"} p-2 w-full text-lg font-medium rounded-lg focus:border-primary-100`}
            />
            {error.name && <span className="text-red-500">{error.name}</span>}
          </div>
          <div className="w-full">
            <h2 className="capitalize font-bold mb-2">sex</h2>
            <select
              className={`outline-none border-2 ${error.sex ? "border-red-500" : "border-neutral-50"} p-2 w-full text-lg font-medium rounded-lg focus:border-primary-100 capitalize`}
              id="sex"
              name="sex"
              onChange={handleChange}
              value={formData.sex}
            >
              <option value="">--select sex--</option>
              <option value="male">male</option>
              <option value="female">female</option>
              <option value="it's complicated">it's complicated</option>
            </select>
            {error.sex && <span className="text-red-500">{error.sex}</span>}
          </div>
          <div className="w-full">
            <h2 className="capitalize font-bold mb-2">age</h2>
            <select
              className={`outline-none border-2 ${error.age ? "border-red-500" : "border-neutral-50"} p-2 w-full text-lg font-medium rounded-lg focus:border-primary-100`}
              id="age"
              name="age"
              onChange={handleChange}
              value={formData.age}
            >
              <option value="">--Select Age Group--</option>
              <option value="Infants/Toddlers: 0 - 2 years">Infants/Toddlers: 0 - 2 years</option>
              <option value="Children: 3 - 12 years">Children: 3 - 12 years</option>
              <option value="Teens/Adolescents: 13 - 17 years">Teens/Adolescents: 13 - 17 years</option>
              <option value="Young Adults: 18 - 25 years">Young Adults: 18 - 25 years</option>
              <option value="Adults: 26 - 40 years">Adults: 26 - 40 years</option>
              <option value="Middle-aged Adults: 41 - 60 years">Middle-aged Adults: 41 - 60 years</option>
              <option value="Seniors/Elderly: 61+ years">Seniors/Elderly: 61+ years</option>
            </select>
            {error.age && <span className="text-red-500">{error.age}</span>}
          </div>
          <div className="w-full">
            <h2 className="capitalize font-bold mb-2">relationship</h2>
            <input
              type="text"
              id="relationship"
              name="relationship"
              onChange={handleChange}
              value={formData.relationship}
              className={`outline-none border-2 ${error.relationship ? "border-red-500" : "border-neutral-50"} p-2 w-full text-lg font-medium rounded-lg focus:border-primary-100`}
            />
            {error.relationship && <span className="text-red-500">{error.relationship}</span>}
          </div>
        </div>
        <div className="mt-5">
          <button type="submit" className="bg-primary-100 p-2 rounded-lg text-white text-lg font-medium w-full hover:bg-primary-200">
            {loading ? <CircularProgress size={25} className="text-white" /> : "Add Account"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAccount;

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { axiosClient } from "../../../axios";
import { useParams, Link } from "react-router-dom";
import prescription from "../../../../public/images/prescription.png";
import allergies from "../../../../public/images/allergies.png";
import consultation from "../../../../public/images/consultation.png";
import special from "../../../../public/images/special.png";
import { FaArrowLeftLong } from "react-icons/fa6";

const ViewPatient = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const MySwal = withReactContent(Swal);
  const [allergiesOpen, setAllergiesOpen] = useState(false);
  const [specialNeedsOpen, setSpecialNeedsOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axiosClient.get(`/api/doctor/${id}/patient_details`);
        setData(response?.data?.data);
      } catch (error) {
        MySwal.fire({
          title: "Error",
          icon: "error",
          text: "Error fetching patient, try again.",
        });
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchPatient();
  }, [id]);


  const toggleAllergies = () => {
    setAllergiesOpen(!allergiesOpen);
  };

  const toggleSpecialNeeds = () => {
    setSpecialNeedsOpen(!specialNeedsOpen);
  };


  return (
    <section className="appointment w-full h-full lg:p-5 sm:p-2">
      <div className="sm:mt-20 mb-10 lg:mt-28">
        <Link className="text-primary-100 " to={"/doctor-appointments"}><FaArrowLeftLong size={30}/></Link>
      </div>
      <div className="lg:p-10 sm:p-2 bg-white rounded-lg w-full h-full  mb-10">
        <h2 className="lg:text-2xl sm:text-lg capitalize font-bold">patient details</h2>
      </div>
      <div className="lg:p-10 sm:p-2 bg-white rounded-lg w-full h-full"> 
        {loading ? (
          <p className="text-primary-100 capitalize text-center">loading...</p>
        ) : data ? (
          <div className="w-full">
            <h2 className="lg:text-xl sm:text-md font-bold capitalize">
              {data.username}
            </h2>
            <div className="w-full lg:px-2 sm:px-5">
              <h2 className="font-bold capitalize text-neutral-100 my-5">basic details</h2>
              <div className="w-full flex flex-col bg-neutral-1 lg:p-5 sm:p-2 rounded-md my-5">
                <div className="w-full flex flex-row items-center justify-between py-3 border-b-2 border-neutral-50">
                  <h2 className="text-neutral-50 font-bold capitalize">username</h2>
                  <h2 className="text-neutral-100 font-bold capitalize">{data.username}</h2>
                </div>
                <div className="w-full flex flex-row items-center justify-between py-3 border-b-2 border-neutral-50">
                  <h2 className="text-neutral-50 font-bold capitalize">sex</h2>
                  <h2 className="text-neutral-100 font-bold capitalize">{data.sex}</h2>
                </div>
                <div className="w-full flex flex-row items-center justify-between py-3 border-b-2 border-neutral-50">
                  <h2 className="text-neutral-50 font-bold capitalize">age</h2>
                  <h2 className="text-neutral-100 font-bold capitalize">{data.age_range}</h2>
                </div>
                <div className="w-full flex flex-row items-center justify-between py-3 border-b-2 border-neutral-50">
                  <h2 className="text-neutral-50 font-bold capitalize">blood group</h2>
                  <h2 className="text-neutral-100 font-bold capitalize">{data.blood_group}</h2>
                </div>
                <div className="w-full flex flex-row items-center justify-between py-3 border-b-2 border-neutral-50">
                  <h2 className="text-neutral-50 font-bold capitalize">genetype</h2>
                  <h2 className="text-neutral-100 font-bold capitalize">{data.genotype}</h2>
                </div>
              </div>
            </div>

            <div className="w-full lg:px-2 sm:px-5">
              <h2 className="font-bold capitalize text-neutral-100 my-5">medical summary</h2>
              <div className="w-full flex flex-col bg-neutral-1 lg:p-5 sm:p-2 rounded-md my-5">
                <div className="w-full flex flex-row items-center justify-between py-3 border-b-2 border-neutral-50">
                  <div className="flex flex-row items-center gap-x-2 ">
                    <img src={prescription} alt="" className="w-11"/>
                    <h2 className="text-neutral-50 font-bold capitalize">prescription</h2>
                  </div>
                  <div className="w-10 h-10 rounded-full flex flex-col items-center justify-center bg-neutral-100">
                    <h2 className="text-white font-bold">{data.prescription_count}</h2>
                  </div>
                </div>
                <div className="w-full flex flex-row items-center justify-between py-3 border-b-2 border-neutral-50">
                  <div className="flex flex-row items-center gap-x-2 ">
                    <img src={consultation} alt="" className="w-11"/>
                    <h2 className="text-neutral-50 font-bold capitalize">consultations</h2>
                  </div>
                  <div className="w-10 h-10 rounded-full flex flex-col items-center justify-center bg-neutral-100">
                    <h2 className="text-white font-bold">{data.consultation_count}</h2>
                  </div>
                </div>
                {/* Allergies Section */}
            <div
              className="w-full flex flex-row items-center justify-between py-3 border-b-2 border-neutral-50 cursor-pointer"
              onClick={toggleAllergies}
            >
              <div className="flex flex-row items-center gap-x-2">
                <img src={allergies} alt="" className="w-12" />
                <h2 className="text-neutral-50 font-bold capitalize">
                  Allergies
                </h2>
              </div>
              <h2 className="text-neutral-100 font-bold">
                {allergiesOpen ? "-" : "+"}
              </h2>
            </div>
            {allergiesOpen && (
              <div className="w-full bg-white border-b-2 border-neutral-100 py-3">
                {data.allergies.length > 0 ? (
                  data.allergies.map((allergy, index) => (
                    <p key={index} className="text-neutral-100 ">
                      {allergy}
                    </p>
                  ))
                ) : (
                  <p className="text-neutral-100">No allergies found</p>
                )}
              </div>
            )}

            {/* Special Needs Section */}
            <div
              className="w-full flex flex-row items-center justify-between py-3 border-b-2 border-neutral-50 cursor-pointer"
              onClick={toggleSpecialNeeds}
            >
              <div className="flex flex-row items-center gap-x-2">
                <img src={special} alt="" className="w-11" />
                <h2 className="text-neutral-50 font-bold capitalize">
                  Special Needs
                </h2>
              </div>
              <h2 className="text-neutral-100 font-bold">
                {specialNeedsOpen ? "-" : "+"}
              </h2>
            </div>
            {specialNeedsOpen && (
              <div className="w-full bg-white border-b-2 border-neutral-100 py-3">
                {data.special_needs.length > 0 ? (
                  data.special_needs.map((need, index) => (
                    <p key={index} className="text-neutral-100">
                      {need}
                    </p>
                  ))
                ) : (
                  <p className="text-neutral-100">No special needs found</p>
                )}
              </div>
            )}
              </div>
            </div>
            
          </div>
        ) : (
          <p className="text-primary-100 capitalize text-center">No patient data found.</p>
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

export default ViewPatient;

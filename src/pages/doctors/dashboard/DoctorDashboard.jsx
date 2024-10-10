import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { axiosClient } from "../../../axios";
import { CiUser, CiMedicalCross } from "react-icons/ci";
import { GiMedicines } from "react-icons/gi";

const DoctorDashboard = () => {
  const [data, setData] = useState(null); // Initial data state is null
  const MySwal = withReactContent(Swal);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/api/doctor/dashboard_stats");
        setData(response.data); // Set the fetched data
      } catch (error) {
        MySwal.fire({
          text: "Error fetching dashboard data",
          icon: "error",
          title: "Error",
        });
      } finally {
        setLoading(false); // Stop loading once the process is done
      }
    };

    fetchDashboard(); // Call the function when component is mounted
  }, []); // Empty dependency array ensures this runs only once

  return (
    <section className="w-full h-screen p-5">
      <div className="w-full relative">
        <div className="flex justify-between items-start">
          {/* Image Section */}
          <div className="absolute top-20 right-0 mt-3 -ml-40 sm:hidden lg:flex">
            <img
              src={"/images/Vector.png"}
              alt="Dashboard illustration"
              className="lg:w-36 lg:h-36 hidden sm:flex object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Content Section */}
          <div className="dashboard w-full bg-primary-100 rounded-lg lg:p-5 sm:p-2 mt-20">
            <h2 className="text-white font-semibold text-lg">Welcome to work today</h2>
            <p className="text-white my-3">You have 12 tasks to complete today!</p>
            <div className="flex flex-row items-center gap-x-5">
              <div className="w-[60%] h-3 border-2 border-white rounded-lg bg-transparent">
                <div className="w-[40%] bg-white h-full"></div>
              </div>
              <p className="text-md font-bold text-white">40% completed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full rounded-lg sm:p-2 lg:p-5 my-10 bg-white">
        <h2 className="text-neutral-100 font-bold text-xl capitalize mb-10">Performance Metrics</h2>

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
          {/* Patients */}
          <div className="w-full">
            <div className="rounded-lg bg-neutral-10 m-2">
              <div className="w-full flex items-center justify-between sm:px-2 lg:px-3">
                <h2 className="text-neutral-100 font-bold capitalize lg:text-base sm:text-md">Patients</h2>
                <CiUser size={20} />
              </div>
              <div className="w-full bg-neutral-50/70 mt-5 rounded-lg sm:p-2 lg:p-3">
                <h2 className="font-bold lg:text-xl sm:text-lg">{data?.patients || 0}</h2>
                <h2 className="font-bold text-neutral-100 capitalize lg:text-base sm:text-md">Total Patients</h2>
              </div>
            </div>
          </div>

          {/* Consultations */}
          <div className="w-full">
            <div className="rounded-lg bg-neutral-10 m-2">
              <div className="w-full flex items-center justify-between sm:px-2 lg:px-3">
                <h2 className="text-neutral-100 font-bold capitalize lg:text-base sm:text-md">Consultations</h2>
                <CiMedicalCross size={20} />
              </div>
              <div className="w-full bg-neutral-50/70 mt-5 rounded-lg sm:p-2 lg:p-3">
                <h2 className="font-bold lg:text-xl sm:text-lg">{data?.consultation || 0}</h2>
                <h2 className="font-bold text-neutral-100 capitalize lg:text-base sm:text-md">Total Consultations</h2>
              </div>
            </div>
          </div>

          {/* Prescriptions */}
          <div className="w-full">
            <div className="rounded-lg bg-neutral-10 m-2">
              <div className="w-full flex items-center justify-between sm:px-2 lg:px-3">
                <h2 className="text-neutral-100 font-bold capitalize lg:text-base sm:text-md">Prescriptions</h2>
                <GiMedicines size={20} />
              </div>
              <div className="w-full bg-neutral-50/70 mt-5 rounded-lg sm:p-2 lg:p-3">
                <h2 className="font-bold lg:text-xl sm:text-lg">{data?.prescription || 0}</h2>
                <h2 className="font-bold text-neutral-100 capitalize lg:text-base sm:text-md">Prescriptions</h2>
              </div>
            </div>
          </div>

          {/* Ratings */}
          <div className="w-full">
            <div className="rounded-lg bg-neutral-10 m-2">
              <div className="w-full flex items-center justify-between sm:px-2 lg:px-3">
                <h2 className="text-neutral-100 font-bold capitalize lg:text-base sm:text-md">Ratings</h2>
                <CiUser size={20} />
              </div>
              <div className="w-full bg-neutral-50/70 mt-5 rounded-lg sm:p-2 lg:p-3">
                <h2 className="font-bold lg:text-xl sm:text-lg">{data?.average_rating || 0}</h2>
                <h2 className="font-bold text-neutral-100 capitalize lg:text-base sm:text-md">Average Ratings</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop and Loading Indicator */}
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </section>
  );
};

export default DoctorDashboard;

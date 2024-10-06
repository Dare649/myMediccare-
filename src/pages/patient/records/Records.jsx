import { useState, useEffect } from "react";
import { FiPlusCircle } from "react-icons/fi";
import Modal from "../../../components/Modal";
import AddVitals from "./AddVitals";
import { axiosClient } from "../../../axios";
import VitalsGraph from "./VitalsGraph";
import Swal from "sweetalert2";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import blood from "../../../assets/images/bloodSugar.png";
import weight1 from "../../../assets/images/weight.png";
import food1 from "../../../assets/images/food.png";
import heart1 from "../../../assets/images/heart1.png";

const Records = () => {
    const [openVitals, setOpenVitals] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bloodPressure, setBloodPressure] = useState(null);
    const [food, setFood] = useState(null);
    const [weight, setWeight] = useState(null);
    const [bloodSugar, setBloodSugar] = useState(null);

    useEffect(() => {
        const fetchBloodPressure = async () => {
            try {
                const response = await axiosClient.get(`/api/patient/rm/get_latest_reading/blood_pressure`);
                console.log("Blood Pressure Data:", response?.data?.data);
                setBloodPressure(response?.data?.data || null);
            } catch (error) {
                Swal.fire({
                    text: "Error fetching latest blood pressure reading",
                    icon: "error",
                    title: "Error"
                });
            }
        };
        
        const fetchBloodSugar = async () => {
            try {
                const response = await axiosClient.get(`/api/patient/rm/get_latest_reading/blood_sugar`);
                console.log("Blood Sugar Data:", response?.data?.data);
                setBloodSugar(response?.data?.data || null);
            } catch (error) {
                Swal.fire({
                    text: "Error fetching latest blood sugar reading",
                    icon: "error",
                    title: "Error"
                });
            }
        };

        const fetchWeight = async () => {
            try {
                const response = await axiosClient.get(`/api/patient/rm/get_latest_reading/weight`);
                console.log("Weight Data:", response?.data?.data);
                setWeight(response?.data?.data || null);
            } catch (error) {
                Swal.fire({
                    text: "Error fetching latest weight reading",
                    icon: "error",
                    title: "Error"
                });
            }
        };

        const fetchFood = async () => {
            try {
                const response = await axiosClient.get(`/api/patient/rm/get_latest_reading/food`);
                console.log("Food Data:", response?.data?.data);
                setFood(response?.data?.data || null);
            } catch (error) {
                Swal.fire({
                    text: "Error fetching latest food reading",
                    icon: "error",
                    title: "Error"
                });
            }
        };

        const fetchAllReadings = async () => {
            setLoading(true);
            try {
                await Promise.all([fetchBloodPressure(), fetchBloodSugar(), fetchWeight(), fetchFood()]);
            } catch (error) {
                console.error("Error fetching readings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllReadings();
    }, []);

    const handleVitals = () => {
        setOpenVitals((prev) => !prev);
    };

    return (
        <section className="monitoring sm:mt-20 lg:mt-40 w-full h-full lg:p-5 sm:p-2">
            <div className="w-full bg-white rounded-lg mb-8">
                <div className="w-full py-3 px-5 flex flex-row items-center justify-between">
                    <h2 className="capitalize font-semibold lg:text-2xl sm:text-lg">vitals overview</h2>
                    <button
                        onClick={handleVitals}
                        className="flex font-bold flex-row items-center justify-center gap-2 lg:w-40 sm:w-40 h-10 bg-primary-100 rounded-lg text-white "
                    >
                        <h2 className="capitalize">add record</h2>
                        <FiPlusCircle size={20} />
                    </button>
                </div>
            </div>
            <div className="w-full mb-8 flex lg:flex-row sm:flex-col gap-8">
                <div className="lg:w-[50%] sm:w-full rounded-lg grid lg:grid-cols-2 sm:grid-cols-1 gap-5">
                    <div className="bloodPressure bg-white rounded-lg">
                        {bloodPressure ? (
                            <div className="w-full lg:p-3 sm:p-1 ">
                                <div className="flex flex-row items-center gap-2 w-full">
                                    <img src={heart1} alt="MyMedicare" className="w-32"/>
                                    <h4 className="capitalize font-medium text-xl">blood pressure</h4>
                                </div>
                                <div className="my-2 w-full">
                                    <p className="font-medium text-md capitalize">latest reading</p>
                                    <div className="text-md font-bold">
                                        <h2 className="capitalize font-bold text-primary-100">systolic: <span className="text-neutral-100">{bloodPressure?.systolic}</span></h2>
                                        <h2 className="capitalize font-bold text-primary-100">diastolic: <span className="text-neutral-100">{bloodPressure?.diastolic}</span></h2>
                                        <h2 className="capitalize font-bold text-primary-100">unit: <span className="text-neutral-100">{bloodPressure?.unit}</span></h2>
                                        
                                    </div>
                                </div>
                                <div className="w-full">
                                <h2 className="capitalize font-bold text-primary-100">activity: <span className="text-neutral-100">{bloodPressure?.activity}</span></h2>
                                    <h2 className="text-sm font-bold text-neutral-50">
                                        <span>{bloodPressure?.date}</span>
                                        <span>{bloodPressure?.time}</span>
                                    </h2>
                                </div>
                            </div>
                        ) : (
                            <p className="font-medium text-md capitalize">No blood pressure data available</p>
                        )}
                    </div>
                    <div className="bloodSugar bg-white rounded-lg">
                        {bloodSugar ? (
                            <div className="w-full lg:p-3 sm:p-1 ">
                                <div className="flex flex-row items-center gap-2 w-full">
                                    <img src={blood} alt="MyMedicare" className="w-32"/>
                                    <h4 className="capitalize font-medium text-xl">blood sugar</h4>
                                </div>
                                <div className="my-2 w-full">
                                    <p className="font-medium text-md capitalize">latest reading</p>
                                    <div className="grid grid-cols-2">
                                        <h2 className="text-md font-bold text-neutral-100">{bloodSugar?.reading_in_mmol}/mmol</h2>
                                        <h2 className="text-md font-bold text-neutral-100">{bloodSugar?.reading_in_mgdl}/mgdl</h2>
                                        <h2 className="text-md font-bold text-neutral-100"> {bloodSugar?.unit}</h2>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <h2 className="text-sm font-bold text-neutral-50">
                                        <span>{bloodSugar?.date}</span>
                                        <span>{bloodSugar?.time}</span>
                                    </h2>
                                </div>
                            </div>
                        ) : (
                            <p className="font-medium text-md capitalize">No blood pressure data available</p>
                        )}
                    </div>
                    <div className="food bg-white rounded-lg">
                        {food ? (
                            <div className="w-full lg:p-3 sm:p-1 ">
                                <div className="flex flex-row items-center gap-2 w-full">
                                    <img src={heart1} alt="MyMedicare" className="w-32"/>
                                    <h4 className="capitalize font-medium text-xl">food</h4>
                                </div>
                                <div className="my-2 w-full">
                                    <p className="font-medium text-md capitalize">latest reading</p>
                                    <h2 className="text-md font-bold">
                                        <span>{food?.systolic}</span>/
                                        <span>{food?.diastolic}</span>
                                        <span> {food?.unit}</span>
                                    </h2>
                                </div>
                                <div className="w-full">
                                    <h2 className="capitalize font-bold">{food?.activity}</h2>
                                    <h2 className="text-sm font-bold text-neutral-50">
                                        <span>{food?.date}</span>
                                        <span>{food?.time}</span>
                                    </h2>
                                </div>
                            </div>
                        ) : (
                            <p className="font-medium text-md capitalize text-center text-primary-100">No blood pressure data available</p>
                        )}
                    </div>
                    <div className="bloodPressure bg-white rounded-lg">
                        {weight ? (
                            <div className="w-full lg:p-3 sm:p-1 ">
                                <div className="flex flex-row items-center gap-2 w-full">
                                    <img src={weight1} alt="MyMedicare" className="w-32"/>
                                    <h4 className="capitalize font-medium text-xl">weight</h4>
                                </div>
                                <div className="my-2 w-full">
                                    <p className="font-medium text-md capitalize">latest reading</p>
                                    <div className="text-md font-bold grid grid-cols-2">
                                        <h2>{weight?.reading_in_unit}/{weight?.unit}</h2>
                                        
                                        <h2>{weight?.reading_in_lbs?.toFixed(2)}/lbs</h2>

                                    </div>
                                    <h2 className="text-sm font-bold text-neutral-50">
                                        {weight?.date}
                                        
                                    </h2>
                                </div>
                                
                            </div>
                        ) : (
                            <p className="font-medium text-md capitalize">No blood pressure data available</p>
                        )}
                    </div>
                </div>
                <div className="sm:w-full lg:w-[50%] bg-white rounded-lg ">
                    <VitalsGraph />
                </div>
            </div>
            {openVitals && (
                <Modal visible={openVitals}>
                    <AddVitals handleClose={handleVitals} />
                </Modal>
            )}
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </section>
    );
};

export default Records;

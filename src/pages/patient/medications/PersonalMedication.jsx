import { useState, useEffect } from "react";
import capsule from "../../../assets/images/capsule.png";
import { TbMedicineSyrup } from "react-icons/tb";
import { BiSolidInjection } from "react-icons/bi";
import { axiosClient } from "../../../axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { IoMdClose } from "react-icons/io";

const PersonalMedication = ({handleClose}) => {
    const MySwal = withReactContent(Swal);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get("/api/patient/get_prescription/personal");
            setData(response.data.data);
        } catch (error) {
            setLoading(false);
            MySwal.fire({
            title: "Error!",
            text: "Failed to fetch personal medication, try again.",
            icon: "error",
            });
        } finally {
            setLoading(false);
        }
        }; 
        fetchData();
    }, [])
  return (
    <div className="lg:w-[50%] sm:w-full bg-white rounded-lg">
        
        <div className="sm:p-5 lg:p-10">
            <div className="flex items-end justify-end">
                <IoMdClose size={30} onClick={handleClose} className="cursor-pointer font-bold hover:text-red-500"/>
            </div>
            {
                data.map((item) => (
                    <div 
                        className="w-full flex flex-col items-center justify-center mx-auto"
                        key={item.uuid}
                    >
                        <div className="lg:w-[30%] sm:w-[15%] rounded-full flex items-center justify-center mb-10 mt-5">
                            <div
                                className={item.dosage_form === "i" ? "bg-red-300" : item.dosage_form === "s" ? "bg-blue-300 " : " "}
                            >
                                {
                                    item.dosage_form === "c" ? <img src={capsule} alt="" /> :
                                    item.dosage_form === "i" ? <BiSolidInjection /> :
                                    item.dosage_form === "s" ? <TbMedicineSyrup /> : null
                                }
                            </div>
                        </div>
                        <h2 className="lg:text-2xl sm:text-lg font-bold capitalize text-center mb-5">{item.drug_name}</h2>
                        <div className="w-full grid lg:grid-cols-3 sm:grid-cols-2 gap-5">
                            <div>
                                <h2 className="lg:text-md sm:text-sm font-bold capitalize text-primary-100">dose</h2>
                                <p className="text-neutral-100 font-bold lg:text-lg sm:text-md capitalize">{item.dose}</p>
                            </div>
                            <div>
                                <h2 className="lg:text-md sm:text-sm font-bold capitalize text-primary-100">dose unit</h2>
                                <p className="text-neutral-100 font-bold lg:text-lg sm:text-md capitalize">{item.dose_unit}</p>
                            </div>
                            <div>
                                <h2 className="lg:text-md sm:text-sm font-bold capitalize text-primary-100">frequency</h2>
                                <p className="text-neutral-100 font-bold lg:text-lg sm:text-md capitalize">{item.frequency}</p>
                            </div>
                            <div>
                                <h2 className="lg:text-md sm:text-sm font-bold capitalize text-primary-100">duration</h2>
                                <p className="text-neutral-100 font-bold lg:text-lg sm:text-md capitalize">{item.duration}</p>
                            </div>
                            <div>
                                <h2 className="lg:text-md sm:text-sm font-bold capitalize text-primary-100">duration in (days, weeks or months)</h2>
                                <p className="text-neutral-100 font-bold lg:text-lg sm:text-md capitalize">{item.duration_unit}</p>
                            </div>
                            <div>
                                <h2 className="lg:text-md sm:text-sm font-bold capitalize text-primary-100">method of administration</h2>
                                <p className="text-neutral-100 font-bold lg:text-lg sm:text-md capitalize">{item.route_of_administration}</p>
                            </div>
                            <div>
                                <h2 className="lg:text-md sm:text-sm font-bold capitalize text-primary-100">instructions</h2>
                                <p className="text-neutral-100 font-bold lg:text-lg sm:text-md capitalize">{item.instructions}</p>
                            </div>
                            <div>
                                <h2 className="lg:text-md sm:text-sm font-bold capitalize text-primary-100">time reminder</h2>
                                {item.reminder_time.map((timeObj, index) => (
                                    <p key={index} className="text-md font-bold grid grid-cols-3 gap-3">
                                    {timeObj.reminder_time}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
        <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
        >
        <CircularProgress color="inherit" />
        </Backdrop>
    </div>
  )
}

export default PersonalMedication

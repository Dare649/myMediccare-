import { useState, useEffect } from "react";
import { prescriptions } from "../../../components/dummy";
import { FaRegFile } from "react-icons/fa6";
import { axiosClient } from "../../../axios";
import { FiPlusCircle } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { BiSolidInjection } from "react-icons/bi";
import { PiEyeLight} from "react-icons/pi";
import Modal from "../../../components/Modal";
import CreatePrescription from "./CreatePrescription";
import capsule from "../../../assets/images/capsule.png";
import { TbMedicineSyrup } from "react-icons/tb";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import PersonalMedication from "./PersonalMedication";


const PatientPrescriptions = () => {
  const data = prescriptions.slice(0, 5);
  const [loading, setLoading] = useState(false);
  const [requestPrescription, setRequestPrescription] = useState(false);
  const [prescribed, setPrescibed] = useState([]);
  const MySwal = withReactContent(Swal);
  const [personal, setPersonal] = useState([]);
  const [viewPersonal, setViewPersonal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);



  useEffect(() => {
    const fetchPrescribed = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/api/patient/get_prescription/prescribed");
        setPrescibed(response.data.data);
        console.log(prescribed)
      } catch (error) {
        setLoading(false);
        MySwal.fire({
          title: "Error!",
          text: "Failed to fetch prescribed medications, try again.",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }; 

    const fetchPersonal = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/api/patient/get_prescription/personal");
        setPersonal(response.data.data);
      } catch (error) {
        setLoading(false);
        MySwal.fire({
          title: "Error!",
          text: "Failed to fetch personal medications, try again.",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }; 
    fetchPersonal();
    fetchPrescribed();
  }, [])



  const handlePrescriptionRequest = () => {
    setRequestPrescription((prev)=>!prev);
  }


  const handleViewPersonalPrescription = (uuid) => {
    setViewPersonal((prev)=>!prev);
    setSelectedItemId(uuid);
  }

  
  return (
    <section className="prescription sm:mt-10 lg:mt-40 w-full h-full lg:p-5 sm:p-0">
      <div className="flex flex-row items-center justify-between sm:p-2 lg:p-5 bg-white rounded-lg mb-10">
        <h1 className="first-letter:capitalize font-semibold lg:text-2xl sm:text-xl">medications</h1>
        <button 
          onClick={handlePrescriptionRequest}
          className="flex font-bold flex-row items-center justify-center gap-2 lg:w-56 sm:w-52 h-10 bg-primary-100 rounded-lg text-white ">
          <h2 className="first-letter:capitalize">request prescription</h2><FiPlusCircle className=" " size={20}/>
        </button>
      </div>
      {
        requestPrescription && 
          <Modal visible={requestPrescription} onClick={handlePrescriptionRequest}>
            <CreatePrescription handleClose={handlePrescriptionRequest}/>
          </Modal>
      }

      <div className="w-full flex lg:flex-row sm:flex-col items-center gap-5 mb-10">
        <div className="sm:w-full lg:w-[50%] bg-white rounded-lg sm:p-2 lg:p-5">
          <h2 className="font-bold sm:text-lg text-xl capitalize lg:py-5 sm:py-2">prescribed medications</h2>
            {
              prescribed.length > 0 ? (
                <div className="border-2 border-neutral-100 sm:p-1 lg:p-3 rounded-lg">
                  {
                    prescribed.map((item)=>(
                      <div className="w-full flex flex-row items-center justify-between">
                        <div
                        key={item.uuid}
                        className="w-full flex items-center gap-x-5"
                      >
                        <div className="lg:w-[20%] sm:w-[10%] rounded-lg">
                          <div 
                            className={
                              item.dosage_form === "i" ? "bg-red-300" : 
                              item.dosage_form === "s" ? "bg-blue-300" : ""
                            }
                          >
                            {
                              item.dosage_form === "c" ? <img src={capsule} alt="" className="w-full"/> :
                              item.dosage_form === "i" ? <BiSolidInjection /> :
                              item.dosage_form === "s" ? <TbMedicineSyrup /> : null
                            }
                          </div>
                        </div>
                        <div>
                          <h2 className="text-neutral-100 font-bold lg:text-2xl sm:text-lg capitalize">{item.drug_name}</h2>
                          <p className="gap-x-2 text-neutral-50 font-bold sm:text-lg lg:text-xl capitalize">
                            <span>{item.dose}</span>
                            <span>{item.dose_unit}</span>,
                            <span className="ml-2">{item.frequency}</span>
                          </p>
                           {/* Reminder times */}
                            <div className="bg-neutral-50/50 rounded-lg lg:p-2 sm:p-1 grid grid-cols-2 mx-auto">
                              {item.reminder_time.map((timeObj, index) => (
                                <p key={index} className="text-md font-bold">
                                  {timeObj.reminder_time}
                                </p>
                              ))}
                            </div>
                        </div>
                      </div>
                      <div onClick={()=>handleViewPersonalPrescription(item.uuid) }>
                        <MdOutlineRemoveRedEye 
                          className="text-primary-100 font-bold"
                          size={30}
                        />
                      </div>
                    </div>
                    ))
                  }
                </div>
              ):(
                <div> 
                  <p className="text-center font-bold first-letter:capitalize text-primary-100">no prescriptions available at the moment</p>
                </div>
              )
            }
        </div>
        <div className="sm:w-full lg:w-[50%] bg-white rounded-lg sm:p-2 lg:p-5">
          <h2 className="font-bold sm:text-lg text-xl capitalize lg:py-5 sm:py-2">personal medications</h2>
            {
              personal.length > 0 ? (
                <div className="border-2 border-neutral-100 sm:p-1 lg:p-3 rounded-lg">
                  {
                    personal.map((item)=>(
                      <div className="w-full flex flex-row items-center justify-between">
                        <div
                        key={item.uuid}
                        className="w-full flex items-center gap-x-5"
                      >
                        <div className="lg:w-[20%] sm:w-[10%] rounded-lg">
                          <div 
                            className={
                              item.dosage_form === "i" ? "bg-red-300" : 
                              item.dosage_form === "s" ? "bg-blue-300" : ""
                            }
                          >
                            {
                              item.dosage_form === "c" ? <img src={capsule} alt="" className="w-full"/> :
                              item.dosage_form === "i" ? <BiSolidInjection /> :
                              item.dosage_form === "s" ? <TbMedicineSyrup /> : null
                            }
                          </div>
                        </div>
                        <div>
                          <h2 className="text-neutral-100 font-bold lg:text-2xl sm:text-lg capitalize">{item.drug_name}</h2>
                          <p className="gap-x-2 text-neutral-50 font-bold sm:text-lg lg:text-xl capitalize">
                            <span>{item.dose}</span>
                            <span>{item.dose_unit}</span>,
                            <span className="ml-2">{item.frequency}</span>
                          </p>
                           {/* Reminder times */}
                            <div className="bg-neutral-50/50 rounded-lg lg:p-2 sm:p-1 grid grid-cols-2 mx-auto">
                              {item.reminder_time.map((timeObj, index) => (
                                <p key={index} className="text-md font-bold">
                                  {timeObj.reminder_time}
                                </p>
                              ))}
                            </div>
                        </div>
                      </div>
                      <div onClick={()=>handleViewPersonalPrescription(item.uuid) }>
                        <MdOutlineRemoveRedEye 
                          className="text-primary-100 font-bold"
                          size={30}
                        />
                      </div>
                    </div>
                    ))
                  }
                </div>
              ):(
                <div> 
                  <p className="text-center font-bold first-letter:capitalize text-primary-100">no prescriptions available at the moment</p>
                </div>
              )
            }
        </div>
      </div>

      {
        viewPersonal  &&
          <Modal visible={viewPersonal} onClick={handleViewPersonalPrescription}>
            <PersonalMedication handleClose={handleViewPersonalPrescription}/>
          </Modal>
      }
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </section>
  )
}

export default PatientPrescriptions

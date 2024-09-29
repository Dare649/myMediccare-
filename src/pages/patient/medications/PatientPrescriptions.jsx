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
import med1 from "../../../../public/images/med1.png";
import med2 from "../../../../public/images/med2.png";
import { CiFileOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";


const PatientPrescriptions = () => {
  const data = prescriptions.slice(0, 5);
  const [loading, setLoading] = useState(false);
  const [requestPrescription, setRequestPrescription] = useState(false);
  const [prescribed, setPrescibed] = useState([]);
  const MySwal = withReactContent(Swal);
  const [personal, setPersonal] = useState([]);
  const [viewPersonal, setViewPersonal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [prescriptionList, setPrescriptionList] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchPrescribed = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/api/patient/get_prescription/prescribed");
        setPrescibed(response.data.data);
 
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
    const fetchPrescriptionList = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/api/patient/all_prescriptions");
        setPrescriptionList(response.data.data);
      } catch (error) {
        setLoading(false);
        MySwal.fire({
          title: "Error!",
          text: "Failed to fetch prescription list, try again.",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }; 

    fetchPrescriptionList();
    fetchPersonal();
    fetchPrescribed();
  }, [])



  const handlePrescriptionRequest = () => {
    setRequestPrescription((prev)=>!prev);
  }


  const handleViewPersonalPrescription = (uuid) => {
    setViewPersonal(true);
    setSelectedItemId(uuid); // Set the selected UUID here
  };

  // Filter personal prescriptions by the selected uuid
  const selectedPersonalMedication = personal.find(item => item.uuid === selectedItemId);


  const handleViewPrescriptionDetails = (prescription) => {
    navigate(`/patient-prescription-list/${prescription.consultation_uuid}`, {
      state: { prescription },
    });
  };


  
  return (
    <section className="prescription sm:mt-20 lg:mt-40 w-full h-full lg:p-10 sm:p-5">
      <div className="flex flex-row items-center justify-between sm:p-2 lg:p-5 bg-white rounded-lg mb-5 sm:gap-x-5 lg:gap-x-0">
        <h1 className="first-letter:capitalize font-semibold lg:text-xl sm:text-md">medications</h1>
        <button 
          onClick={handlePrescriptionRequest}
          className="flex font-bold flex-row items-center justify-center lg:p-3 sm:p-1 bg-primary-100 rounded-lg text-white gap-x-1">
          <h2 className="first-letter:capitalize lg:text-base sm:text-sm">add prescription</h2><FiPlusCircle className=" " size={20}/>
        </button>
      </div>
      {
        requestPrescription && 
          <Modal visible={requestPrescription} onClick={handlePrescriptionRequest}>
            <CreatePrescription handleClose={handlePrescriptionRequest}/>
          </Modal>
      }

        <div className="w-full bg-white rounded-lg sm:p-2 lg:p-5">
          <h2 className="font-bold sm:text-lg text-xl capitalize lg:py-5 sm:py-2">prescribed medications</h2>
            {
              prescribed.length > 0 ? (
                <div className={`border-2 border-neutral-100 sm:p-2 lg:p-3 rounded-lg ${prescribed.length < 0 ? "border-none": null}`}>
                  {
                    prescribed.map((item)=>(
                      <div className="w-full flex flex-row items-center justify-between gap-x-2">
                        <div
                        key={item.uuid}
                        className="w-full flex items-center gap-x-5 mb-3"
                      >
                        <div className="sm:w-[20%] lg:w-[5%] rounded-lg">
                          <div 
                            
                          >
                            {
                              item.dosage_form === "c" ? <img src={capsule} alt="" className="w-full"/> :
                              item.dosage_form === "i" ? <img src={med1} alt="" className="w-full"/> :
                              item.dosage_form === "s" ? <img src={med2} alt="" className="w-full"/>: null
                            }
                          </div>
                        </div>
                        <div>
                          <h2 className="text-neutral-100 font-bold lg:text-lg sm:text-md capitalize">{item.drug_name}</h2>
                          <p className="gap-x-2 text-neutral-50 font-bold sm:text-sm lg:text-md capitalize">
                            <span>{item.dose}</span>
                            <span>{item.dose_unit}</span>,
                            <span className="ml-2">{item.frequency}</span>
                          </p>
                           {/* Reminder times */}
                            <div className="bg-neutral-50/50 rounded-lg lg:p-2 sm:p-1 grid grid-cols-2 mx-auto">
                              {item.reminder_time.map((timeObj, index) => (
                                <p key={index} className="text-xs font-bold">
                                  {timeObj.reminder_time}
                                </p>
                              ))}
                            </div>
                        </div>
                      </div>
                      <div onClick={() => handleViewPersonalPrescription(item.uuid)}>
                        <MdOutlineRemoveRedEye 
                          className="text-primary-100 font-bold cursor-pointer"
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
        <div className="w-full bg-white rounded-lg sm:p-2 lg:p-5 my-5">
          <h2 className="font-bold sm:text-lg text-xl capitalize lg:py-5 sm:py-2">personal medications</h2>
            {
              personal.length > 0 ? (
                <div className={`border-2 border-neutral-100 sm:p-2 lg:p-3 rounded-lg ${personal.length < 0 ? "border-none": null}`}>
                  {
                    personal.map((item)=>(
                      <div className="w-full flex flex-row items-center justify-between gap-x-2">
                        <div
                        key={item.uuid}
                        className="w-full flex items-center gap-x-5 mb-3"
                      >
                        <div className="sm:w-[20%] lg:w-[5%]  rounded-lg">
                          <div 
                           
                          >
                            {
                              item.dosage_form === "c" ? <img src={capsule} alt="" className="w-full"/> :
                              item.dosage_form === "i" ? <img src={med1} alt="" className="w-full"/> :
                              item.dosage_form === "s" ? <img src={med2} alt="" className="w-full"/>  : null
                            }
                          </div>
                        </div>
                        <div>
                          <h2 className="text-neutral-100 font-bold lg:text-lg sm:text-md capitalize">{item.drug_name}</h2>
                          <p className="gap-x-2 text-neutral-50 font-bold sm:text-sm lg:text-md capitalize">
                            <span>{item.dose}</span>
                            <span>{item.dose_unit}</span>,
                            <span className="ml-2">{item.frequency}</span>
                          </p>
                           {/* Reminder times */}
                            <div className="bg-neutral-50/50 rounded-lg lg:p-2 sm:p-1 grid grid-cols-2 mx-auto">
                              {item.reminder_time.map((timeObj, index) => (
                                <p key={index} className="text-xs font-bold">
                                  {timeObj.reminder_time}
                                </p>
                              ))}
                            </div>
                        </div>
                      </div>
                      <div onClick={()=>handleViewPersonalPrescription(item.uuid) }>
                        
                        <MdOutlineRemoveRedEye 
                          className="text-primary-100 font-bold cursor-pointer"
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

        <div className="w-full bg-white rounded-lg sm:p-2 lg:p-5 my-5">
          <h2 className="font-bold sm:text-lg text-xl capitalize lg:py-5 sm:py-2">prescription list</h2>
          {
            prescriptionList.length > 0 ? (
              prescriptionList.map((item) => (
                <div 
                  className="w-full flex flex-row items-center justify-between border-b-2 border-neutral-50 py-3 overflow-y-scroll"
                  key={item.uuid}
                >
                  <div className="flex flex-row items-center gap-x-5">
                    <div className="border-2 border-neutral-50 w-20 h-20 rounded-full flex flex-col items-center justify-center ">
                      <CiFileOn className="text-primary-100 font-bold" size={30}/>
                    </div>
                    <div>
                      <h2 className="first-letter:capitalize ">{item.diagnosis || "null"} prescription.pdf</h2>
                      <h5 className="text-neutral-50 capitalize text-md">{item.doctor_name}</h5>
                    </div>
                  </div>
                  
                  <MdOutlineRemoveRedEye
                    size={30}
                    className="text-primary-100 font-bold cursor-pointer"
                    onClick={() => handleViewPrescriptionDetails(item)}
                  />
                 
                </div>
              ))
            ):(
              <p className="text-center font-bold text-primary-100 capitalize">no prescription list available at the moment</p>
            )
          }
        </div>


      {
        viewPersonal  && selectedPersonalMedication &&
          <Modal visible={viewPersonal} onClick={() => setViewPersonal(false)}>
            <PersonalMedication 
              handleClose={() => setViewPersonal(false)}
              medication={selectedPersonalMedication}
            />
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

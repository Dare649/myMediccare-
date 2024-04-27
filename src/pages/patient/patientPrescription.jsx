import { useState } from "react";
import { prescriptions } from "../../components/dummy";
import { FaRegFile } from "react-icons/fa6";
import { FiPlusCircle } from "react-icons/fi";
import { CiPillsBottle1 } from "react-icons/ci";
import { PiEyeLight} from "react-icons/pi";
import Modal from "../../components/Modal";
import MedicationReminder from "../../patientModalPages/MedicationReminder";
import Prescriptions from "../../patientModalPages/Prescriptions";

const patientPrescription = () => {
  const data = prescriptions.slice(0, 7);
  const [visible, setVisible] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);

  // handle modal
  const handleVisible = () => {
    setVisible((prev) => !prev);
  };

  const handlePrescription = () => {
    setShowPrescription((prev) => !prev);
  };
  return (
    <section className="prescription w-full h-full lg:p-5 sm:p-0">
      <main className="flex lg:flex-row sm:flex-col gap-8 w-full h-screen">
        <div className="lg:w-[60%] rounded-lg sm:w-full bg-white lg:h-full sm:h-fit lg:px-5 lg:py-8 sm:px-2 sm:py-8">
          <div className="flex flex-row items-center justify-between">
            <h1 className="first-letter:capitalize font-semibold lg:text-2xl sm:text-xl">your prescriptions</h1>
            <button className="flex font-bold flex-row items-center justify-center gap-2 lg:w-56 sm:w-52 h-10 bg-primary-100 rounded-lg text-white ">
              <h2 className="first-letter:capitalize">request prescription</h2><FiPlusCircle className=" " size={20}/>
            </button>
          </div>
          {
            !Object.keys(data).length > 0 ?
            <>
              <div className="flex flex-col items-center justify-center lg:my-60 sm:my-20">
                <h2 className="text-xl first-letter:capitalize font-bold text-center">you do not have any current prescription.</h2>
                <p className="text-neutral-50 first-letter:capitalize text-center">prescriptions written by your doctor are listed here when applicable.</p>
              </div>
            </>
            :
            <>
              <div className="prescriptionTable my-10 w-full h-full">
                {
                  data.map((item, id) =>(
                    <div key={id} className="flex flex-row items-center justify-between border-2 border-x-0 border-t-0 border-b border-neutral-50  py-3 px-2">
                      <div className="flex flex-row items-center gap-x-3">
                        <div className="rounded-full w-10 h-10 border-2 border-neutral-50">
                          <FaRegFile className="text-primary-100 m-3"/>
                        </div>
                        <div>
                          <h2 className="font-bold text-lg first-letter:capitalize">{item.title}</h2>
                          <p className="font-bold text-sm text-neutral-50">{item.downloadSize}</p>
                        </div>
                      </div>
                      <PiEyeLight size={30} onClick={handlePrescription} className="cursor-pointer"/>
                    </div>
                  ))
                }
                {
                  showPrescription && 
                    <Modal visible={showPrescription} onClose={handlePrescription}>
                      <Prescriptions handleCancel={handlePrescription} handleClose={handlePrescription}/>
                    </Modal>
                }
              </div>
            </>
          }
        </div>
        <div className="currentMedication lg:w-[40%] rounded-lg sm:w-full lg:px-5 lg:py-8 sm:px-2 sm:py-5 bg-white lg:h-full sm:h-fit">
          <div className="flex flex-row items-center justify-between gap-y-5">
            <h1 className="capitalize font-semibold text-2xl">current medication</h1>
            <button className="w-10 h-10 flex items-center justify-center bg-primary-100 rounded-lg text-white first-letter:capitalize">
              <FiPlusCircle className=" mx-2 my-2" size={20}/>
            </button>
          </div>
          {
            !Object.keys(data).length > 0 ?
            <>
              <div className="flex flex-col items-center justify-center my-20">
                <h2 className="text-xl first-letter:capitalize font-bold text-center">no listed medication yet.</h2>
                <p className="text-neutral-50 first-letter:capitalize text-center">get a prescription and add medication to list.</p>
              </div>
            </>
            :
            <>
              <div className="medicationsTable w-full my-10">
                {
                  data.map((item, id) =>(
                    <div key={id} className="flex flex-row items-center justify-between py-3 px-2">
                      <div className="flex flex-row items-center gap-2">
                        <div className="rounded-full w-10 h-10 border-2 border-neutral-50">
                          <CiPillsBottle1 className="text-primary-100 mx-2 my-2 font-bold" size={20}/>
                        </div>
                        <div className="flex lg:flex-row sm:flex-col gap-x-2">
                          <h2 className="font-semibold capitalize">{item.med}</h2>
                          <h2 className="font-semibold first-letter:capitalize">{item.times}</h2>
                        </div>
                      </div>
                      <button onClick={handleVisible} className="font-bold flex-row w-36 h-10 bg-primary-100 rounded-lg text-white capitalize">
                        set reminder
                      </button>
                    </div>
                  ))
                }
              </div>
              {
                visible && 
                  <Modal visible={visible} onClose={handleVisible}>
                    <MedicationReminder handleCancel={handleVisible} handleClose={handleVisible}/>
                  </Modal>
              }
            </>
          }
        </div>
      </main>
    </section>
  )
}

export default patientPrescription

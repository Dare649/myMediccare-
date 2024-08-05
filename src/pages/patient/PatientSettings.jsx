import Tabs from "../../components/Tabs";
import PatientAccount from "../patient/PatientAccount";
import PatientProfile from "../patient/PratientProfile";
import PatientPlanAndBilling from "../patient/PatientPlansAndBilling";

const PatientSettings = () => {
  return (
    <section className="settings w-full h-screen lg:p-5 sm:p-0">
      <div className='lg:p-10 sm:p-2 bg-white rounded-lg w-full h-fit'>
        <Tabs
          content1={<PatientProfile/>}
          content2={<PatientPlanAndBilling/>}
          content3={<PatientAccount/>}
          title1={"profile"}
          title2={"plans & billing"}
          title3={"account"}
        />
      </div>
    </section>
  )
}

export default PatientSettings

import AgoraVideoCall from "./AgoraVideoCall";



const DoctorAppointment = () => {
    const doctorUID = 123; // Unique doctor ID
    const patientUID = 456; // Unique patient ID
    const channelName = "testChannel"; // Channel name
  
    return (
      <div>
        <h1>Video Call with Patient</h1>
        <AgoraVideoCall channelName={channelName} role={1} doctorUID={doctorUID} patientUID={patientUID} />
      </div>
    );
  };
  
  export default DoctorAppointment;
  
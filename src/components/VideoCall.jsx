import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import Modal from "../components/Modal";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from 'react-icons/fa';
import ConsultationNote from '../pages/doctors/consultation/ConsultationNote';
import { axiosClient } from '../axios';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Prescription from "../pages/doctors/consultation/Prescription";

const APP_ID = "894b043a9e60426285be31a3e8e9c4c0"; // Replace with your App ID

const getValidString = (input) => {
  return input.length > 64 ? input.substring(0, 64) : input;
};

const generateRandomUid = () => {
  return Math.floor(Math.random() * 100000); // Adjust range as needed
};

const VideoCall = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const { bookingId, token, channelName, role, user_uuid, consultationUUID } = location.state || {};

  const validChannelName = getValidString(channelName);
  const validUserUuid = getValidString(user_uuid);

  const [client, setClient] = useState(null);
  const [localTracks, setLocalTracks] = useState({ audioTrack: null, videoTrack: null });
  const [remoteUsers, setRemoteUsers] = useState({});
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [notes, setNotes] = useState(false);
  const [prescription, setPrescription] = useState(false);
  const localVideoRef = useRef(null);
  const messageBoxRef = useRef(null);

  const [formData, setFormData] = useState({
    patient_history: "",
    differential_diagnosis: "",
    mental_health_screening: "",
    radiology: "",
    final_diagnosis: "",
    recommendation: "",
    general_exam: "",
    eye_exam: "",
    breast_exam: "",
    throat_exam: "",
    abdomen_exam: "",
    chest_exam: "",
    reproductive_exam: "",
    skin_exam: "",
    ros_items: []
  });

  useEffect(() => {
    const initClient = async () => {
        const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        agoraClient.on('user-published', handleUserPublished);
        agoraClient.on('user-unpublished', handleUserUnpublished);

        try {
            const uidToUse = validUserUuid || generateRandomUid(); // Generate UID if not provided

            console.log("Attempting to join channel:", validChannelName, "with UID:", uidToUse);
            await agoraClient.join(APP_ID, validChannelName, token, uidToUse);

            const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
            setLocalTracks({ audioTrack, videoTrack });

            videoTrack.play(localVideoRef.current);
            if (role === 1) { // Assuming 1 indicates publisher
                await agoraClient.publish([audioTrack, videoTrack]);
            }

            setClient(agoraClient);
        } catch (error) {
            console.error("Error during Agora initialization:", error);
            if (error.code === 'UID_CONFLICT') {
                MySwal.fire({
                    icon: 'error',
                    text: 'You are already in another call. Please leave the current call before joining again.',
                    title: 'Error'
                });
            } else {
                MySwal.fire({
                    icon: 'error',
                    text: 'Failed to join the call. Please try again later.',
                    title: 'Error'
                });
            }
        }
    };

    initClient();

    return () => {
        if (localTracks.audioTrack) localTracks.audioTrack.close();
        if (localTracks.videoTrack) localTracks.videoTrack.close();
        if (client) client.leave();
    };
}, [token, validChannelName, validUserUuid, role]);


  const handleUserPublished = async (user, mediaType) => {
    await client.subscribe(user, mediaType);
    if (mediaType === 'video') {
      const playerContainer = document.createElement('div');
      playerContainer.id = user.uid;
      playerContainer.style.width = '100%';
      playerContainer.style.height = '50vh';
      document.getElementById('remote-user-container').append(playerContainer);
      user.videoTrack.play(playerContainer);
    }
    setRemoteUsers(prevUsers => ({ ...prevUsers, [user.uid]: user }));
  };

  const handleUserUnpublished = (user) => {
    const playerContainer = document.getElementById(user.uid);
    if (playerContainer) playerContainer.remove();
    setRemoteUsers(prevUsers => {
      const { [user.uid]: removedUser, ...rest } = prevUsers;
      return rest;
    });
  };

  const toggleMuteAudio = () => {
    if (localTracks.audioTrack) {
      localTracks.audioTrack.setEnabled(!isAudioMuted);
      setIsAudioMuted(prev => !prev);
    }
  };

  const toggleMuteVideo = () => {
    if (localTracks.videoTrack) {
      localTracks.videoTrack.setEnabled(!isVideoMuted);
      setIsVideoMuted(prev => !prev);
    }
  };

  const handleEndCall = async () => {
    try {
      setLoading(true);
      await axiosClient.post(`/api/doctor/${consultationUUID}/end_consultation`);
      setLoading(false);
      MySwal.fire({
        icon: "success",
        text: "Consultation ended successfully.",
        title: "Success"
      });
    } catch (error) {
      setLoading(false);
      MySwal.fire({
        icon: "error",
        text: "Failed to end consultation, try again later.",
        title: "Error"
      });
    }
  };

  const leaveCall = async () => {
    try {
      if (localTracks.audioTrack) localTracks.audioTrack.close();
      if (localTracks.videoTrack) localTracks.videoTrack.close();
      if (client) await client.leave();
      await handleEndCall();
      navigate('/');
    } catch (error) {
      console.error("Error during leaving the call:", error);
      MySwal.fire({
        icon: "error",
        text: "An error occurred while leaving the call.",
        title: "Error"
      });
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { sender: "You", message: newMessage }]);
      setNewMessage("");
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;

      // TODO: Implement message sending to remote users
    }
  };

  const handleNotes = () => {
    setNotes(prev => !prev);
  };

  const handlePrescription = () => {
    setPrescription(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      formData.patient_history,
      formData.differential_diagnosis,
      formData.mental_health_screening,
      formData.radiology,
      formData.final_diagnosis,
      formData.recommendation,
      formData.general_exam,
      formData.eye_exam,
      formData.breast_exam,
      formData.throat_exam,
      formData.abdomen_exam,
      formData.chest_exam,
      formData.reproductive_exam,
      formData.skin_exam,
      formData.ros_items.length
    ];

    if (requiredFields.some(field => !field)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields.'
      });
      return;
    }

    try {
      const formattedRosItems = formData.ros_items.map(item => ({
        header_id: item.id,
        name: item.name || '',
        is_present: item.is_present === 1 ? 1 : 0,
      }));

      await axiosClient.post(`/api/doctor/${consultationUUID}/update_consultation`, {
        ...formData,
        ros_items: formattedRosItems,
      });

      Swal.fire({
        title: 'Success!',
        text: 'Notes have been added successfully.',
        icon: 'success'
      });
      handleNotes();
    } catch (error) {
      console.error('Error during submission:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong!',
        icon: 'error'
      });
      handleNotes();
    }
  };

  const handleSubmitPrescription = async (prescriptions) => {
    try {
      setLoading(true);

      const payload = {
        items: prescriptions.map(prescription => ({
          drug_name: prescription.drug_name,
          dosage_form: prescription.dosage_form,
          dose: prescription.dose,
          dose_unit: prescription.dose_unit,
          frequency: prescription.frequency,
          duration: prescription.duration,
          duration_unit: prescription.duration_unit,
          route_of_administration: prescription.route_of_administration,
          instructions: prescription.instructions,
          refill: prescription.refill,
          reminder_times: prescription.reminder_times
        }))
      };

      await axiosClient.post(`/api/doctor/${consultationUUID}/create_prescription`, payload);

      Swal.fire({
        title: 'Success!',
        text: 'Prescription has been submitted successfully.',
        icon: 'success'
      });

      setLoading(false);
      handlePrescription();
    } catch (error) {
      console.error('Error during prescription submission:', error);
      setLoading(false);
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong!',
        icon: 'error'
      });
      handlePrescription();
    }
  };

  return (
    <div className="video-call-container">
      <div className="local-video" ref={localVideoRef}></div>
      <div id="remote-user-container"></div>

      <div className="controls">
        <button onClick={toggleMuteAudio}>
          {isAudioMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
        <button onClick={toggleMuteVideo}>
          {isVideoMuted ? <FaVideoSlash /> : <FaVideo />}
        </button>
        <button onClick={leaveCall}>
          <FaPhoneSlash />
        </button>
        <button 
          onClick={handleNotes}
          className='p-3 bg-primary-100 text-white font-bold'
        >
          Add Notes
        </button>
        <button 
          onClick={handlePrescription}
          className='p-3 bg-primary-100 text-white font-bold'
        >
          Add Prescription
        </button>
      </div>

      {/* Message Box */}
      <div className="message-box" ref={messageBoxRef}>
        {messages.map((msg, index) => (
          <div key={index}>{msg.sender}: {msg.message}</div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={e => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>

      {/* Modal for Notes */}
      {notes && (
        <Modal onClose={handleNotes}>
          <ConsultationNote handleSubmit={handleSubmit} handleClose={handleNotes} formData={formData} setFormData={setFormData}/>
        </Modal>
      )}

      {/* Modal for Prescription */}
      {prescription && (
        <Modal onClose={handlePrescription}>
          <Prescription
            consultationUUID={consultationUUID}
            handleSubmit={handleSubmitPrescription}
            prescriptions={prescriptions}
            setPrescriptions={setPrescriptions}
          />
        </Modal>
      )}

      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default VideoCall;

import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash } from 'react-icons/fa';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { axiosClient } from '../../axios';
import ConsultationNote from '../../pages/doctors/consultation/ConsultationNote';
import Prescription from '../../pages/doctors/consultation/Prescription';
import { useLocation } from "react-router-dom";

const VideoCall = () => {
  const APP_ID = import.meta.env.VITE_MEDICARE_APP_AGORA_APP_ID;
  const [client, setClient] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState({});
  const MySwal = withReactContent(Swal);
  const [notes, setNotes] = useState(false);
  const [prescription, setPrescription] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  
  // Destructure booking details from location state
  const { bookingId, TOKEN, CHANNEL, user_uuid, user_type, consult } = location.state || {};

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

  const [isJoining, setIsJoining] = useState(false); // New state to track if we are joining

  const joinChannel = async () => {
    if (isJoining || !client) return; // Prevent multiple joins

    setIsJoining(true); // Set joining state to true

    try {
      await client.join(APP_ID, CHANNEL, TOKEN, user_uuid);
      console.log("Joined the channel");

      // Create and publish local audio track
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      setLocalAudioTrack(audioTrack);
      await client.publish([audioTrack]);

      // Create and publish local video track
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      setLocalVideoTrack(videoTrack);
      await client.publish([videoTrack]);
      videoTrack.play(`local-player-${user_uuid}`); // Unique ID for each participant

      // Handle remote user publishing
      client.on('user-published', async (user, mediaType) => {
        if (user.uid !== user_uuid) {
          await client.subscribe(user, mediaType);
          console.log("Subscribed to user:", user.uid);

          if (mediaType === 'audio') {
            user.audioTrack.play();
          }
          if (mediaType === 'video') {
            const remoteVideoTrack = user.videoTrack;
            const remotePlayerId = `remote-player-${user.uid}`;
            remoteVideoTrack.play(remotePlayerId);
            setRemoteUsers(prev => ({
              ...prev,
              [user.uid]: remotePlayerId,
            }));
          }
        }
      });

      // Handle remote user unpublishing
      client.on('user-unpublished', (user, mediaType) => {
        if (mediaType === 'video') {
          const remotePlayerId = remoteUsers[user.uid];
          if (remotePlayerId) {
            document.getElementById(remotePlayerId)?.remove();
            setRemoteUsers(prev => {
              const updated = { ...prev };
              delete updated[user.uid];
              return updated;
            });
          }
        }
      });
    } catch (error) {
      console.error("Failed to join channel: ", error);
    } finally {
      setIsJoining(false); // Reset the joining state
    }
  };

  useEffect(() => {
    const initializeAgora = async () => {
      const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      setClient(agoraClient);
      await joinChannel(); // Call joinChannel here
    };

    initializeAgora();

    return () => {
      // Ensure local tracks are closed when component unmounts
      if (localAudioTrack) localAudioTrack.close();
      if (localVideoTrack) localVideoTrack.close();

      handleLeave(); // Call handleLeave only on unmount
    };
  }, [client]);

  const handleLeave = async () => {
    if (loading) return; // Prevent concurrent calls
    setLoading(true);

    try {
      // Leave the channel
      if (client) {
        await client.leave();
        console.log("Left the channel");
        setRemoteUsers({}); // Clear remote users
        // Navigate based on user type without refreshing
        window.history.pushState(null, '', user_type === "doctor" ? "/doctor-appointments" : "/patient-schedules");
      }
    } catch (error) {
      MySwal.fire({
        icon: "error",
        text: "Failed to leave the call, try again later.",
        title: "Error"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAudio = () => {
    if (localAudioTrack) {
      localAudioTrack.setMuted(!isAudioMuted);
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
      localVideoTrack.setEnabled(!isVideoMuted);
      setIsVideoMuted(!isVideoMuted);
    } else {
      const newVideoTrack = await AgoraRTC.createCameraVideoTrack();
      setLocalVideoTrack(newVideoTrack);
      await client.publish([newVideoTrack]);
      newVideoTrack.play(`local-player-${user_uuid}`); // Unique ID for each participant
      setIsVideoMuted(false);
    }
  };

  const handleNotes = () => setNotes(prev => !prev);
  const handlePrescription = () => setPrescription(prev => !prev);

  const handleSubmitPrescription = async (prescriptions) => {
    setLoading(true);
    try {
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
      await axiosClient.post(`/api/doctor/${consult}/create_prescription`, payload);

      Swal.fire({
        title: 'Success!',
        text: 'Prescription has been submitted successfully.',
        icon: 'success'
      });
      handlePrescription();
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong!',
        icon: 'error'
      });
      handlePrescription();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = Object.values(formData).every(field => {
      return field !== "" && (Array.isArray(field) ? field.length > 0 : true);
    });

    if (!requiredFields) {
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
        is_present: item.is_present ? 1 : 0,
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

  return (
    <div className="video-call-container">
      <div id={`local-player-${user_uuid}`} className="local-player"></div>
      {Object.keys(remoteUsers).map(uid => (
        <div key={uid} id={remoteUsers[uid]} className="remote-player"></div>
      ))}

      <div className="flex gap-5 mt-5">
        <button onClick={toggleAudio} className="bg-blue-500 text-white px-4 py-2">
          {isAudioMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
        <button onClick={toggleVideo} className="bg-blue-500 text-white px-4 py-2">
          {isVideoMuted ? <FaVideoSlash /> : <FaVideo />}
        </button>
        <button onClick={handleLeave} className="bg-red-500 text-white px-4 py-2">
          <FaPhoneSlash />
        </button>
        {
          user_type === "doctor" ? (
            <>
              <button onClick={handleNotes} className="bg-green-500 text-white px-4 py-2">Add Notes</button>
              <button onClick={handlePrescription} className="bg-yellow-500 text-white px-4 py-2">Add Prescription</button>
            </>
          ):(null)
        }
      </div>

      <Backdrop open={loading} style={{ zIndex: 1000 }}>
        <CircularProgress />
      </Backdrop>

      {notes && <ConsultationNote formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} />}
      {prescription && <Prescription handleSubmitPrescription={handleSubmitPrescription} setPrescriptions={setPrescriptions} prescriptions={prescriptions} />}
    </div>
  );
};

export default VideoCall;

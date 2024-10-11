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
  const [client, setClient] = useState(AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }));
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

  const joinChannel = async () => {
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

      // Play local video track in a local player element
      videoTrack.play('local-player');

      // Subscribe to remote users
      client.on('user-published', handleUserPublished);
      client.on('user-unpublished', handleUserUnpublished);
    } catch (error) {
      console.error("Failed to join channel: ", error);
      MySwal.fire({ icon: "error", text: "Failed to join channel", title: "Error" });
    }
  };

  const handleUserPublished = async (user, mediaType) => {
    await client.subscribe(user, mediaType);
    console.log("Subscribed to user:", user.uid);
    
    if (mediaType === 'audio') {
      user.audioTrack.play();
    }
    
    if (mediaType === 'video') {
      const remoteVideoTrack = user.videoTrack;
      const remotePlayerId = `remote-player-${user.uid}`;
      remoteVideoTrack.play(remotePlayerId); // Play remote video in the correct DOM element
      setRemoteUsers((prev) => ({ ...prev, [user.uid]: remotePlayerId }));
      console.log(`Remote video published for user: ${user.uid}`);
    }
  };

  const handleUserUnpublished = (user, mediaType) => {
    if (mediaType === 'video') {
      const remotePlayerId = remoteUsers[user.uid];
      if (remotePlayerId) {
        document.getElementById(remotePlayerId)?.remove();
        setRemoteUsers((prev) => {
          const updated = { ...prev };
          delete updated[user.uid];
          return updated;
        });
      }
    }
  };

  useEffect(() => {
    joinChannel();
    return () => {
      handleLeave();
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
    };
  }, []); // No need for client as a dependency


  const handleLeave = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // Close local tracks
      if (localAudioTrack) localAudioTrack.close();
      if (localVideoTrack) localVideoTrack.close();
  
      // If the user is the doctor, call the end consultation API
      if (user_type === "doctor") {
        await axiosClient.post(`/api/doctor/${consultationUUID}/end_consultation`);
        console.log("Consultation ended for doctor");
      }
  
      // Leave the channel
      await client.leave();
      console.log("Left the channel");
      setRemoteUsers({});
      
      // Reload the page or navigate to the appropriate dashboard
      window.location.reload(user_type === "doctor" ? "/doctor-appointments" : "/patient-schedules");
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
      try {
        const newVideoTrack = await AgoraRTC.createCameraVideoTrack();
        setLocalVideoTrack(newVideoTrack);
        await client.publish([newVideoTrack]);
        newVideoTrack.play('local-player'); // Play the new video track in local player
        setIsVideoMuted(false);
      } catch (error) {
        console.error("Error creating video track:", error);
      }
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
      Swal.fire({ title: 'Success!', text: 'Prescription has been submitted successfully.', icon: 'success' });
      handlePrescription();
    } catch (error) {
      console.error(error);
      Swal.fire({ title: 'Error!', text: 'Something went wrong!', icon: 'error' });
      handlePrescription();
    } finally {
      setLoading(false);
    }
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
      await axiosClient.post(`/api/doctor/${consult}/update_consultation`, {
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
    <div>
      {loading && <Backdrop open><CircularProgress /></Backdrop>}
      <div id="local-player" style={{ width: '100%', height: '100%' }} />
      {Object.keys(remoteUsers).map(uid => (
        <div id={remoteUsers[uid]} key={uid} style={{ width: '100%', height: '100%' }} />
      ))}
      <div>
        <button onClick={toggleAudio}>{isAudioMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}</button>
        <button onClick={toggleVideo}>{isVideoMuted ? <FaVideoSlash /> : <FaVideo />}</button>
        <button onClick={handleLeave}><FaPhoneSlash /></button>
      </div>
      {user_type === "doctor" ? (
        <div className='flex gap-2 mt-2'>
          <button onClick={handleNotes} className="bg-green-600 text-white py-2 px-4 rounded">
            Add Note
          </button>
          <button onClick={handlePrescription} className="bg-blue-600 text-white py-2 px-4 rounded">
            Add Prescription
          </button>
        </div>
      ) : null}

      {notes && <ConsultationNote formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} handleClose={handleNotes} />}
      {prescription && <Prescription handleSubmitPrescription={handleSubmitPrescription} setPrescriptions={setPrescriptions} prescriptions={prescriptions} handleClose={handlePrescription}/>}
    </div>
  );
};

export default VideoCall;

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

      // Create local audio track
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      setLocalAudioTrack(audioTrack);
      await client.publish([audioTrack]);

      // Create local video track
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      setLocalVideoTrack(videoTrack);
      await client.publish([videoTrack]);
      videoTrack.play('local-player');

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
            setRemoteUsers((prev) => ({
              ...prev,
              [user.uid]: remotePlayerId,
            }));
          }
        }
      });

      client.on('user-unpublished', (user, mediaType) => {
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
      handleLeave();
    };
  }, [client]);

  const handleLeave = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // Close local tracks
      if (localAudioTrack) {
        localAudioTrack.close();
      }
      if (localVideoTrack) {
        localVideoTrack.close();
      }

      // Leave the channel
      if (client) {
        await client.leave();
        console.log("Left the channel");
        setRemoteUsers({});
        window.location.reload(user_type === "doctor" ? "/doctor-appointments" : "/patient-schedules");
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
      newVideoTrack.play('local-player');
      setIsVideoMuted(false);
    }
  };

  const handleNotes = () => {
    setNotes((prev) => !prev);
  };

  const handlePrescription = () => {
    setPrescription((prev) => !prev);
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
      await axiosClient.post(`/api/doctor/${consult}/create_prescription`, payload);

      Swal.fire({
        title: 'Success!',
        text: 'Prescription has been submitted successfully.',
        icon: 'success'
      });

      handlePrescription();
    } catch (error) {
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

  return (
    <div className="w-full flex flex-col items-center justify-center mx-auto pt-40 sm:pt-20">
      <h2>Video Call: {user_uuid}</h2>
      <div className='flex lg:flex-row sm:flex-col items-center gap-5'>
        <div
          id="local-player"
          style={{ width: "400px", height: "300px", border: "1px solid black", backgroundColor: "black" }}
        />
        {Object.keys(remoteUsers).map((uid) => (
          <div
            key={uid}
            id={remoteUsers[uid]}
            style={{ width: "400px", height: "300px", border: "1px solid black", backgroundColor: "gray", marginTop: '10px' }}
          />
        ))}
      </div>

      <div className="mt-4 flex">
        <button onClick={handleLeave} className="mx-2 bg-red-500 text-white py-2 px-4 rounded">
          <FaPhoneSlash />
        </button>
        <button onClick={toggleAudio} className="mx-2 bg-blue-500 text-white py-2 px-4 rounded">
          {isAudioMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
        <button onClick={toggleVideo} className="mx-2 bg-green-500 text-white py-2 px-4 rounded">
          {isVideoMuted ? <FaVideoSlash /> : <FaVideo />}
        </button>
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
      {prescription && <Prescription prescriptions={prescriptions} setPrescriptions={setPrescriptions} handleSubmitPrescription={handleSubmitPrescription} handleClose={handlePrescription} />}

      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default VideoCall;

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
import { useLocation , useNavigate} from "react-router-dom";

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
  const navigate = useNavigate();

  const { bookingId, TOKEN, CHANNEL, user_uuid, user_type, consult } = location.state || {};

// Function to join the Agora channel
const joinChannel = async () => {
  if (!client) {
    const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    setClient(agoraClient);
  }

  if (client) {
    try {
      await client.join(APP_ID, CHANNEL, TOKEN, user_uuid);
      console.log("Joined the channel");

      // Create and publish local audio track
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      setLocalAudioTrack(audioTrack);
      await client.publish([audioTrack]); // Publish audio track

      // Create and publish local video track
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      setLocalVideoTrack(videoTrack);
      await client.publish([videoTrack]); // Publish video track

      // Play the local video in a player
      videoTrack.play('local-player');

      // Subscribe to remote users
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log("Subscribed to user:", user.uid);

        if (mediaType === 'audio') {
          user.audioTrack.play(); // Play remote audio track
        }

        if (mediaType === 'video') {
          const remoteVideoTrack = user.videoTrack;
          const remotePlayerId = `remote-player-${user.uid}`;
          setRemoteUsers((prev) => ({
            ...prev,
            [user.uid]: remotePlayerId,
          }));
          remoteVideoTrack.play(remotePlayerId); // Play remote video track
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
    }
  }
};

useEffect(() => {
  joinChannel();
  return () => {
    handleLeave();
  };
}, [client]);


 

  const handleLeave = async () => {
    if (loading) return;
    setLoading(true);
  
    try {
      // Close local tracks
      if (localAudioTrack) localAudioTrack.close();
      if (localVideoTrack) localVideoTrack.close();
  
      // Leave the channel
      if (client) {
        await client.leave();
        console.log("Left the channel");
  
        // If user is a doctor, trigger the end consultation API
        if (user_type === "doctor") {
          const response = await axios.post(`/api/doctor/${consult}/end_consultation`);
          console.log("Consultation ended:", response.data);
        }
  
        // Navigate to appropriate dashboard
        setRemoteUsers({});
        navigate(user_type === "doctor" ? "/doctor-appointments" : "/patient-schedules");
      }
    } catch (error) {
      MySwal.fire({
        icon: "error",
        text: "Failed to leave the call, try again later.",
        title: "Error",
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
    <div className="w-full flex flex-col items-center justify-center mx-auto pt-40 sm:pt-20">
      <h2>Video Call: {user_uuid}</h2>
      <div className='flex lg:flex-row sm:flex-col items-center gap-5'>
        {/* Local player */}
        <div
          id="local-player"
          style={{ width: "400px", height: "300px", border: "1px solid black", backgroundColor: "black" }}
        />

        {/* Remote players */}
        {Object.keys(remoteUsers).map((uid) => (
          <div
            key={uid}
            id={remoteUsers[uid]}
            style={{ width: "400px", height: "300px", border: "1px solid black", backgroundColor: "gray", marginTop: '10px' }}
          />
        ))}
      </div>

      {/* Audio/Video controls */}
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
      
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default VideoCall;

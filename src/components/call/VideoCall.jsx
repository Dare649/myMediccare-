import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng'; // Import the Agora RTC SDK
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash } from 'react-icons/fa';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { axiosClient } from '../../axios';
import ConsultationNote from '../../pages/doctors/consultation/ConsultationNote';
import Prescription from '../../pages/doctors/consultation/Prescription';
import Modal from '../Modal';

const VideoCall = ({ APP_ID, TOKEN, CHANNEL, user_uuid, consult, user, handleCloseCall }) => {
  const [client, setClient] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState({}); // State to store remote users
  const MySwal = withReactContent(Swal);
  const [notes, setNotes] = useState(false);
  const [prescription, setPrescription] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
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


  const handleLeave = async () => {
    try {
        setLoading(true);
      // Close local tracks
      if (localAudioTrack) {
        localAudioTrack.close();
      }
      if (localVideoTrack) {
        localVideoTrack.close();
      }
      
      // Leave the Agora channel
      if (client) {
        await client.leave();
        console.log("Left the channel");
        setRemoteUsers({});
        handleCloseCall();
      }

      // Make the POST API call to end the consultation
      await axiosClient.post(`/api/doctor/${consult}/end_consultation`);
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
      // Create a new video track if it's not initialized
      const newVideoTrack = await AgoraRTC.createCameraVideoTrack();
      setLocalVideoTrack(newVideoTrack);
      newVideoTrack.play('local-player');
      setIsVideoMuted(false);
    }
  };

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
  
        // Create and publish video track if available
        if (localVideoTrack) {
          await client.publish([localVideoTrack]); // Publish video track
        } else {
          const newVideoTrack = await AgoraRTC.createCameraVideoTrack();
          setLocalVideoTrack(newVideoTrack);
          await client.publish([newVideoTrack]); // Publish video track
          newVideoTrack.play('local-player');
        }
  
        // Subscribe to remote users
        client.on('user-published', async (user, mediaType) => {
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
            console.log(`Remote video published for user: ${user.uid}`);
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
  }, [client]); // Add client as a dependency



  const handleNotes = () => {
    setNotes(prev => {
      console.log("Toggling Notes Modal: ", !prev);
      return !prev;
    });
  };
  
  const handlePrescription = () => {
    setPrescription(prev => {
      console.log("Toggling Prescription Modal: ", !prev);
      return !prev;
    });
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
    <div className="flex flex-col items-center justify-center mx-auto lg:my-20 sm:my-10">
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
      {
        user === "doctor" ? (
            <div className='mt-4 flex lg:flex-row sm:flex-col items-center gap-3'>
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
        ): (
            null
        )
      }

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
            handleClose={handlePrescription}
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

import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import Modal from "./Modal";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from 'react-icons/fa';
import ConsultationNote from '../pages/doctors/consultation/ConsultationNote';
import { axiosClient } from '../axios';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const APP_ID = "894b043a9e60426285be31a3e8e9c4c0";

const getValidString = (input) => {
  if (!input || input.length > 64) return input ? input.substring(0, 64) : "";
  return input;
};

const VideoCallPatient = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  
  const { bookingId, token, channelName, role, user_uuid, user_type, consultationUUID } = location.state || {};
  
  const validChannelName = getValidString(channelName);
  const validUserUuid = getValidString(user_uuid);
  
  const [client, setClient] = useState(null);
  const [localTracks, setLocalTracks] = useState({ audioTrack: null, videoTrack: null });
  const [remoteUsers, setRemoteUsers] = useState({});
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const localVideoRef = useRef(null);
  const messageBoxRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [notes, setNotes] = useState(false);
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

  useEffect(() => {
    const initClient = async () => {
      const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  
      agoraClient.on('user-published', handleUserPublished);
      agoraClient.on('user-unpublished', handleUserUnpublished);
  
      try {
        await agoraClient.join(APP_ID, validChannelName, token, null);
  
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        setLocalTracks({ audioTrack, videoTrack });
  
        videoTrack.play(localVideoRef.current);
  
        await agoraClient.publish([audioTrack, videoTrack]);
        setClient(agoraClient);
      } catch (error) {
        console.error("Error initializing Agora client:", error);
      }
    };
  
    initClient();
  
    return () => {
      if (localTracks.audioTrack) localTracks.audioTrack.close();
      if (localTracks.videoTrack) localTracks.videoTrack.close();
      if (client) client.leave();
    };
  }, [token, validChannelName]);

  const handleUserPublished = async (user, mediaType) => {
    await client.subscribe(user, mediaType);
    const playerContainer = document.createElement('div');
    playerContainer.id = `player-${user.uid}`;
    playerContainer.style.width = '100%';
    playerContainer.style.height = '50vh';
    document.getElementById('remote-user-container').appendChild(playerContainer);

    if (mediaType === 'video') {
      user.videoTrack.play(playerContainer);
    } else if (mediaType === 'audio') {
      user.audioTrack.play();
    }

    setRemoteUsers((prevUsers) => ({
      ...prevUsers,
      [user.uid]: user,
    }));
  };

  const handleUserUnpublished = (user) => {
    const playerContainer = document.getElementById(`player-${user.uid}`);
    if (playerContainer) playerContainer.remove();

    setRemoteUsers((prevUsers) => {
      const { [user.uid]: _, ...remainingUsers } = prevUsers;
      return remainingUsers;
    });
  };

  const toggleMuteAudio = () => {
    if (localTracks.audioTrack) {
      localTracks.audioTrack.setEnabled(isAudioMuted);
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleMuteVideo = () => {
    if (localTracks.videoTrack) {
      localTracks.videoTrack.setEnabled(isVideoMuted);
      setIsVideoMuted(!isVideoMuted);
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
      console.error("Error leaving the call:", error);
      MySwal.fire({
        icon: "error",
        text: "Failed to leave the call, try again later.",
        title: "Error"
      });
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { sender: "You", message: newMessage }]);
      setNewMessage("");
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  };

  const handleNotes = () => {
    setNotes((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patient_history || !formData.differential_diagnosis || !formData.final_diagnosis) {
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
    <div className="video-call-container lg:mt-40 sm:mt-20">
      {/* Local user video */}
      <div className="local-video" ref={localVideoRef} style={{ width: '100%', height: '50vh', backgroundColor: 'black' }}></div>
      {/* Remote user container */}
      <div id="remote-user-container" style={{ display: 'flex', flexDirection: 'row', width: '100%' }}></div>
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
      </div>
      {/* Chat and Notes UI */}
      <div className="chat-box">
        <div className="messages" ref={messageBoxRef}>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.sender}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <button onClick={handleNotes}>
        {notes ? "Close Notes" : "Open Notes"}
      </button>
      {notes && (
        <form onSubmit={handleSubmit}>
          {/* Form fields for consultation notes */}
          <textarea
            placeholder="Patient History"
            value={formData.patient_history}
            onChange={(e) => setFormData({ ...formData, patient_history: e.target.value })}
          />
          <textarea
            placeholder="Differential Diagnosis"
            value={formData.differential_diagnosis}
            onChange={(e) => setFormData({ ...formData, differential_diagnosis: e.target.value })}
          />
          <textarea
            placeholder="Final Diagnosis"
            value={formData.final_diagnosis}
            onChange={(e) => setFormData({ ...formData, final_diagnosis: e.target.value })}
          />
          {/* Additional fields can be added here */}
          <button type="submit">Submit Notes</button>
        </form>
      )}
      <Backdrop open={loading} style={{ zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default VideoCallPatient;

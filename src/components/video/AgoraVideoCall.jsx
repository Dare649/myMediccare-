import React, { useState, useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const AgoraVideoCall = ({ channelName, role, doctorUID, patientUID }) => {
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [trackState, setTrackState] = useState({ video: true, audio: true });

  const localVideoRef = useRef(null);
  const remoteUsersRef = useRef([]);

  useEffect(() => {
    client.on("user-published", handleUserPublished);
    client.on("user-left", handleUserLeft);

    return () => {
      leaveChannel();
      client.off("user-published", handleUserPublished);
      client.off("user-left", handleUserLeft);
    };
  }, []);

  const joinChannel = async () => {
    await client.join(import.meta.env.VITE_MEDICARE_APP_AGORA_APP_ID, channelName, import.meta.env.VITE_MEDICARE_APP_AGORA_APP_TOKEN, doctorUID);

    const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
    setLocalTracks([microphoneTrack, cameraTrack]);

    if (localVideoRef.current) {
      cameraTrack.play(localVideoRef.current);
    }

    await client.publish([microphoneTrack, cameraTrack]);
    setJoined(true);
  };

  const leaveChannel = async () => {
    localTracks.forEach((track) => {
      track.stop();
      track.close();
    });

    await client.leave();
    setJoined(false);
    setUsers([]);
  };

  const handleUserPublished = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      setUsers((prevUsers) => [...prevUsers, user]);
      user.videoTrack.play(document.getElementById(`remote-user-${user.uid}`));
    }

    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  };

  const handleUserLeft = (user) => {
    setUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid));
  };

  const toggleVideo = async () => {
    const videoTrack = localTracks[1];
    if (trackState.video) {
      await videoTrack.setEnabled(false);
    } else {
      await videoTrack.setEnabled(true);
    }
    setTrackState((prev) => ({ ...prev, video: !prev.video }));
  };

  const toggleAudio = async () => {
    const audioTrack = localTracks[0];
    if (trackState.audio) {
      await audioTrack.setEnabled(false);
    } else {
      await audioTrack.setEnabled(true);
    }
    setTrackState((prev) => ({ ...prev, audio: !prev.audio }));
  };

  return (
    <div className="agora-video-call mt-40 ">
      {joined ? (
        <div className="video-call-container">
          <div className="local-stream">
            <p>Doctor's Video</p>
            <div ref={localVideoRef} style={{ width: "400px", height: "300px" }}></div>
          </div>
          <div className="remote-streams">
            {users.map((user) => (
              <div key={user.uid} id={`remote-user-${user.uid}`} style={{ width: "400px", height: "300px" }}>
                <p>Remote User: {user.uid}</p>
              </div>
            ))}
          </div>
          <div className="controls">
            <button onClick={toggleVideo}>{trackState.video ? "Turn off Video" : "Turn on Video"}</button>
            <button onClick={toggleAudio}>{trackState.audio ? "Mute" : "Unmute"}</button>
            <button onClick={leaveChannel}>Leave</button>
          </div>
        </div>
      ) : (
        <button onClick={joinChannel}>Join Call</button>
      )}
    </div>
  );
};

export default AgoraVideoCall;

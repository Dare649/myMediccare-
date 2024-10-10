import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng'; // Import the Agora RTC SDK
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash } from 'react-icons/fa';

const VideoCall = ({ APP_ID, TOKEN, CHANNEL, user_uuid }) => {
  const [client, setClient] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  const handleLeave = async () => {
    if (localAudioTrack) {
      localAudioTrack.close();
    }
    if (localVideoTrack) {
      localVideoTrack.close();
    }
    if (client) {
      await client.leave();
      console.log("Left the channel");
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
      // Create the client instance if it doesn't exist
      const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      setClient(agoraClient);
    }

    // Wait until the client is set
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
        }

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

  return (
    <div className="flex flex-col items-center justify-center mx-auto mt-60">
      <h2>Video Call: {user_uuid}</h2>
      <div
        id="local-player"
        style={{ width: "400px", height: "300px", border: "1px solid black", backgroundColor: "black" }}
      />
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
    </div>
  );
};

export default VideoCall;

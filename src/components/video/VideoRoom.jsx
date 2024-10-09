import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';
import { useLocation } from 'react-router-dom';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from 'react-icons/fa'; // Importing icons

const APP_ID = "894b043a9e60426285be31a3e8e9c4c0";

const client = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'vp8',
});

export const VideoRoom = () => {
  const location = useLocation();
  const { bookingId, token, channelName, role, user_uuid } = location.state;

  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isMutedAudio, setIsMutedAudio] = useState(false); // Audio mute state
  const [isMutedVideo, setIsMutedVideo] = useState(false); // Video mute state

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === 'video') {
      setUsers((previousUsers) => [...previousUsers, user]);
    }

    if (mediaType === 'audio') {
      // user.audioTrack.play()
    }
  };

  const handleUserLeft = (user) => {
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
  };

  useEffect(() => {
    client.on('user-published', handleUserJoined);
    client.on('user-left', handleUserLeft);

    client
      .join(APP_ID, channelName, token, user_uuid)
      .then((uid) => {
        setIsJoined(true);

        if (role === 1) {
          // Publisher logic
          return AgoraRTC.createMicrophoneAndCameraTracks().then((tracks) => {
            const [audioTrack, videoTrack] = tracks;
            setLocalTracks(tracks);
            setUsers((previousUsers) => [
              ...previousUsers,
              {
                uid,
                videoTrack,
                audioTrack,
                user_uuid,
              },
            ]);
            client.publish(tracks);
          });
        } else {
          console.log('Joined as subscriber');
        }
      });

    return () => {
      if (isJoined) {
        for (let localTrack of localTracks) {
          localTrack.stop();
          localTrack.close();
        }
        client.off('user-published', handleUserJoined);
        client.off('user-left', handleUserLeft);
        if (role === 1) {
          client.unpublish(localTracks).then(() => client.leave());
        } else {
          client.leave();
        }
      }
    };
  }, [channelName, token, role, user_uuid, localTracks, isJoined]);

  // Mute/Unmute Audio
  const toggleMuteAudio = () => {
    if (localTracks[0]) {
      if (isMutedAudio) {
        localTracks[0].setEnabled(true); // Unmute audio
      } else {
        localTracks[0].setEnabled(false); // Mute audio
      }
      setIsMutedAudio(!isMutedAudio);
    }
  };

  // Turn Video On/Off
  const toggleMuteVideo = () => {
    if (localTracks[1]) {
      if (isMutedVideo) {
        localTracks[1].setEnabled(true); // Turn video on
      } else {
        localTracks[1].setEnabled(false); // Turn video off
      }
      setIsMutedVideo(!isMutedVideo);
    }
  };

  // End Call
  const endCall = () => {
    for (let localTrack of localTracks) {
      localTrack.stop();
      localTrack.close();
    }
    client.leave();
    setUsers([]); // Clear the user list on call end
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 200px)' }}>
        {users.map((user) => (
          <VideoPlayer key={user.uid} user={user} user_uuid={user_uuid} />
        ))}
      </div>

      {/* Control Panel with Icons */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={toggleMuteAudio}>
          {isMutedAudio ? <FaMicrophoneSlash size={24} /> : <FaMicrophone size={24} />}
        </button>
        <button onClick={toggleMuteVideo}>
          {isMutedVideo ? <FaVideoSlash size={24} /> : <FaVideo size={24} />}
        </button>
        <button onClick={endCall} style={{ color: 'red' }}>
          <FaPhoneSlash size={24} />
        </button>
      </div>
    </div>
  );
};

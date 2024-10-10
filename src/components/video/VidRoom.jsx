import { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import VidPlayer from "./VidPlayer";
import { useLocation } from 'react-router-dom';
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash } from "react-icons/fa";

const VidRoom = () => {
    const location = useLocation();
    const { bookingId, token, channelName, role, user_uuid } = location.state || {};
    const APP_ID = "894b043a9e60426285be31a3e8e9c4c0"; // Your Agora App ID
    const TOKEN = token;
    const CHANNEL = channelName;

    const [users, setUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState([]);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const client = AgoraRTC.createClient({
        mode: "rtc",
        codec: 'vp8',
    });

    // Check if already in a channel
    const [isJoined, setIsJoined] = useState(false);

    const handleUserJoined = async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
            setUsers((previousUsers) => [
                ...previousUsers,
                {
                    uid: user.uid,
                    videoTrack: user.videoTrack,
                    audioTrack: user.audioTrack,
                },
            ]);
            user.videoTrack.play(`remote-player-${user.uid}`);
        }

        if (mediaType === "audio") {
            user.audioTrack.play();
        }
    };

    const handleUserLeft = (user) => {
        setUsers((previousUsers) =>
            previousUsers.filter((u) => u.uid !== user.uid)
        );
    };

    const leaveChannel = async () => {
        try {
            if (localTracks.length > 0) {
                localTracks.forEach((track) => {
                    track.stop();
                    track.close();
                });
                setLocalTracks([]);
            }

            if (client) {
                await client.leave();
                setIsJoined(false);
            }
        } catch (error) {
            console.error("Error leaving channel:", error);
        }
    };

    const toggleAudio = () => {
        if (localTracks[0]) {
            const audioTrack = localTracks[0];
            audioTrack.setMuted(!isAudioMuted);
            setIsAudioMuted(!isAudioMuted);
        }
    };

    const toggleVideo = async () => {
        if (localTracks[1]) {
            const videoTrack = localTracks[1];
            try {
                await videoTrack.setEnabled(!isVideoMuted);
                setIsVideoMuted(!isVideoMuted);
            } catch (error) {
                console.error("Error toggling video:", error);
            }
        }
    };

    useEffect(() => {
        const joinChannel = async () => {
            if (isJoined) return;
            try {
                await client.join(APP_ID, CHANNEL, TOKEN, user_uuid);
                const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                videoTrack.play('local-player');

                setLocalTracks([audioTrack, videoTrack]);
                await client.publish([audioTrack, videoTrack]);

                setUsers((prevUsers) => [...prevUsers, {
                    uid: user_uuid,
                    audioTrack,
                    videoTrack,
                }]);

                setIsJoined(true);
            } catch (error) {
                console.error("Error joining channel:", error);
            }
        };

        client.on('user-published', handleUserJoined);
        client.on('user-left', handleUserLeft);

        joinChannel();

        return () => {
            leaveChannel();
            client.off('user-published', handleUserJoined);
            client.off('user-left', handleUserLeft);
        };
    }, [client, user_uuid, TOKEN, CHANNEL, isJoined]);

    return (
        <div className="flex flex-col items-center justify-center mx-auto mt-60">
            <h2>Video Room</h2>
            <div
                id="local-player"
                style={{ width: "400px", height: "300px", border: "1px solid black", backgroundColor: "black" }}
            ></div>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "10px"
            }}>
                {users.map((user) => (
                    <VidPlayer key={user.uid} user={user} />
                ))}
            </div>
            <div className="mt-4 flex">
                <button onClick={leaveChannel} className="mx-2 bg-red-500 text-white py-2 px-4 rounded">
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

export default VidRoom;

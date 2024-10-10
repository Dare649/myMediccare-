import { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import VidPlayer from "./VidPlayer";
import { useLocation } from 'react-router-dom';
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash } from "react-icons/fa";

const VidRoom = () => {
    const location = useLocation();
    const { bookingId, token, channelName, role, user_uuid } = location.state || {};
    const APP_ID = "894b043a9e60426285be31a3e8e9c4c0";
    const TOKEN = token;
    const CHANNEL = channelName;
    const [users, setUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState([]);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);

    const client = AgoraRTC.createClient({
        mode: "rtc",
        codec: 'vp8'
    });

    const handleUserJoined = async (user, mediaType) => {
        await client.subscribe(user, mediaType);

        if (mediaType === "video") {
            const videoTrack = user.videoTrack;
            videoTrack.play(`remote-player-${user.uid}`);
            setUsers((previousUsers) => [
                ...previousUsers, 
                { uid: user.uid, videoTrack, audioTrack: user.audioTrack }
            ]);
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
                console.log("Left the channel");
            }
        } catch (error) {
            console.error("Error leaving channel:", error);
        }
    };

    const toggleAudio = () => {
        if (localTracks[0]) {
            const audioTrack = localTracks[0];
            audioTrack.setMuted(isAudioMuted);
            setIsAudioMuted(!isAudioMuted);
        }
    };

    const toggleVideo = async () => {
        if (localTracks[1]) {
            const videoTrack = localTracks[1];
            try {
                await videoTrack.setEnabled(!isVideoMuted);

                if (!isVideoMuted) {
                    videoTrack.play('local-player');
                } else {
                    videoTrack.stop();
                }

                setIsVideoMuted(!isVideoMuted);
            } catch (error) {
                console.error("Error toggling video:", error);
            }
        }
    };

    useEffect(() => {
        const joinChannel = async () => {
            try {
                const uid = user_uuid;
                await client.join(APP_ID, CHANNEL, TOKEN, uid);
                console.log("User connected with uid:", uid);

                const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                videoTrack.play('local-player');

                setLocalTracks([audioTrack, videoTrack]);
                await client.publish([audioTrack, videoTrack]);
                console.log("Tracks published");

                setUsers((previousUsers) => [
                    ...previousUsers,
                    { uid, audioTrack, videoTrack }
                ]);
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
    }, [client, user_uuid, TOKEN, CHANNEL]);

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
                    <VidPlayer key={`${user.uid}-${bookingId}`} user={user} /> 
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

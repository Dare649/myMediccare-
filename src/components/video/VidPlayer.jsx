import { useEffect, useRef } from "react";

const VidPlayer = ({ user }) => {
    const ref = useRef();

    useEffect(() => {
        // Check if user has a video track and play it
        if (user.videoTrack) {
            user.videoTrack.play(ref.current);
        }

        // Cleanup function to stop the video track
        return () => {
            if (user.videoTrack) {
                user.videoTrack.stop();
                user.videoTrack.close(); // Close the track to release resources
            }
        };
    }, [user.videoTrack]);

    return (
        <div style={{ position: 'relative', width: "200px", height: "200px", backgroundColor: "#000", borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                <div ref={ref} style={{ width: "100%", height: "100%" }}></div>
            </div>
            <div style={{ position: 'absolute', bottom: 5, left: 5, color: "#fff" }}>
                Uid: {user.uid}
            </div>
        </div>
    );
};

export default VidPlayer;

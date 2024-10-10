import { useEffect, useRef } from "react";

const VidPlayer = ({ user }) => {
    const ref = useRef();

    useEffect(() => {
        if (user.videoTrack) {
            // Play the video track on the specified ref
            user.videoTrack.play(ref.current);
        }

        // Cleanup function to stop and close the video track when the component unmounts
        return () => {
            if (user.videoTrack) {
                user.videoTrack.stop();
                user.videoTrack.close();
            }
        };
    }, [user.videoTrack]); // Add user.videoTrack as a dependency

    return (
        <div>
            {/* Display user UUID instead of uid */}
            Uid: {user.uid} {/* Ensure this is displaying the correct UID */}
            <div 
                ref={ref} 
                style={{ width: "200px", height: "200px", backgroundColor: "#000" }} // Added background color for visibility
            ></div>
        </div>
    );
};

export default VidPlayer;

import { useEffect, useRef } from "react";

const VidPlayer = ({ user }) => {
    const ref = useRef();

    useEffect(() => {
        if (user.videoTrack) {
            user.videoTrack.play(ref.current);
        }

        return () => {
            if (user.videoTrack) {
                user.videoTrack.stop();
            }
        };
    }, [user.videoTrack]);

    return (
        <div>
            Uid: {user.uid}
            <div
                ref={ref}
                style={{ width: "200px", height: "200px", backgroundColor: "#000" }}
            ></div>
        </div>
    );
};

export default VidPlayer;

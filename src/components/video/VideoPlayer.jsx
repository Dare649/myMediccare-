import React, { useEffect, useRef } from 'react';

export const VideoPlayer = ({ user }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (user.videoTrack && videoRef.current) {
      user.videoTrack.play(videoRef.current);  // Play the video track in the ref
    }
    return () => {
      if (user.videoTrack) {
        user.videoTrack.stop();  // Stop the video track on unmount
      }
    };
  }, [user]);

  return (
    <div>
      <div ref={videoRef} style={{ width: '200px', height: '150px', backgroundColor: 'black' }}></div>
      <p>{user.uid}</p>
    </div>
  );
};

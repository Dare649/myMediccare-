import React, { useEffect, useRef } from 'react';

export const VideoPlayer = ({ user, user_uuid }) => { // Receive user_uuid as a prop
  const ref = useRef();

  useEffect(() => {
    if (user.videoTrack) {
      user.videoTrack.play(ref.current);
    }
  }, [user]);

  return (
    <div>
      <p>Uid: {user.uid}</p>
      <p>User UUID: {user_uuid}</p> {/* Display user_uuid */}
      <div ref={ref} style={{ width: '200px', height: '200px' }}></div>
    </div>
  );
};

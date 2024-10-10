// Client.jsx
import React from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { AgoraRTCProvider } from 'agora-rtc-react';

const Client = ({ children }) => {
  const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

  return (
    <AgoraRTCProvider client={client}>
      {children}
    </AgoraRTCProvider>
  );
};

export default Client;

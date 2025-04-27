import { useState, useEffect, useCallback } from 'react';

interface GameMessage {
  type: string;
  data: any;
}

interface PeerConnectionHook {
  peerConnection: RTCPeerConnection | null;
  dataChannel: RTCDataChannel | null;
  isConnected: boolean;
  remotePlayer: any;
  initPeerConnection: () => void;
  createDataChannel: () => void;
  sendMessage: (message: GameMessage) => void;
}

export const usePeerConnection = (): PeerConnectionHook => {
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [remotePlayer, setRemotePlayer] = useState<any>(null);

  const initPeerConnection = useCallback(() => {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          // Candidate'leri diğer oyuncuya gönder
          console.log('New ICE candidate:', e.candidate);
        }
      };

      pc.ondatachannel = (e) => {
        const channel = e.channel;
        setupDataChannel(channel);
      };

      setPeerConnection(pc);
    } catch (error) {
      console.error('Error initializing peer connection:', error);
    }
  }, []);

  const setupDataChannel = (channel: RTCDataChannel) => {
    channel.onopen = () => {
      console.log('Data channel opened');
      setIsConnected(true);
    };
    
    channel.onclose = () => {
      console.log('Data channel closed');
      setIsConnected(false);
    };
    
    channel.onerror = (error) => {
      console.error('Data channel error:', error);
    };
    
    channel.onmessage = (e) => {
      try {
        const message = JSON.parse(e.data) as GameMessage;
        console.log('Received message:', message);
        // Mesaj işleme
        if (message.type === 'playerUpdate') {
          setRemotePlayer(message.data);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
    
    setDataChannel(channel);
  };

  const createDataChannel = () => {
    if (!peerConnection) {
      console.error('Peer connection not initialized');
      return;
    }
    
    try {
      const channel = peerConnection.createDataChannel('game');
      setupDataChannel(channel);
    } catch (error) {
      console.error('Error creating data channel:', error);
    }
  };

  const sendMessage = (message: GameMessage) => {
    if (dataChannel?.readyState === 'open') {
      try {
        dataChannel.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      console.warn('Data channel not open, message not sent');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (dataChannel) {
        dataChannel.close();
      }
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [dataChannel, peerConnection]);

  return {
    peerConnection,
    dataChannel,
    isConnected,
    remotePlayer,
    initPeerConnection,
    createDataChannel,
    sendMessage
  };
}; 
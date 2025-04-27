import React, { useEffect, useState } from 'react';
import { usePeerConnection } from '../hooks/usePeerConnection';
import { signalingServer } from '../services/signalingServer';
import { useWallet } from '@mysten/wallet-adapter-react';

interface MultiplayerConnectionProps {
  onConnectionEstablished: () => void;
}

export const MultiplayerConnection: React.FC<MultiplayerConnectionProps> = ({ onConnectionEstablished }) => {
  const { connected, account } = useWallet();
  const [isHost, setIsHost] = useState(false);
  const [roomId, setRoomId] = useState<string>('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string>('');

  const {
    peerConnection,
    dataChannel,
    isConnected,
    initPeerConnection,
    createDataChannel,
    sendMessage
  } = usePeerConnection();

  useEffect(() => {
    initPeerConnection();
    createDataChannel();

    // Set up signaling server event listeners
    signalingServer.onOffer(async (offer) => {
      if (!peerConnection) return;
      
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        signalingServer.sendAnswer(answer);
      } catch (error) {
        console.error('Error handling offer:', error);
        setError('Failed to establish connection');
      }
    });

    signalingServer.onAnswer(async (answer) => {
      if (!peerConnection) return;
      
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error('Error handling answer:', error);
        setError('Failed to establish connection');
      }
    });

    signalingServer.onIceCandidate(async (candidate) => {
      if (!peerConnection) return;
      
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    });

    return () => {
      signalingServer.disconnect();
    };
  }, [peerConnection]);

  const handleConnect = () => {
    if (connected) {
      console.log('Kullanıcı adresi:', account?.address);
      // Multiplayer bağlantıyı wallet adresi ile kur
      onConnectionEstablished();
    } else {
      alert('Lütfen önce cüzdanınızı bağlayın');
    }
  };

  const createGame = async () => {
    try {
      setIsHost(true);
      const newRoomId = await signalingServer.createRoom();
      setRoomId(newRoomId);
      
      if (!peerConnection) return;
      
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      signalingServer.sendOffer(offer);
    } catch (error) {
      console.error('Error creating game:', error);
      setError('Failed to create game');
    }
  };

  const joinGame = async () => {
    if (!roomId) {
      setError('Please enter a room ID');
      return;
    }

    try {
      setIsJoining(true);
      await signalingServer.joinRoom(roomId);
    } catch (error) {
      console.error('Error joining game:', error);
      setError('Failed to join game');
      setIsJoining(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      onConnectionEstablished();
    }
  }, [isConnected, onConnectionEstablished]);

  return (
    <div className="multiplayer-connection">
      <h2>Multiplayer Connection</h2>
      
      {!connected && (
        <button onClick={handleConnect}>
          Önce Cüzdan Bağla
        </button>
      )}

      {connected && !isHost && !isJoining && (
        <div className="connection-options">
          <button onClick={createGame}>Create New Game</button>
          <div className="join-game">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button onClick={joinGame}>Join Game</button>
          </div>
        </div>
      )}

      {isHost && (
        <div className="host-info">
          <p>Room ID: {roomId}</p>
          <p>Share this ID with your friend to join the game</p>
        </div>
      )}

      {isJoining && (
        <div className="joining-status">
          <p>Joining game...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {isConnected && (
        <div className="connection-status">
          <p>Connected to other player!</p>
        </div>
      )}
    </div>
  );
}; 
import React, { useState } from 'react';
import { MultiplayerConnection } from './MultiplayerConnection';
import './MultiplayerConnection.css';

const Play: React.FC = () => {
  const [isMultiplayerConnected, setIsMultiplayerConnected] = useState(false);

  return (
    <div>
      <h1>Play Game</h1>
      {!isMultiplayerConnected && (
        <MultiplayerConnection
          onConnectionEstablished={() => setIsMultiplayerConnected(true)}
        />
      )}
      {/* Diğer oyun bileşenleri buraya eklenebilir */}
    </div>
  );
};

export default Play; 
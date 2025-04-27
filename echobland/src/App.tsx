import React, { useRef, useState } from 'react';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import { MultiplayerConnection } from './components/MultiplayerConnection';
import './components/MultiplayerConnection.css';
import { WalletStandardAdapterProvider } from '@mysten/wallet-adapter-all-wallets';
import { WalletProvider } from '@mysten/wallet-adapter-react';

const AppWrapper: React.FC = () => {
  return (
    <WalletProvider adapters={[new WalletStandardAdapterProvider()]}>
      <App />
    </WalletProvider>
  );
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMultiplayerConnected, setIsMultiplayerConnected] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="app">
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Home audioRef={audioRef} />
      )}
    </div>
  );
};

export default AppWrapper;
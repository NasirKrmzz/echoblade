import React, { useState, useEffect } from 'react';
import { useWallet } from '@mysten/wallet-adapter-react';
import './WalletConnection.css';

const WalletConnection: React.FC = () => {
    const { connected, wallet, disconnect, select, wallets } = useWallet();
    const [showWalletSelector, setShowWalletSelector] = useState(false);

    useEffect(() => {
        setShowWalletSelector(false);
    }, [connected]);

    return (
        <div className="wallet-connection">
            {!connected ? (
                <>
                    <button
                        className="connect-button"
                        onClick={() => setShowWalletSelector(!showWalletSelector)}
                    >
                        Cüzdan Bağla
                    </button>
                    
                    {showWalletSelector && (
                        <div className="wallet-selector">
                            {wallets.map((wallet) => (
                                <button
                                    key={wallet.name}
                                    className="wallet-option"
                                    onClick={() => {
                                        select(wallet.name);
                                        setShowWalletSelector(false);
                                    }}
                                >
                                    <img 
                                        src={wallet.icon} 
                                        alt={wallet.name} 
                                        className="wallet-icon"
                                    />
                                    {wallet.name}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="wallet-info">
                    <span className="wallet-name">{wallet?.name}</span>
                    <button
                        className="disconnect-button"
                        onClick={disconnect}
                    >
                        Çıkış
                    </button>
                </div>
            )}
        </div>
    );
};

export default WalletConnection; 
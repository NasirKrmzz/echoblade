import React, { useState, useEffect } from 'react';
import './Login.css';
import { useWallet } from '@mysten/wallet-adapter-react';

interface LoginProps {
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // Register state
    const [regUsername, setRegUsername] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regError, setRegError] = useState('');
    // Wallet state
    const { connected, wallet, select, disconnect, wallets } = useWallet();
    const [showWalletModal, setShowWalletModal] = useState(false);

    useEffect(() => {
        if (connected && wallet) {
            onLoginSuccess();
        }
    }, [connected, wallet]);

    const handleWalletConnect = async (selectedWallet: any) => {
        try {
            setError('');
            await select(selectedWallet.name);
            setShowWalletModal(false);
        } catch (error: any) {
            console.error('Bağlantı hatası:', error);
            setError(error.message || 'Cüzdan bağlantısı başarısız oldu');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if ((username && password) || connected) {
            onLoginSuccess();
        } else {
            setError('Lütfen tüm alanları doldurun veya cüzdanınızı bağlayın');
        }
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (!regUsername || !regEmail || !regPassword) {
            setRegError('All fields are required!');
            return;
        }
        setRegError('');
        alert('Registration successful! (Database connection will be added later)');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1 className="game-title">Echobland</h1>
                <p className="subtitle">Kart Savaşlarına Hoş Geldiniz</p>

                {/* Wallet Bağlantı Bölümü */}
                <div className="wallet-section">
                    {!connected ? (
                        <button 
                            onClick={() => setShowWalletModal(true)}
                            className="wallet-connect-btn"
                        >
                            <img src="/wallet-icon.svg" alt="Wallet" className="wallet-icon" />
                            Cüzdanla Bağlan
                        </button>
                    ) : (
                        <div className="wallet-connected">
                            <span>{wallet?.name} bağlı</span>
                            <button onClick={disconnect} className="disconnect-btn">
                                Bağlantıyı Kes
                            </button>
                        </div>
                    )}
                    {error && <div className="error-message">{error}</div>}
                </div>

                <div className="divider">
                    <span>veya</span>
                </div>

                <div className="tab-buttons">
                    <button
                        className={isLogin ? 'active' : ''}
                        onClick={() => setIsLogin(true)}
                    >
                        Giriş Yap
                    </button>
                    <button
                        className={!isLogin ? 'active' : ''}
                        onClick={() => setIsLogin(false)}
                    >
                        Kayıt Ol
                    </button>
                </div>

                {isLogin ? (
                    <>
                        <form className="login-form" onSubmit={handleSubmit}>
                            {error && <div className="error-message">{error}</div>}
                            <input
                                type="text"
                                placeholder="Kullanıcı Adı"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={connected}
                            />
                            <input
                                type="password"
                                placeholder="Şifre"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={connected}
                            />
                            <button type="submit" className={connected ? 'connected' : ''}>
                                {connected ? 'Giriş Yapıldı' : 'Giriş Yap'}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <form className="login-form" onSubmit={handleRegister}>
                            <input
                                type="text"
                                placeholder="Username"
                                value={regUsername}
                                onChange={e => setRegUsername(e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={regEmail}
                                onChange={e => setRegEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={regPassword}
                                onChange={e => setRegPassword(e.target.value)}
                            />
                            {regError && <div className="error-message">{regError}</div>}
                            <button type="submit">Sign Up</button>
                        </form>
                    </>
                )}

                {/* Wallet Seçim Modalı */}
                {showWalletModal && (
                    <div className="wallet-modal">
                        <div className="wallet-modal-content">
                            <h3>Cüzdan Seçin</h3>
                            <button 
                                onClick={() => setShowWalletModal(false)}
                                className="close-modal"
                            >
                                ×
                            </button>
                            <div className="wallet-list">
                                {wallets.map((wallet) => (
                                    <button
                                        key={wallet.name}
                                        onClick={() => handleWalletConnect(wallet)}
                                        className="wallet-option"
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
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
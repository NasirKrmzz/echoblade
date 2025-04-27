import React, { useState, useEffect, ReactNode } from 'react';
import Cards from './Cards';
import Settings from './Settings';
import Fusion from './Fusion';
import Profile from './Profile';
import CardGame from './CardGame';
import WalletConnection from './WalletConnection';
import './Home.css';

const menuItems = [
    { key: 'profile', label: 'Profile' },
    { key: 'play', label: 'Play' },
    { key: 'cards', label: 'Cards' },
    { key: 'fusion', label: 'Fusion' },
    { key: 'settings', label: 'Settings' },
];

interface HomeProps {
    audioRef: React.RefObject<HTMLAudioElement | null>;
    children?: ReactNode;
}

const Home: React.FC<HomeProps> = ({ audioRef, children }) => {
    const [active, setActive] = useState('cards');
    const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
        }
    }, [audioRef]);

    const handleProfilePictureChange = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setProfileImage(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const renderContent = () => {
        switch (active) {
            case 'cards':
                return <Cards />;
            case 'profile':
                return (
                    <Profile 
                        initialUsername="JohnDoe"
                        initialProfileImage={profileImage}
                        tokenBalance={1234}
                        stats={{ 
                            totalGames: Math.floor(Math.random() * 100) + 50, // Random number between 50-150
                            gamesWon: Math.floor(Math.random() * 80) + 20,   // Random number between 20-100
                            gamesLost: Math.floor(Math.random() * 40) + 10   // Random number between 10-50
                        }}
                        onUsernameChange={() => {}}
                        onProfilePictureChange={handleProfilePictureChange}
                    />
                );
            case 'play':
                return <CardGame />;
            case 'fusion':
                return <Fusion />;
            case 'settings':
                return <Settings audioRef={audioRef} />;
            default:
                return null;
        }
    };

    return (
        <div className="home-container">
            <audio ref={audioRef} src="/music/background-music.mp3" loop />
            
            <WalletConnection />

            {/* Left Sidebar */}
            <div className="sidebar">
                <div className="logo-container">
                    <img 
                        src={profileImage}
                        alt="Profile"
                        className="logo"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                        }}
                    />
                </div>
                <div className="menu-items">
                    {menuItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActive(item.key)}
                            className={`menu-item ${active === item.key ? 'active' : ''}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="content-container">
                    {renderContent()}
                </div>
                {children}
            </div>
        </div>
    );
};

export default React.memo(Home);
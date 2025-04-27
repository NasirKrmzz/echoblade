import React, { useState, useCallback, ChangeEvent } from 'react';
import './Profile.css';

interface UserStats {
    totalGames: number;
    gamesWon: number;
    gamesLost: number;
}

interface ProfileProps {
    initialUsername?: string;
    initialProfileImage?: string;
    tokenBalance: number;
    stats: UserStats;
    onUsernameChange: (newUsername: string) => void;
    onProfilePictureChange: (file: File) => void;
}

const Profile: React.FC<ProfileProps> = ({
    initialUsername = 'JohnDoe',
    initialProfileImage = 'C:/Users/hp/Desktop/Echobland/Echobland/echobland/src/components/resimler/logo.png',
    tokenBalance,
    stats,
    onUsernameChange,
    onProfilePictureChange
}) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [username, setUsername] = useState<string>(initialUsername);
    const [profileImage, setProfileImage] = useState<string>(initialProfileImage);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const winRate = stats.totalGames > 0 
        ? ((stats.gamesWon / stats.totalGames) * 100).toFixed(1) 
        : '0.0';

    const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('Dosya boyutu çok büyük. Lütfen 5MB\'dan küçük bir dosya seçin.');
                return;
            }

            if (!file.type.startsWith('image/')) {
                setError('Lütfen geçerli bir resim dosyası seçin.');
                return;
            }

            setIsLoading(true);
            setError(null);

            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setProfileImage(reader.result);
                }
                setIsLoading(false);
            };
            reader.onerror = () => {
                setError('Dosya okuma hatası oluştu.');
                setIsLoading(false);
            };
            reader.readAsDataURL(file);
            onProfilePictureChange(file);
        }
    }, [onProfilePictureChange]);

    const handleUsernameSave = useCallback(() => {
        if (username.trim().length < 3) {
            setError('Kullanıcı adı en az 3 karakter olmalıdır.');
            return;
        }

        setIsEditing(false);
        setError(null);
        onUsernameChange(username);
    }, [username, onUsernameChange]);

    return (
        <div className="profile-container">
            {error && (
                <div className="error-message" style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: '#ff4d4f',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000
                }}>
                    {error}
                </div>
            )}

            <div className="profile-header">
                <div className="profile-image-container">
                    <input
                        type="file"
                        id="profile-image-input"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="profile-image-input">
                        <img
                            src={profileImage}
                            alt="Profile"
                            className={`profile-image ${isLoading ? 'loading' : ''}`}
                        />
                        <div className="image-overlay">
                            <span>Fotoğrafı Değiştir</span>
                        </div>
                    </label>
                    {isLoading && (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                        </div>
                    )}
                </div>

                <div className="profile-info">
                    {!isEditing ? (
                        <div className="username-display">
                            <h2>{username}</h2>
                            <button
                                className="edit-button"
                                onClick={() => setIsEditing(true)}
                                aria-label="Kullanıcı adını düzenle"
                            >
                                ✏️
                            </button>
                        </div>
                    ) : (
                        <div className="username-edit">
                            <input
                                type="text"
                                className="username-input"
                                value={username}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                placeholder="Kullanıcı adınızı girin"
                                maxLength={30}
                            />
                            <button
                                className="save-button"
                                onClick={handleUsernameSave}
                            >
                                Kaydet
                            </button>
                        </div>
                    )}

                    <div className="token-balance">
                        <span className="token-icon">💰</span>
                        <span>{tokenBalance.toLocaleString()} Token</span>
                    </div>
                </div>
            </div>

            <div className="stats-container">
                <h3>Statistics</h3>
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="stat-label">Total Games</span>
                        <span className="stat-value">{stats.totalGames}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Games Won</span>
                        <span className="stat-value">{stats.gamesWon}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Games Lost</span>
                        <span className="stat-value">{stats.gamesLost}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Win Rate</span>
                        <span className="stat-value">{winRate}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
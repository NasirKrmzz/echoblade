import React, { useState, useRef, useEffect } from 'react';

interface AudioSettings {
    masterVolume: number;
    musicVolume: number;
    effectsVolume: number;
}

interface SettingsProps {
    audioRef: React.RefObject<HTMLAudioElement | null>;
}

const Settings: React.FC<SettingsProps> = ({ audioRef }) => {
    const [activeTab, setActiveTab] = useState<'audio' | 'help' | 'faq' | 'report'>('audio');
    const [audioSettings, setAudioSettings] = useState<AudioSettings>({
        masterVolume: 0.5,
        musicVolume: 0.5,
        effectsVolume: 0.5
    });

    const [isMusicPlaying, setIsMusicPlaying] = useState(true);

    const faqData = [
        {
            question: "Oyun nasıl oynanır?",
            answer: "Kartları topla, desteni oluştur ve rakiplerinle mücadele et! Her kartın kendine özgü özellikleri vardır.",
            icon: "🎮"
        },
        {
            question: "Yeni kartları nasıl açabilirim?",
            answer: "Görevleri tamamlayarak, seviye atlayarak ve özel etkinliklere katılarak yeni kartlar kazanabilirsin.",
            icon: "🎁"
        },
        {
            question: "Kartların nadirlikleri ne anlama geliyor?",
            answer: "Kartlar Common, Rare, Epic, Legendary ve Mythic olmak üzere 5 nadirlik seviyesine sahiptir. Nadirlik arttıkça kartın gücü de artar.",
            icon: "⭐"
        },
        {
            question: "Oyunda nasıl para kazanılır?",
            answer: "Günlük görevleri tamamlayarak, turnuvalara katılarak ve arkadaşlarınla düellolar yaparak para kazanabilirsin.",
            icon: "💰"
        }
    ];

    const handleVolumeChange = (type: keyof AudioSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        setAudioSettings(prev => ({
            ...prev,
            [type]: newValue
        }));

        if (type === 'musicVolume' && audioRef.current) {
            audioRef.current.volume = newValue;
        }
    };

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isMusicPlaying) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current.muted = true;
            } else {
                audioRef.current.muted = false;
                audioRef.current.play().catch(error => {
                    console.error('Müzik başlatılamadı:', error);
                });
            }
            setIsMusicPlaying(!isMusicPlaying);
        }
    };

    const [reportIssue, setReportIssue] = useState({
        title: '',
        description: '',
    });

    const TabIcon = ({ tab }: { tab: string }) => {
        const icons: Record<string, string> = {
            audio: '🎵',
            help: '❓',
            faq: '📚',
            report: '🐛'
        };
        return <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>{icons[tab]}</span>;
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f3f6f8 0%, #e5edf5 100%)',
            padding: '48px 0'
        }}>
            <div style={{
                width: '90%',
                maxWidth: 1200,
                margin: '0 auto',
                background: '#fff',
                borderRadius: 30,
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                position: 'relative'
            }}>
                {/* Dekoratif Arka Plan Elementleri */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle at top right, rgba(37, 99, 235, 0.05) 0%, transparent 70%)',
                    zIndex: 1
                }} />

                {/* Başlık */}
                <div style={{
                    padding: '32px 40px',
                    borderBottom: '1px solid #e2e8f0',
                    background: '#fff',
                    position: 'relative',
                    zIndex: 2
                }}>
                    <h2 style={{
                        fontSize: '2.4rem',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #1a202c 0%, #2563eb 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: 0
                    }}>Ayarlar</h2>
                </div>

                {/* Tab Menüsü */}
                <div style={{
                    display: 'flex',
                    padding: '0 40px',
                    borderBottom: '1px solid #e2e8f0',
                    background: '#fff',
                    position: 'relative',
                    zIndex: 2
                }}>
                    {['audio', 'help', 'faq', 'report'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            style={{
                                padding: '20px 32px',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                fontWeight: activeTab === tab ? 700 : 500,
                                color: activeTab === tab ? '#2563eb' : '#64748b',
                                borderBottom: activeTab === tab ? '3px solid #2563eb' : '3px solid transparent',
                                transition: 'all 0.3s',
                                display: 'flex',
                                alignItems: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => {
                                if (activeTab !== tab) {
                                    e.currentTarget.style.color = '#2563eb';
                                    e.currentTarget.style.background = '#f8fafc';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeTab !== tab) {
                                    e.currentTarget.style.color = '#64748b';
                                    e.currentTarget.style.background = 'none';
                                }
                            }}
                        >
                            <TabIcon tab={tab} />
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* İçerik Alanı */}
                <div style={{ padding: '40px', position: 'relative', zIndex: 2 }}>
                    {/* Ses Ayarları */}
                    {activeTab === 'audio' && (
                        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                            <h3 style={{
                                fontSize: '1.8rem',
                                marginBottom: '32px',
                                color: '#1a202c',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <span style={{ fontSize: '2rem' }}>🎵</span>
                                Ses Ayarları
                            </h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '32px',
                                background: '#f8fafc',
                                padding: '32px',
                                borderRadius: '20px',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    background: '#fff',
                                    padding: '24px',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <label style={{ color: '#4a5568' }}>Müzik</label>
                                        <button 
                                            onClick={toggleMusic}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                fontSize: '1.2rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {isMusicPlaying ? '⏸️' : '▶️'}
                                        </button>
                                    </div>
                                    <div style={{ width: '80%', margin: '0 auto' }}>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={audioSettings.musicVolume}
                                            onChange={handleVolumeChange('musicVolume')}
                                            style={{ width: '100%', height: '8px', borderRadius: '4px', background: '#e2e8f0', outline: 'none' }}
                                        />
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    background: '#fff',
                                    padding: '24px',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568' }}>
                                        Efekt Sesleri
                                    </label>
                                    <div style={{ width: '80%', margin: '0 auto' }}>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={audioSettings.effectsVolume}
                                            onChange={handleVolumeChange('effectsVolume')}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    background: '#fff',
                                    padding: '24px',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568' }}>
                                        Ana Ses
                                    </label>
                                    <div style={{ width: '80%', margin: '0 auto' }}>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={audioSettings.masterVolume}
                                            onChange={handleVolumeChange('masterVolume')}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Yardım */}
                    {activeTab === 'help' && (
                        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                            <h3 style={{
                                fontSize: '1.8rem',
                                marginBottom: '32px',
                                color: '#1a202c',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <span style={{ fontSize: '2rem' }}>❓</span>
                                Yardım
                            </h3>
                            <div style={{
                                background: '#f8fafc',
                                padding: '32px',
                                borderRadius: '20px',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                    gap: '24px'
                                }}>
                                    <div style={{
                                        background: '#fff',
                                        padding: '24px',
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                    }}>
                                        <h4 style={{
                                            fontSize: '1.2rem',
                                            color: '#1a202c',
                                            marginBottom: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <span>📖</span>
                                            Kullanım Kılavuzu
                                        </h4>
                                        <p style={{ fontSize: '1rem', color: '#4a5568', lineHeight: 1.6, marginBottom: '16px' }}>
                                            Oyun hakkında detaylı bilgi için kullanım kılavuzumuzu inceleyebilirsiniz.
                                        </p>
                                        <a
                                            href="#"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                color: '#2563eb',
                                                textDecoration: 'none',
                                                fontWeight: 600,
                                                fontSize: '1rem'
                                            }}
                                        >
                                            Kılavuzu Aç
                                            <span>→</span>
                                        </a>
                                    </div>
                                    <div style={{
                                        background: '#fff',
                                        padding: '24px',
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                    }}>
                                        <h4 style={{
                                            fontSize: '1.2rem',
                                            color: '#1a202c',
                                            marginBottom: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <span>📧</span>
                                            Teknik Destek
                                        </h4>
                                        <p style={{ fontSize: '1rem', color: '#4a5568', lineHeight: 1.6, marginBottom: '16px' }}>
                                            Teknik sorunlar için destek ekibimizle iletişime geçebilirsiniz.
                                        </p>
                                        <a
                                            href="mailto:support@echobland.com"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                color: '#2563eb',
                                                textDecoration: 'none',
                                                fontWeight: 600,
                                                fontSize: '1rem'
                                            }}
                                        >
                                            E-posta Gönder
                                            <span>→</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SSS */}
                    {activeTab === 'faq' && (
                        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                            <h3 style={{
                                fontSize: '1.8rem',
                                marginBottom: '32px',
                                color: '#1a202c',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <span style={{ fontSize: '2rem' }}>📚</span>
                                Sıkça Sorulan Sorular
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {faqData.map((faq, index) => (
                                    <div key={index} style={{
                                        background: '#fff',
                                        padding: '24px',
                                        borderRadius: '20px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        cursor: 'pointer'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                                        }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '16px'
                                        }}>
                                            <span style={{
                                                fontSize: '2rem',
                                                lineHeight: 1
                                            }}>{faq.icon}</span>
                                            <div>
                                                <h4 style={{
                                                    fontSize: '1.2rem',
                                                    color: '#1a202c',
                                                    marginBottom: '12px',
                                                    fontWeight: 600
                                                }}>{faq.question}</h4>
                                                <p style={{
                                                    fontSize: '1rem',
                                                    color: '#4a5568',
                                                    lineHeight: 1.6,
                                                    margin: 0
                                                }}>{faq.answer}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sorun Bildirme */}
                    {activeTab === 'report' && (
                        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                            <h3 style={{
                                fontSize: '1.8rem',
                                marginBottom: '32px',
                                color: '#1a202c',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <span style={{ fontSize: '2rem' }}>🐛</span>
                                Sorun Bildir
                            </h3>
                            <div style={{
                                background: '#f8fafc',
                                padding: '32px',
                                borderRadius: '20px',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <div style={{
                                        background: '#fff',
                                        padding: '24px',
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                    }}>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '12px',
                                            color: '#1a202c',
                                            fontSize: '1.1rem',
                                            fontWeight: 600
                                        }}>
                                            Sorun Başlığı
                                        </label>
                                        <input
                                            type="text"
                                            value={reportIssue.title}
                                            onChange={(e) => setReportIssue(prev => ({ ...prev, title: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '2px solid #e2e8f0',
                                                borderRadius: '12px',
                                                fontSize: '1rem',
                                                transition: 'border-color 0.2s',
                                                outline: 'none'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                            placeholder="Sorununuzu kısaca özetleyin"
                                        />
                                    </div>
                                    <div style={{
                                        background: '#fff',
                                        padding: '24px',
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                    }}>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '12px',
                                            color: '#1a202c',
                                            fontSize: '1.1rem',
                                            fontWeight: 600
                                        }}>
                                            Sorun Detayı
                                        </label>
                                        <textarea
                                            value={reportIssue.description}
                                            onChange={(e) => setReportIssue(prev => ({ ...prev, description: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '2px solid #e2e8f0',
                                                borderRadius: '12px',
                                                fontSize: '1rem',
                                                minHeight: '150px',
                                                resize: 'vertical',
                                                transition: 'border-color 0.2s',
                                                outline: 'none'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                            placeholder="Sorununuzu detaylı bir şekilde açıklayın"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        style={{
                                            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '16px 32px',
                                            borderRadius: '12px',
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            alignSelf: 'flex-start',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <span>📤</span>
                                        Gönder
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
        </div>
    );
};

export default Settings; 
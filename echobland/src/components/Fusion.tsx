import React, { useState } from 'react';

interface Card {
    id: number;
    name: string;
    desc: string;
    img: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
    level: number;
}

// Örnek birleştirme kombinasyonları
const fusionCombinations: Record<string, Card> = {
    'Fire Sprite + Water Sprite': {
        id: 101,
        name: 'Steam Spirit',
        desc: 'A powerful steam elemental born from fire and water.',
        img: '',
        rarity: 'Epic',
        level: 3
    },
    'Earth Golem + Wind Falcon': {
        id: 102,
        name: 'Sand Storm Giant',
        desc: 'A massive creature that controls both earth and wind.',
        img: '',
        rarity: 'Legendary',
        level: 4
    },
    'Thunder Wolf + Shadow Assassin': {
        id: 103,
        name: 'Storm Shadow',
        desc: 'A lightning-fast assassin that strikes from the darkness.',
        img: '',
        rarity: 'Mythic',
        level: 5
    }
};

// Mevcut kartlar (örnek veri)
const availableCards: Card[] = [
    { id: 1, name: 'Fire Sprite', desc: 'A basic fire card.', img: '', rarity: 'Common', level: 1 },
    { id: 2, name: 'Water Sprite', desc: 'A basic water card.', img: '', rarity: 'Common', level: 1 },
    { id: 3, name: 'Earth Golem', desc: 'A sturdy earth card.', img: '', rarity: 'Rare', level: 2 },
    { id: 4, name: 'Wind Falcon', desc: 'A swift wind card.', img: '', rarity: 'Epic', level: 3 },
    { id: 5, name: 'Thunder Wolf', desc: 'A shocking thunder card.', img: '', rarity: 'Epic', level: 3 },
    { id: 6, name: 'Shadow Assassin', desc: 'A sneaky shadow card.', img: '', rarity: 'Legendary', level: 4 },
];

// Kart görsellerinin dosya adları (public/kartlar/levelX klasörlerinden)
const cardImagesByLevel = [
    { level: 1, images: ['1.png', '6.png', '11.png', '16.png', '21.png', '26.png', '31.png', '36.png', '41.png', '46.png', '51.png', '56.png', '61.png', '66.png'] },
    { level: 2, images: ['2.png', '7.png', '12.png', '17.png', '22.png', '27.png', '32.png', '37.png', '42.png', '47.png', '52.png', '57.png', '62.png', '67.png'] },
    { level: 3, images: ['3.png', '8.png', '13.png', '18.png', '23.png', '28.png', '33.png', '38.png', '43.png', '48.png', '53.png', '58.png', '63.png', '68.png'] },
    { level: 4, images: ['4.png', '9.png', '14.png', '19.png', '24.png', '29.png', '34.png', '39.png', '44.png', '49.png', '54.png', '59.png', '64.png', '69.png'] },
    { level: 5, images: ['5.png', '10.png', '15.png', '20.png', '25.png', '30.png', '35.png', '40.png', '45.png', '50.png', '55.png', '60.png', '65.png', '70.png'] },
];

const allCards = cardImagesByLevel.flatMap((levelObj, idx) =>
  levelObj.images.map((imgName, imgIdx) => ({
    id: idx * 100 + imgIdx + 1,
    name: `Card ${imgName.replace('.png', '')}`,
    desc: '',
    img: `/kartlar/level${levelObj.level}/${imgName}`,
    rarity: (availableCards.find(c => c.level === levelObj.level)?.rarity ?? 'Common') as Card['rarity'],
    level: levelObj.level
  }))
);

const getRarityColor = (rarity: string) => {
    const colors = {
        'Common': '#78909C',
        'Rare': '#2196F3',
        'Epic': '#9C27B0',
        'Legendary': '#FF9800',
        'Mythic': '#FFD700',
    };
    return colors[rarity as keyof typeof colors];
};

// Rarity sıralaması
const rarityOrder: Card['rarity'][] = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];

const Fusion: React.FC = () => {
    const [selectedCards, setSelectedCards] = useState<Card[]>([]);
    const [fusionResult, setFusionResult] = useState<Card | null>(null);
    const [showAnimation, setShowAnimation] = useState(false);

    const handleCardSelect = (card: Card) => {
        if (selectedCards.includes(card)) {
            setSelectedCards(selectedCards.filter(c => c.id !== card.id));
        } else if (selectedCards.length < 2) {
            setSelectedCards([...selectedCards, card]);
        }
    };

    const handleFusion = () => {
        if (selectedCards.length !== 2) return;

        // Aynı seviyedeki kartları kontrol et
        if (selectedCards[0].level === selectedCards[1].level) {
            const combination = `${selectedCards[0].name} + ${selectedCards[1].name}`;
            const result = fusionCombinations[combination];

            if (result) {
                setShowAnimation(true);
                setTimeout(() => {
                    setFusionResult(result);
                    setTimeout(() => {
                        setShowAnimation(false);
                    }, 500);
                }, 1500);
            } else {
                // İki kartın rarity'sinden bir üst rarity bul
                const maxRarityIndex = Math.max(
                    rarityOrder.indexOf(selectedCards[0].rarity),
                    rarityOrder.indexOf(selectedCards[1].rarity)
                );
                const nextRarity = rarityOrder[Math.min(maxRarityIndex + 1, rarityOrder.length - 1)];
                // Eğer özel bir kombinasyon yoksa, bir üst seviye ve bir üst rarity kart oluştur
                const newCard: Card = {
                    id: Date.now(), // Benzersiz ID
                    name: `${selectedCards[0].name} + ${selectedCards[1].name}`,
                    desc: `A powerful fusion of ${selectedCards[0].name} and ${selectedCards[1].name}`,
                    img: '',
                    rarity: nextRarity,
                    level: selectedCards[0].level + 1
                };
                setShowAnimation(true);
                setTimeout(() => {
                    setFusionResult(newCard);
                    setTimeout(() => {
                        setShowAnimation(false);
                    }, 500);
                }, 1500);
            }
        } else {
            alert('Sadece aynı seviyedeki kartlar birleştirilebilir!');
        }
    };

    const resetFusion = () => {
        setSelectedCards([]);
        setFusionResult(null);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
            padding: '48px 0',
            color: '#fff'
        }}>
            <div style={{
                width: '90%',
                maxWidth: 1400,
                margin: '0 auto'
            }}>
                <h2 style={{
                    fontSize: '2.4rem',
                    fontWeight: 800,
                    marginBottom: 40,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #fff 0%, #e2e8f0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Kart Birleştirme
                </h2>

                {/* Birleştirme Alanı */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '32px',
                    marginBottom: '48px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px'
                    }}>
                        {/* İlk Kart Yuvası */}
                        <div style={{
                            width: 220,
                            height: 300,
                            background: selectedCards[0] ? 'transparent' : 'rgba(255,255,255,0.1)',
                            borderRadius: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px dashed rgba(255,255,255,0.2)'
                        }}>
                            {selectedCards[0] && (
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    background: '#fff',
                                    borderRadius: 20,
                                    padding: 24,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    position: 'relative',
                                    animation: showAnimation ? 'pulseAndFloat 1.5s infinite' : 'none'
                                }}>
                                    <div style={{
                                        width: 140,
                                        height: 180,
                                        background: 'linear-gradient(135deg, #e2e8f0, #cbd5e0)',
                                        borderRadius: 16,
                                        marginBottom: 16,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                    }}>
                                        <img src={selectedCards[0].img} alt={selectedCards[0].name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12, background: '#e5e7eb' }} />
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        background: getRarityColor(selectedCards[0].rarity),
                                        color: '#fff',
                                        padding: '4px 8px',
                                        borderRadius: 6,
                                        fontSize: '0.8rem',
                                        fontWeight: 600
                                    }}>
                                        {selectedCards[0].rarity}
                                    </div>
                                    <div style={{
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        marginBottom: 8,
                                        color: '#1a202c',
                                        textAlign: 'center'
                                    }}>
                                        {selectedCards[0].name}
                                    </div>
                                    <div style={{
                                        color: '#4a5568',
                                        fontSize: '0.9rem',
                                        textAlign: 'center'
                                    }}>
                                        {selectedCards[0].desc}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Artı İşareti */}
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: 700,
                            color: 'rgba(255,255,255,0.8)'
                        }}>
                            +
                        </div>

                        {/* İkinci Kart Yuvası */}
                        <div style={{
                            width: 220,
                            height: 300,
                            background: selectedCards[1] ? 'transparent' : 'rgba(255,255,255,0.1)',
                            borderRadius: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px dashed rgba(255,255,255,0.2)'
                        }}>
                            {selectedCards[1] && (
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    background: '#fff',
                                    borderRadius: 20,
                                    padding: 24,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    position: 'relative',
                                    animation: showAnimation ? 'pulseAndFloat 1.5s infinite' : 'none'
                                }}>
                                    <div style={{
                                        width: 140,
                                        height: 180,
                                        background: 'linear-gradient(135deg, #e2e8f0, #cbd5e0)',
                                        borderRadius: 16,
                                        marginBottom: 16,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                    }}>
                                        <img src={selectedCards[1].img} alt={selectedCards[1].name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12, background: '#e5e7eb' }} />
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        background: getRarityColor(selectedCards[1].rarity),
                                        color: '#fff',
                                        padding: '4px 8px',
                                        borderRadius: 6,
                                        fontSize: '0.8rem',
                                        fontWeight: 600
                                    }}>
                                        {selectedCards[1].rarity}
                                    </div>
                                    <div style={{
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        marginBottom: 8,
                                        color: '#1a202c',
                                        textAlign: 'center'
                                    }}>
                                        {selectedCards[1].name}
                                    </div>
                                    <div style={{
                                        color: '#4a5568',
                                        fontSize: '0.9rem',
                                        textAlign: 'center'
                                    }}>
                                        {selectedCards[1].desc}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Birleştirme Butonu */}
                    <button
                        onClick={handleFusion}
                        disabled={selectedCards.length !== 2}
                        style={{
                            background: selectedCards.length === 2
                                ? 'linear-gradient(135deg, #4299e1 0%, #2b6cb0 100%)'
                                : 'rgba(255,255,255,0.1)',
                            color: '#fff',
                            border: 'none',
                            padding: '16px 48px',
                            borderRadius: 12,
                            fontSize: '1.2rem',
                            fontWeight: 600,
                            cursor: selectedCards.length === 2 ? 'pointer' : 'not-allowed',
                            transition: 'all 0.3s',
                            transform: 'scale(1)',
                            boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                            if (selectedCards.length === 2) {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(66, 153, 225, 0.5)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (selectedCards.length === 2) {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(66, 153, 225, 0.3)';
                            }
                        }}
                    >
                        Birleştir
                    </button>

                    {/* Sonuç Kartı */}
                    {fusionResult && (
                        <div style={{
                            marginTop: '32px',
                            textAlign: 'center'
                        }}>
                            <h3 style={{
                                fontSize: '1.8rem',
                                marginBottom: '24px',
                                color: '#fff'
                            }}>
                                Yeni Kart!
                            </h3>
                            <div style={{
                                width: 260,
                                background: '#fff',
                                borderRadius: 20,
                                padding: 24,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                                animation: 'appearWithGlow 0.5s ease-out'
                            }}>
                                <div style={{
                                    width: 180,
                                    height: 180,
                                    background: 'linear-gradient(135deg, #e2e8f0, #cbd5e0)',
                                    borderRadius: 16,
                                    marginBottom: 16
                                }} />
                                <div style={{
                                    position: 'absolute',
                                    top: 12,
                                    right: 12,
                                    background: getRarityColor(fusionResult.rarity),
                                    color: '#fff',
                                    padding: '4px 12px',
                                    borderRadius: 8,
                                    fontSize: '0.9rem',
                                    fontWeight: 600
                                }}>
                                    {fusionResult.rarity}
                                </div>
                                <div style={{
                                    fontWeight: 700,
                                    fontSize: '1.3rem',
                                    marginBottom: 8,
                                    color: '#1a202c'
                                }}>
                                    {fusionResult.name}
                                </div>
                                <div style={{
                                    color: '#4a5568',
                                    fontSize: '1rem',
                                    textAlign: 'center',
                                    lineHeight: 1.4
                                }}>
                                    {fusionResult.desc}
                                </div>
                            </div>
                            <button
                                onClick={resetFusion}
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: 8,
                                    fontSize: '1rem',
                                    marginTop: '24px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                }}
                            >
                                Yeni Birleştirme
                            </button>
                        </div>
                    )}
                </div>

                {/* Mevcut Kartlar */}
                <div>
                    <h3 style={{
                        fontSize: '1.8rem',
                        marginBottom: '24px',
                        color: '#fff'
                    }}>
                        Kartlarınız
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '24px'
                    }}>
                        {allCards.map(card => (
                            <div
                                key={card.id}
                                onClick={() => handleCardSelect(card)}
                                style={{
                                    background: selectedCards.includes(card)
                                        ? 'linear-gradient(135deg, #4299e1 0%, #2b6cb0 100%)'
                                        : '#fff',
                                    borderRadius: 16,
                                    padding: 20,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    transform: 'scale(1)',
                                    position: 'relative',
                                    opacity: selectedCards.length === 2 && !selectedCards.includes(card) ? 0.5 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedCards.length < 2 || selectedCards.includes(card)) {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{
                                    width: '100%',
                                    aspectRatio: '3/4',
                                    background: 'linear-gradient(135deg, #e2e8f0, #cbd5e0)',
                                    borderRadius: 12,
                                    marginBottom: 12,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                }}>
                                    <img src={card.img} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12, background: '#e5e7eb' }} />
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    top: 12,
                                    right: 12,
                                    background: getRarityColor(card.rarity),
                                    color: '#fff',
                                    padding: '4px 8px',
                                    borderRadius: 6,
                                    fontSize: '0.8rem',
                                    fontWeight: 600
                                }}>
                                    {card.rarity}
                                </div>
                                <div style={{
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    marginBottom: 4,
                                    color: selectedCards.includes(card) ? '#fff' : '#1a202c'
                                }}>
                                    {card.name}
                                </div>
                                <div style={{
                                    fontSize: '0.9rem',
                                    color: selectedCards.includes(card) ? 'rgba(255,255,255,0.8)' : '#4a5568'
                                }}>
                                    {card.desc}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>
                {`
                    @keyframes pulseAndFloat {
                        0% { transform: translateY(0) scale(1); }
                        50% { transform: translateY(-10px) scale(1.05); }
                        100% { transform: translateY(0) scale(1); }
                    }

                    @keyframes appearWithGlow {
                        0% { 
                            opacity: 0;
                            transform: scale(0.8);
                            box-shadow: 0 0 0 rgba(66, 153, 225, 0);
                        }
                        100% { 
                            opacity: 1;
                            transform: scale(1);
                            box-shadow: 0 0 30px rgba(66, 153, 225, 0.3);
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Fusion; 
import React from 'react';

// Kart görsellerinin dosya adları (public/kartlar/levelX klasörlerinden)
const cardImagesByLevel = [
    {
        level: 1,
        images: [
            '1.png', '6.png', '11.png', '16.png', '21.png', '26.png', '31.png', '36.png', '41.png', '46.png', '51.png', '56.png', '61.png', '66.png'
        ]
    },
    {
        level: 2,
        images: [
            '2.png', '7.png', '12.png', '17.png', '22.png', '27.png', '32.png', '37.png', '42.png', '47.png', '52.png', '57.png', '62.png', '67.png'
        ]
    },
    {
        level: 3,
        images: [
            '3.png', '8.png', '13.png', '18.png', '23.png', '28.png', '33.png', '38.png', '43.png', '48.png', '53.png', '58.png', '63.png', '68.png'
        ]
    },
    {
        level: 4,
        images: [
            '4.png', '9.png', '14.png', '19.png', '24.png', '29.png', '34.png', '39.png', '44.png', '49.png', '54.png', '59.png', '64.png', '69.png'
        ]
    },
    {
        level: 5,
        images: [
            '5.png', '10.png', '15.png', '20.png', '25.png', '30.png', '35.png', '40.png', '45.png', '50.png', '55.png', '60.png', '65.png', '70.png'
        ]
    },
];

const getLevelColor = (level: number) => {
    const colors = {
        1: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
        2: 'linear-gradient(135deg, #2196F3, #03A9F4)',
        3: 'linear-gradient(135deg, #ff3c3c, #ff7b7b)',
        4: 'linear-gradient(135deg, #a259ff, #6a0572)',
        5: 'linear-gradient(135deg, #FFD700, #FFA500)',
    };
    return colors[level as keyof typeof colors];
};

const Cards: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', background: '#E0E0E0', padding: '48px 0' }}>
            <div style={{ width: '90%', maxWidth: 1400, margin: '0 auto' }}>
                <h2 style={{
                    fontSize: '2.4rem',
                    fontWeight: 800,
                    marginBottom: 40,
                    color: '#222',
                    textAlign: 'center',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                }}>
                    Card Collection
                </h2>
                {cardImagesByLevel.map(level => (
                    <div key={level.level} style={{ marginBottom: 64 }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: 24,
                            background: getLevelColor(level.level),
                            padding: '12px 24px',
                            borderRadius: 12,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: '#fff',
                                margin: 0,
                                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                            }}>
                                Level {level.level}
                            </h3>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '36px', justifyContent: 'flex-start' }}>
                            {level.images.map((imgName, idx) => (
                                <div
                                    key={imgName}
                                    style={{
                                        background: '#f0f1f3',
                                        borderRadius: 20,
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                        width: 220,
                                        padding: 16,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        transform: 'translateY(0)',
                                    }}
                                    onMouseEnter={e => {
                                        const target = e.currentTarget;
                                        target.style.transform = 'translateY(-8px)';
                                        target.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
                                    }}
                                    onMouseLeave={e => {
                                        const target = e.currentTarget;
                                        target.style.transform = 'translateY(0)';
                                        target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                                    }}
                                >
                                    <div style={{
                                        width: 180,
                                        height: 240,
                                        background: '#e5e7eb',
                                        borderRadius: 12,
                                        marginBottom: 12,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.74)'
                                    }}>
                                        <img src={`/kartlar/level${level.level}/${imgName}`} alt={`Card ${imgName}`} style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#e5e7eb', borderRadius: 12 }} />
                                    </div>
                                    <div style={{
                                        fontWeight: 700,
                                        fontSize: '1.2rem',
                                        marginBottom: 8,
                                        color: '#1a202c',
                                        textAlign: 'center',
                                    }}>
                                        Card {imgName.replace('.png', '')}
                                    </div>
                                    <div style={{
                                        color: '#4a5568',
                                        fontSize: '0.95rem',
                                        textAlign: 'center',
                                        lineHeight: 1.4
                                    }}>
                                        Level {level.level}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cards; 
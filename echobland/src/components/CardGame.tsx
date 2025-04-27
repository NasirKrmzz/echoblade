import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, BattleZone, BattleStats, GameState, Winner, SelectedCards, BattleStatsState } from '../types/types';
import './CardGame.css';

const zoneMultipliers = {
  [BattleZone.RED]: 0.8,
  [BattleZone.YELLOW]: 1.2,
  [BattleZone.GREEN]: 1.5
};

const cardImagesByLevel = [
    { level: 1, images: ['1.png', '6.png', '11.png', '16.png', '21.png', '26.png', '31.png', '36.png', '41.png', '46.png', '51.png', '56.png', '61.png', '66.png'] },
    { level: 2, images: ['2.png', '7.png', '12.png', '17.png', '22.png', '27.png', '32.png', '37.png', '42.png', '47.png', '52.png', '57.png', '62.png', '67.png'] },
    { level: 3, images: ['3.png', '8.png', '13.png', '18.png', '23.png', '28.png', '33.png', '38.png', '43.png', '48.png', '53.png', '58.png', '63.png', '68.png'] },
    { level: 4, images: ['4.png', '9.png', '14.png', '19.png', '24.png', '29.png', '34.png', '39.png', '44.png', '49.png', '54.png', '59.png', '64.png', '69.png'] },
    { level: 5, images: ['5.png', '10.png', '15.png', '20.png', '25.png', '30.png', '35.png', '40.png', '45.png', '50.png', '55.png', '60.png', '65.png', '70.png'] },
];

const allCards = cardImagesByLevel.flatMap(levelObj =>
  levelObj.images.map(imgName => ({
    id: `${levelObj.level}-${imgName}`,
    name: `Card ${imgName.replace('.png', '')}`,
    power: levelObj.level * 10,
    image: `/kartlar/level${levelObj.level}/${imgName}`,
    backImage: '/kartlar/back.png',
  }))
);

const getRandomCards = (count: number): Card[] => {
  const shuffled = [...allCards].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const CardGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.READY);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [computerHand, setComputerHand] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<SelectedCards>({ player: null, computer: null });
  const [battleStats, setBattleStats] = useState<BattleStatsState>({
    player: { power: 0, multiplier: 1, finalScore: 0 },
    computer: { power: 0, multiplier: 1, finalScore: 0 }
  });
  const [winner, setWinner] = useState<Winner>(null);
  const [pointerPosition, setPointerPosition] = useState(50);
  const [pointerDirection, setPointerDirection] = useState<'right' | 'left'>('right');
  const [isPointerMoving, setIsPointerMoving] = useState(false);
  const [selectedZone, setSelectedZone] = useState<BattleZone | null>(null);
  const battleSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Savaş sesini yükle
    battleSoundRef.current = new Audio('/sounds/battle.mp3');
    battleSoundRef.current.volume = 0.5;
  }, []);

  // Oyunu başlat
  const startGame = () => {
    const playerCards = getRandomCards(3);
    const computerCards = getRandomCards(3);
    setPlayerHand(playerCards);
    setComputerHand(computerCards);
    setGameState(GameState.CARD_SELECTION);
  };

  // Kart seçimi
  const selectCard = (card: Card) => {
    if (gameState !== GameState.CARD_SELECTION) return;

    // Bilgisayar rastgele kart seçer
    const computerCard = computerHand[Math.floor(Math.random() * computerHand.length)];
    
    setSelectedCards({
      player: card,
      computer: computerCard
    });
    
    // Kartı çevir
    const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
    if (cardElement) {
      cardElement.classList.add('selected');
    }
    
    // Savaş ekranına geç
    setTimeout(() => {
      setGameState(GameState.BATTLE);
      startBattle();
    }, 800); // Kart dönüş animasyonu için bekle
  };

  // Savaş mekaniğini başlat
  const startBattle = () => {
    setIsPointerMoving(true);
    setPointerPosition(50);
    setPointerDirection('right');
    setSelectedZone(null);

    // Savaş sesini çal
    if (battleSoundRef.current) {
      battleSoundRef.current.currentTime = 0;
      battleSoundRef.current.play().catch(error => {
        console.log("Ses çalınamadı:", error);
      });
    }
  };

  // Pointer animasyonu
  useEffect(() => {
    if (!isPointerMoving) return;

    const interval = setInterval(() => {
      setPointerPosition(prev => {
        const newPos = pointerDirection === 'right' ? prev + 2 : prev - 2;
        
        if (newPos >= 100) {
          setPointerDirection('left');
          return 100;
        }
        if (newPos <= 0) {
          setPointerDirection('right');
          return 0;
        }
        return newPos;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [isPointerMoving, pointerDirection]);

  // Bölge belirleme
  const getZone = (pos: number): BattleZone => {
    if (pos < 25) return BattleZone.RED;
    if (pos >= 25 && pos < 45) return BattleZone.YELLOW;
    if (pos >= 45 && pos <= 55) return BattleZone.GREEN;
    if (pos > 55 && pos <= 75) return BattleZone.YELLOW;
    return BattleZone.RED;
  };

  // Space tuşu ile durdurma
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isPointerMoving) {
        e.preventDefault();
        const zone = getZone(pointerPosition);
        setSelectedZone(zone);
        setIsPointerMoving(false);
        calculateBattle(zone);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPointerMoving, pointerPosition]);

  // Savaş sonucunu hesapla
  const calculateBattle = (zone: BattleZone) => {
    if (!selectedCards.player || !selectedCards.computer) return;

    const playerMultiplier = zoneMultipliers[zone];
    const playerFinalScore = selectedCards.player.power * playerMultiplier;

    // Bilgisayarın çarpanını rastgele belirle (ağırlıklı olarak sarı bölge)
    const random = Math.random();
    let computerMultiplier: number;
    if (random < 0.2) computerMultiplier = zoneMultipliers[BattleZone.GREEN];
    else if (random < 0.7) computerMultiplier = zoneMultipliers[BattleZone.YELLOW];
    else computerMultiplier = zoneMultipliers[BattleZone.RED];

    const computerFinalScore = selectedCards.computer.power * computerMultiplier;

    setBattleStats({
      player: {
        power: selectedCards.player.power,
        multiplier: playerMultiplier,
        finalScore: playerFinalScore
      },
      computer: {
        power: selectedCards.computer.power,
        multiplier: computerMultiplier,
        finalScore: computerFinalScore
      }
    });

    // Kazananı belirle
    if (playerFinalScore > computerFinalScore) {
      setWinner('player');
    } else if (computerFinalScore > playerFinalScore) {
      setWinner('computer');
    } else {
      setWinner('draw');
    }

    // Sonuç ekranına geç
    setTimeout(() => {
      setGameState(GameState.RESULT);
    }, 3000);
  };

  // Yeni raunt
  const nextRound = () => {
    setPlayerHand(getRandomCards(3));
    setComputerHand(getRandomCards(3));
    setSelectedCards({ player: null, computer: null });
    setWinner(null);
    setGameState(GameState.CARD_SELECTION);
  };

  // Oyunu sıfırla
  const resetGame = () => {
    setGameState(GameState.READY);
    setPlayerHand([]);
    setComputerHand([]);
    setSelectedCards({ player: null, computer: null });
    setWinner(null);
  };

  return (
    <div className="game-container">
      {gameState === GameState.READY && (
        <div className="ready-screen">
          <h1>Kart Savaşı</h1>
          <button onClick={startGame}>Başla</button>
        </div>
      )}

      {gameState === GameState.CARD_SELECTION && (
        <div className="card-selection">
          <h2>Kartını Seç</h2>
          <div className="hand">
            {playerHand.map(card => (
              <div 
                key={card.id} 
                className="card" 
                onClick={() => selectCard(card)}
                data-card-id={card.id}
              >
                <div className="card-content">
                  <div className="card-back">{card.backImage}</div>
                  <div className="card-front">
                    <div className="card-image">
                      <img src={card.image} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div className="card-name">{card.name}</div>
                    <div className="card-power">{card.power}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {gameState === GameState.BATTLE && selectedCards.player && selectedCards.computer && (
        <div className="battle-screen">
          <div className="cards">
            <div className="player-card">
              <div className="card-image">
                <img src={selectedCards.player.image} alt={selectedCards.player.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div className="card-name">{selectedCards.player.name}</div>
              <div className="card-power">{selectedCards.player.power}</div>
            </div>
            <div className="computer-card">
              <div className="card-image">
                <img src={selectedCards.computer.image} alt={selectedCards.computer.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div className="card-name">{selectedCards.computer.name}</div>
              <div className="card-power">{selectedCards.computer.power}</div>
            </div>
          </div>

          <div className="battle-bar">
            <div className="zones">
              <div className="zone red" style={{ width: '25%' }}>0.8x</div>
              <div className="zone yellow" style={{ width: '20%' }}>1.2x</div>
              <div className="zone green" style={{ width: '10%' }}>1.5x</div>
              <div className="zone yellow" style={{ width: '20%' }}>1.2x</div>
              <div className="zone red" style={{ width: '25%' }}>0.8x</div>
            </div>
            <div 
              className="pointer" 
              style={{ left: `${pointerPosition}%` }}
            />
          </div>

          <div className="battle-instruction">
            Boşluk tuşuna basarak durdurun!
          </div>
        </div>
      )}

      {gameState === GameState.RESULT && winner && selectedCards.player && selectedCards.computer && (
        <div className="result-screen">
          <h2>{winner === 'player' ? 'Kazandınız!' : winner === 'computer' ? 'Kaybettiniz!' : 'Berabere!'}</h2>
          
          <div className="final-cards">
            <div className={`card ${winner === 'player' ? 'winner' : ''}`}>
              <div className="card-image">
                <img src={selectedCards.player.image} alt={selectedCards.player.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div className="card-name">{selectedCards.player.name}</div>
              <div className="card-stats">
                <p>Güç: {selectedCards.player.power} × {battleStats.player.multiplier.toFixed(1)} = {Math.round(battleStats.player.finalScore)}</p>
              </div>
            </div>
            
            <div className={`card ${winner === 'computer' ? 'winner' : ''}`}>
              <div className="card-image">
                <img src={selectedCards.computer.image} alt={selectedCards.computer.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div className="card-name">{selectedCards.computer.name}</div>
              <div className="card-stats">
                <p>Güç: {selectedCards.computer.power} × {battleStats.computer.multiplier.toFixed(1)} = {Math.round(battleStats.computer.finalScore)}</p>
              </div>
            </div>
          </div>

          <div className="buttons">
            <button onClick={nextRound}>Sonraki Raunt</button>
            <button onClick={resetGame}>Yeni Oyun</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardGame; 
export interface Card {
    id: string;
    name: string;
    power: number;
    image: string;
    backImage: string;
}

export enum BattleZone {
    RED = 'RED',
    YELLOW = 'YELLOW',
    GREEN = 'GREEN'
}

export interface BattleStats {
    power: number;
    multiplier: number;
    finalScore: number;
}

export interface BattleStatsState {
    player: BattleStats;
    computer: BattleStats;
}

export enum GameState {
    READY = 'READY',
    CARD_SELECTION = 'CARD_SELECTION',
    BATTLE = 'BATTLE',
    RESULT = 'RESULT'
}

export type Winner = 'player' | 'computer' | 'draw' | null;

export interface SelectedCards {
    player: Card | null;
    computer: Card | null;
} 
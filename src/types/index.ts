export type Position = "1" | "2" | "3" | "4" | "5";

export interface Player {
  name: string;
  rank: number; // MMR or medal rank
  positions: Position[];
}

export interface Team {
  players: Player[];
  averageRank: number;
}

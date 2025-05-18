import React from "react";
import { Player, Position } from "../types";

type Team = Record<Position, Player>;

export interface BalanceOption {
  radiant: Player[]; // arbitrarily named – first five
  dire: Player[]; // remaining five
  totalCoverage: number; // [0‑10]  (#unique positions in Radiant + Dire)
  diff: number; // absolute rank gap – lower → better
}

export const getBalanceOptions = (
  { players }: { players: Player[] },
  maxOptions: number = 5,
): BalanceOption[] => {
  // ▶ 1. Need at least ten to form two squads.
  const roster = players.slice(0, 10);
  if (roster.length < 10) return [];

  const n = roster.length; // 10

  const bitCount = (m: number) => m.toString(2).replace(/0/g, "").length;
  const coverageOf = (group: Player[]): number => {
    const set = new Set<Position>();
    for (const p of group) p.positions.forEach((pos) => set.add(pos));
    return set.size; // 0‑5
  };

  const allSplits: BalanceOption[] = [];

  // ▶ 2. Enumerate C(10,5)=252 ways – cheap.
  for (let mask = 0; mask < 1 << n; mask++) {
    if (bitCount(mask) !== 5) continue;
    if (!(mask & 1)) continue; // canonicalise – force player0 into Radiant

    const radiant: Player[] = [];
    const dire: Player[] = [];
    for (let i = 0; i < n; i++) {
      (mask & (1 << i) ? radiant : dire).push(roster[i]);
    }

    const covA = coverageOf(radiant);
    const covB = coverageOf(dire);
    const totalCov = covA + covB; // 0‑10

    const sumA = radiant.reduce((s, p) => s + p.rank, 0);
    const sumB = dire.reduce((s, p) => s + p.rank, 0);

    allSplits.push({
      radiant,
      dire,
      totalCoverage: totalCov,
      diff: Math.abs(sumA - sumB),
    });
  }

  // ▶ 3. Sort by (coverage desc, diff asc) & trim.
  allSplits.sort((a, b) => {
    if (b.totalCoverage !== a.totalCoverage)
      return b.totalCoverage - a.totalCoverage;
    return a.diff - b.diff;
  });

  return allSplits.slice(0, maxOptions);
};

const possibleColors = [
  "bg-green-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-gray-500",
  "bg-indigo-500",
];

export const BalanceView = ({ players }: { players: Player[] }) => {
  const result = getBalanceOptions({ players }) || [null, null];
  const generatePlayerToColorMap = () => {
    const playerToColorMap: Record<string, string> = {};
    players.forEach((player, index) => {
      playerToColorMap[player.name] = possibleColors[index];
    });
    return playerToColorMap;
  };
  const colorMap = generatePlayerToColorMap();

  const PlayerLine = ({
    position,
    player,
  }: {
    position: string;
    player: Player;
  }) => (
    <div className={"flex items-center"} key={position}>
      <div
        className={`${colorMap[player.name]} rounded-full w-2 h-2 mr-1`}
      ></div>
      <div>
        {parseInt(position) + 1}: {player.name} (Rank: {player.rank})
      </div>
    </div>
  );

  return (
    <div className="mx-auto flex flex-col">
      <h2 className="text-xl font-bold mb-4">Balance View</h2>
      <div className="overflow-auto flex-grow">
        {result.map((option, index) => {
          if (!option) return null;
          const [teamA, teamB] = [option.radiant, option.dire];
          const diff = option.diff;
          return (
            <div key={index} className="mb-4 px-8">
              <h3 className="text-lg font-semibold mb-3">Option {index + 1}</h3>
              <div className="flex justify-center gap-10">
                <div>
                  <h4 className="text-md font-bold">Radiant</h4>
                  {Object.entries(teamA).map(([pos, player]) => (
                    <PlayerLine key={pos} position={pos} player={player} />
                  ))}
                </div>
                <div>
                  <h4 className="text-md font-bold">Dire</h4>
                  {Object.entries(teamB).map(([pos, player]) => (
                    <PlayerLine key={pos} position={pos} player={player} />
                  ))}
                </div>
              </div>
              <p className="mt-2">Rank Difference: {diff}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

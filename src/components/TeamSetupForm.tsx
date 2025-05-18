import { useEffect, useState } from "react";
import { Player, Position } from "../types";

const DEFAULT_TEXT = `
Miracle-,12200,1
Yatoro,11950,1
Arteezy,11800,1
Topson,11650,2
SumaiL,11400,12
Nisha,11150,2
Quinn,11000,2
Puppey,10300,5
Cr1t-,9700,4
JerAx,9400,4
`.trim();

export const TeamSetupForm = ({
  setPlayers,
}: {
  setPlayers: (players: Player[]) => void;
}) => {
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dataParam = new URLSearchParams(window.location.search).get("data");
    if (dataParam) {
      const decodedData = atob(dataParam);
      const result = validateAndParseText(decodedData);
      if (result.errorMessage) {
        setError(result.errorMessage);
      } else {
        setPlayers(result.players);
        setError(null);
      }
      setText(decodedData);
      setPlayers(result.players);
      return;
    }
    setText(DEFAULT_TEXT);
    const result = validateAndParseText(DEFAULT_TEXT);
    setPlayers(result.players);
  }, []);
  const validateAndParseText = (
    text: string,
  ): { errorMessage: string | null; players: Player[] } => {
    try {
      const lines = text.trim().split("\n");

      const players: Player[] = [];
      let errorMessage: string | null = null;

      lines.forEach((line) => {
        if (line.trim() === "") return;

        try {
          const parts = line.split(",");
          const playerName = parts[0]?.trim();
          const rankStr = parts[1]?.trim();
          const positionsStr = parts[2]?.trim();

          if (!playerName || !rankStr) {
            errorMessage =
              "Please enter player name, rank and positions for all players.";
            return;
          }

          const rank = parseInt(rankStr);
          if (isNaN(rank)) {
            errorMessage = "Rank must be a number.";
            return;
          }
          let positions = ["1", "2", "3", "4", "5"] as Position[];
          if (positionsStr) {
            positions = positionsStr
              .split("")
              .map((pos) => pos.trim() as Position);
            for (const pos of positions) {
              if (!["1", "2", "3", "4", "5"].includes(pos)) {
                errorMessage = `Invalid position "${pos}" for player "${playerName}". Valid positions are 1, 2, 3, 4, or 5.`;
              }
            }
          }

          players.push({
            name: playerName,
            rank: rank,
            positions,
          });
        } catch (error) {
          console.error("Error parsing line:", line, error);
          players.push({
            name: "ERROR",
            rank: 0,
            positions: ["1", "2", "3", "4", "5"] as Position[],
          });
        }
      });
      if (players.length !== 10 && !errorMessage) {
        errorMessage = "Please enter at 10 players.";
      }
      return { errorMessage, players };
    } catch (error) {
      console.error("Error parsing text:", error);
      return { errorMessage: "An unexpected error occurred.", players: [] };
    }
  };
  return (
    <div className="flex flex-col gap-2 w-[500px]">
      <h2 className="text-xl font-bold mb-4">Team Setup</h2>
      <div>
        <div>Enter in the following format:</div>
        <code>PlayerName,Rank,Positions</code>
        <div>If you leave out positions, we will assume 12345</div>
        <h3>Example:</h3>
        <div className="bg-gray-700 text-white p-2 rounded">
          <div>Jim,1480,23</div>
          <div>Bob,1500,12</div>
          <div>John,1600,45</div>
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          const result = validateAndParseText(e.target.value);
          if (result.errorMessage) {
            setError(result.errorMessage);
          } else {
            setPlayers(result.players);
            // Update the URL with the new data
            const encodedData = btoa(e.target.value);
            const newUrl = `${window.location.origin}${window.location.pathname}?data=${encodedData}`;
            window.history.replaceState({}, "", newUrl);
            setError(null);
          }
        }}
        className={`h-40 border-2 ${error ? "border-red-500" : "border-blue-400"} bg-gray-700 text-white focus:outline-none rounded-sm`}
      />
      <div className="flex">
        {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
      </div>
    </div>
  );
};

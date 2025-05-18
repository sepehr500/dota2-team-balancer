import { useState } from "react";
import { Player } from "./types";
import { TeamSetupForm } from "./components/TeamSetupForm";
import { BalanceView } from "./components/BalanceView";

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  return (
    <div className="h-screen bg-gray-800 text-white flex flex-col">
      <h1 className="text-2xl font-bold my-4 px-3">Dota 2 Team Balancer</h1>
      <div className="mx-auto max-w-[1280px] flex gap-5 flex-grow overflow-auto">
        <TeamSetupForm setPlayers={setPlayers} />
        <BalanceView players={players} />
      </div>
    </div>
  );
}

export default App;

import React from "react";
import { PlayerManagement } from "./PlayerManagement";
import { findAllPlayers } from "./actions";

async function PlayersPage() {
  const response = await findAllPlayers();
  return (
    <div>
      <PlayerManagement players={response.data} />
    </div>
  );
}

export default PlayersPage;

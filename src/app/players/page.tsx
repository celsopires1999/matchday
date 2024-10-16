import { revalidatePath } from "next/cache";
import { PlayerManagement } from "./PlayerManagement";
import { findAllPlayers } from "./actions";

async function PlayersPage() {
  // Ensure the data is refreshed automatically when changes occur in other applications
  revalidatePath(`/players`);
  const response = await findAllPlayers();
  return (
    <div>
      <PlayerManagement players={response.data} />
    </div>
  );
}

export default PlayersPage;

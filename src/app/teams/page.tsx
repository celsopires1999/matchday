import { revalidatePath } from "next/cache";
import { TeamManagement } from "./TeamManagement";
import { findAllTeams } from "./actions";

async function TeamsPage() {
  // Ensure the data is refreshed automatically when changes occur in other applications
  revalidatePath(`/teams`);
  const response = await findAllTeams();
  return (
    <div>
      <TeamManagement teams={response.data} />
    </div>
  );
}

export default TeamsPage;

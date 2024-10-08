import { prisma } from "@/server/@prisma/prisma";
import { initializePrisma } from "@/tests/initialize-prisma";
import { Game, GameDay, Player, Team } from "@prisma/client";
import { getGame, updateGame } from "./actions";

describe("Game Actions", () => {
  beforeEach(async () => {
    await initializePrisma();
  }, 10000);

  it("should get game", async () => {
    const game = await createGame();
    const response = await getGame(game.gameId);
    expect(response.code).toBe(200);
    expect(response.message).toBe("OK");
    expect(response.data).toHaveProperty("gameId");
  });

  it("should not get game with invalid id", async () => {
    const response = await getGame("1");
    expect(response.code).toBe(404);
    expect(response.message).toBe("Game not found using ID 1");
    expect(response.data).toBe(null);
  });
  it("should not get game with inexistent id", async () => {
    const response = await getGame("670750f6f4d76e7760bef666");
    expect(response.code).toBe(404);
    expect(response.message).toBe(
      "Game not found using ID 670750f6f4d76e7760bef666"
    );
    expect(response.data).toBe(null);
  });

  it("should update game", async () => {
    const game = await createGame();

    game.home.gols = 1;
    game.home.players[0].gols = 1;

    const response = await updateGame(game);
    expect(response.code).toBe(200);
    expect(response.message).toBe("OK");
    expect(response.data?.version).toBe(1);
  });

  it("should not update game with wrong version", async () => {
    const game = await createGame();

    const response = await updateGame({
      ...game,
      version: 1,
    });
    expect(response.code).toBe(404);
    expect(response.message).toBe(
      `Game with id ${game.gameId} and version 1 not found`
    );
    expect(response.data).toBe(null);
  });
});

async function createPlayers(): Promise<Player[]> {
  await prisma.player.createMany({
    data: [
      {
        name: "John Doe",
      },
      {
        name: "Jane Doe",
      },
      {
        name: "Bob Doe",
      },
      {
        name: "Alice Doe",
      },
    ],
  });

  const players = await prisma.player.findMany();

  return players;
}

async function createTeams(): Promise<Team[]> {
  await prisma.team.createMany({
    data: [
      {
        name: "Black",
      },
      {
        name: "Green",
      },
    ],
  });

  const teams = await prisma.team.findMany();

  return teams;
}

async function createGameDay(
  players: Player[],
  teams: Team[]
): Promise<GameDay> {
  const gameDay: Omit<
    GameDay,
    "gameDayId" | "version" | "createdAt" | "updatedAt"
  > = {
    date: new Date(),
    teams: [
      {
        teamId: teams[0].teamId,
        teamName: teams[0].name,
        players: [
          {
            playerId: players[0].playerId,
            playerName: players[0].name,
            gols: 0,
            assists: 0,
          },
          {
            playerId: players[1].playerId,
            playerName: players[1].name,
            gols: 0,
            assists: 0,
          },
        ],
      },
      {
        teamId: teams[1].teamId,
        teamName: teams[1].name,
        players: [
          {
            playerId: players[2].playerId,
            playerName: players[2].name,
            gols: 0,
            assists: 0,
          },
          {
            playerId: players[3].playerId,
            playerName: players[3].name,
            gols: 0,
            assists: 0,
          },
        ],
      },
    ],
  };

  const createdGameDay = await prisma.gameDay.create({
    data: gameDay,
  });

  return createdGameDay;
}

async function createGame(): Promise<Game> {
  const players = await createPlayers();
  const teams = await createTeams();
  const gameDay = await createGameDay(players, teams);
  const date = new Date();

  const game: Omit<Game, "gameId" | "version" | "createdAt" | "updatedAt"> = {
    gameDayId: gameDay.gameDayId,
    date: new Date(date.getFullYear(), date.getMonth(), date.getDay()),
    number: 1,
    home: {
      teamId: teams[0].teamId,
      teamName: teams[0].name,
      gols: 0,
      players: [
        {
          playerId: players[0].playerId,
          playerName: players[0].name,
          gols: 0,
          assists: 0,
        },
        {
          playerId: players[1].playerId,
          playerName: players[1].name,
          gols: 0,
          assists: 0,
        },
      ],
    },
    away: {
      teamId: teams[1].teamId,
      teamName: teams[1].name,
      gols: 0,
      players: [
        {
          playerId: players[2].playerId,
          playerName: players[2].name,
          gols: 0,
          assists: 0,
        },
        {
          playerId: players[3].playerId,
          playerName: players[3].name,
          gols: 0,
          assists: 0,
        },
      ],
    },
  };

  const createdGame = await prisma.game.create({
    data: game,
  });

  return createdGame;
}

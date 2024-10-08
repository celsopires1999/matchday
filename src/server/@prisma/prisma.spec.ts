import { Game, GameDay } from "@prisma/client";
import { prisma } from "./prisma";

describe("Validate Prisma Model", () => {
  it("Collections", async () => {
    // Clean
    await prisma.game.deleteMany();
    await prisma.gameDay.deleteMany();
    await prisma.player.deleteMany();
    await prisma.team.deleteMany();

    // #region  Player

    const players: { name: string }[] = [
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
    ];

    const countPlayers = await prisma.player.createMany({
      data: players,
    });
    expect(countPlayers.count).toBe(4);

    const createdPlayers = await prisma.player.findMany();
    expect(createdPlayers.length).toBe(4);

    // #endregion Player

    // #region  Team
    const teams: { name: string }[] = [
      {
        name: "Black",
      },
      {
        name: "Green",
      },
    ];
    const countTeams = await prisma.team.createMany({
      data: teams,
    });
    expect(countTeams.count).toBe(2);

    const createdTeams = await prisma.team.findMany();
    expect(createdTeams.length).toBe(2);

    // #endregion Team

    // #region GameDay
    const date = new Date();

    const gameDay: Omit<
      GameDay,
      "gameDayId" | "version" | "createdAt" | "updatedAt"
    > = {
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      teams: [
        {
          teamId: createdTeams[0].teamId,
          teamName: createdTeams[0].name,
          players: [
            {
              playerId: createdPlayers[0].playerId,
              playerName: createdPlayers[0].name,
              gols: 1,
              assists: 2,
            },
            {
              playerId: createdPlayers[1].playerId,
              playerName: createdPlayers[1].name,
              gols: 3,
              assists: 4,
            },
          ],
        },
        {
          teamId: createdTeams[1].teamId,
          teamName: createdTeams[1].name,
          players: [
            {
              playerId: createdPlayers[2].playerId,
              playerName: createdPlayers[2].name,
              gols: 5,
              assists: 6,
            },
            {
              playerId: createdPlayers[3].playerId,
              playerName: createdPlayers[3].name,
              gols: 7,
              assists: 8,
            },
          ],
        },
      ],
    };

    const createdGameDay = await prisma.gameDay.create({
      data: gameDay,
    });
    expect(createdGameDay.gameDayId).toBeDefined();
    expect(createdGameDay.teams.length).toBe(2);

    // #endregion GameDay

    // #region Game
    const game: Omit<Game, "gameId" | "version" | "createdAt" | "updatedAt"> = {
      gameDayId: createdGameDay.gameDayId,
      date: createdGameDay.date,
      number: 1,
      home: {
        teamId: createdTeams[0].teamId,
        teamName: createdTeams[0].name,
        gols: 9,
        players: [
          {
            playerId: createdPlayers[0].playerId,
            playerName: createdPlayers[0].name,
            gols: 10,
            assists: 11,
          },
          {
            playerId: createdPlayers[1].playerId,
            playerName: createdPlayers[1].name,
            gols: 12,
            assists: 13,
          },
        ],
      },
      away: {
        teamId: createdTeams[1].teamId,
        teamName: createdTeams[1].name,
        gols: 14,
        players: [
          {
            playerId: createdPlayers[2].playerId,
            playerName: createdPlayers[2].name,
            gols: 15,
            assists: 16,
          },
          {
            playerId: createdPlayers[3].playerId,
            playerName: createdPlayers[3].name,
            gols: 17,
            assists: 18,
          },
        ],
      },
    };

    const createdGame = await prisma.game.create({
      data: game,
    });
    expect(createdGame.gameId).toBeDefined();
    expect(createdGame.number).toBe(1);
    expect(createdGame.home.teamId).toBe(createdTeams[0].teamId);
    expect(createdGame.away.teamId).toBe(createdTeams[1].teamId);

    // #endregion Game
  }, 50000);
});

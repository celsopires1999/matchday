"use server";

import { prisma } from "@/server/@prisma/prisma";
import { checkNotFoundError } from "@/server/errors";
import { Game } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { GameId } from "../../types";

export type Response = {
  code: number;
  message: string;
  data: Game | null;
};

export async function getGame(gameId: GameId): Promise<Response> {
  try {
    const game = await prisma.game.findUniqueOrThrow({
      where: {
        gameId: gameId,
      },
    });

    return {
      code: 200,
      message: "OK",
      data: game,
    };
  } catch (error) {
    const { code, message } = checkNotFoundError(
      `Game not found using ID ${gameId}`,
      error
    );
    return {
      code,
      message,
      data: null,
    };
  }
}

export async function updateGame(game: Game): Promise<Response> {
  const { gameId, version, ...data } = game;
  const { homeGols, awayGols } = calculateScore(game);
  try {
    const updatedGame = await prisma.game.update({
      where: {
        gameId,
        version,
      },
      data: {
        ...data,
        home: {
          ...data.home,
          gols: homeGols,
        },
        away: {
          ...data.away,
          gols: awayGols,
        },
        version: version + 1,
        createdAt: undefined,
        updatedAt: undefined,
      },
    });
    revalidatePath(`/player-score/${gameId}`);
    return {
      code: 200,
      message: "OK",
      data: updatedGame,
    };
  } catch (error) {
    const { code, message } = checkNotFoundError(
      `Game with id ${game.gameId} and version ${game.version} not found`,
      error
    );
    return {
      code: code,
      message: message,
      data: null,
    };
  }
}

function calculateScore(game: Game) {
  let homeGols = 0;
  let awayGols = 0;
  game.home.players.forEach((player) => {
    homeGols += player.gols;
  });
  game.away.players.forEach((player) => {
    awayGols += player.gols;
  });

  return {
    homeGols,
    awayGols,
  };
}

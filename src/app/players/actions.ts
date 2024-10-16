"use server";

import { prisma } from "@/server/@prisma/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function findAllPlayers() {
  const players = await prisma.player.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return {
    code: 200,
    message: "OK",
    data: players,
  };
}

export async function addPlayer(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name.trim()) {
    return {
      code: 400,
      message: "Player name cannot be empty",
      data: null,
    };
  }

  try {
    const newPlayer = await prisma.player.create({
      data: {
        name: name.trim(),
      },
    });
    revalidatePath(`/players`);
    return {
      code: 201,
      message: "OK",
      data: newPlayer,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          code: 400,
          message: "Player already exists",
          data: null,
        };
      }
    }
    console.log(error);
    return {
      code: 500,
      message: "unexpected error",
      data: null,
    };
  }
}

export async function updatePlayer(formData: FormData) {
  const playerId = formData.get("playerId") as string;
  const name = formData.get("name") as string;

  if (!name.trim()) {
    return {
      code: 400,
      message: "Player name cannot be empty",
      data: null,
    };
  }

  try {
    const updatedPlayer = await prisma.player.update({
      where: {
        playerId: playerId,
      },
      data: {
        name: name.trim(),
      },
    });
    revalidatePath(`/players`);
    return {
      code: 200,
      message: "OK",
      data: updatedPlayer,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          code: 400,
          message: "Player already exists",
          data: null,
        };
      }
    }
    console.log(error);
    return {
      code: 500,
      message: "unexpected error",
      data: null,
    };
  }
}

export async function deletePlayer(formData: FormData) {
  const playerId = formData.get("playerId") as string;

  try {
    const deletedPlayer = await prisma.player.delete({
      where: {
        playerId: playerId,
      },
    });

    revalidatePath(`/players`);
    return {
      code: 200,
      message: "OK",
      data: deletedPlayer,
    };
  } catch (error) {
    console.log(error);
    return {
      code: 500,
      message: "unexpected error",
      data: null,
    };
  }
}

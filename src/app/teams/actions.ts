"use server";

import { prisma } from "@/server/@prisma/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function findAllTeams() {
  const games = await prisma.team.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return {
    code: 200,
    message: "OK",
    data: games,
  };
}

export async function addTeam(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name.trim()) {
    return {
      code: 400,
      message: "Team name cannot be empty",
      data: null,
    };
  }

  try {
    const newTeam = await prisma.team.create({
      data: {
        name: name.trim(),
      },
    });
    revalidatePath(`/teams`);
    return {
      code: 201,
      message: "OK",
      data: newTeam,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          code: 400,
          message: "Team already exists",
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

export async function updateTeam(formData: FormData) {
  const teamId = formData.get("teamId") as string;
  const name = formData.get("name") as string;

  if (!name.trim()) {
    return {
      code: 400,
      message: "Team name cannot be empty",
      data: null,
    };
  }

  try {
    const updatedTeam = await prisma.team.update({
      where: {
        teamId: teamId,
      },
      data: {
        name: name.trim(),
      },
    });
    revalidatePath(`/teams`);
    return {
      code: 200,
      message: "OK",
      data: updatedTeam,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          code: 400,
          message: "Team already exists",
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

export async function deleteTeam(formData: FormData) {
  const teamId = formData.get("teamId") as string;

  try {
    const deletedTeam = await prisma.team.delete({
      where: {
        teamId: teamId,
      },
    });

    revalidatePath(`/teams`);
    return {
      code: 200,
      message: "OK",
      data: deletedTeam,
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

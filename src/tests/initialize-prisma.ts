import { prisma } from "@/server/@prisma/prisma";

export async function initializePrisma() {
  await prisma.$transaction([
    prisma.game.deleteMany(),
    prisma.gameDay.deleteMany(),
    prisma.player.deleteMany(),
    prisma.team.deleteMany(),
  ]);
}

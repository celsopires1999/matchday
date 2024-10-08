import { Prisma } from "@prisma/client";

export type Response = {
  code: number;
  message: string;
};

export function checkNotFoundError(msg: string, e: unknown): Response {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
    return {
      code: 404,
      message: msg,
    };
  }

  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2023") {
    return {
      code: 404,
      message: msg,
    };
  }

  console.log(e);
  return {
    code: 500,
    message: "unexpected error",
  };
}

// export function checkDuplicatedError(msg: string, e: unknown) {
//   if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
//     throw new DuplicatedError(msg);
//   } else {
//     throw e;
//   }
// }

// export class NotFoundError extends Error {
//   constructor(message: string) {
//     super(message);
//     this.name = "NotFoundError";
//   }
// }

// export class DuplicatedError extends Error {
//   constructor(message: string) {
//     super(message);
//     this.name = "DuplicatedError";
//   }
// }

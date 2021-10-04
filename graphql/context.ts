import { PrismaClient } from "@prisma/client";
import { NextApiRequest } from "next";
import prisma from "../lib/prisma";

export type Context = {
  prisma: PrismaClient;
};
export async function createContext({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiRequest;
}): Promise<Context> {
  return {
    prisma,
  };
}

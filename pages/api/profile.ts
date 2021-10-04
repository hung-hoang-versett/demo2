import type { NextApiRequest, NextApiResponse } from "next";
import { getSession, withApiAuthRequired, Session } from "@auth0/nextjs-auth0";
import prisma from "../../lib/prisma";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data: Session | null | undefined = getSession(req, res);
  if (data?.user) {
    const user = await prisma.user.update({
      where: {
        email: data?.user.email,
      },
      data: {
        email: data?.user.email,
        sub: data?.user.sub,
      },
    });
    if (user) {
      return res.json(user);
    }
    const newUser = await prisma.user.create({
      data: {
        email: data?.user.email,
        sub: data?.user.sub,
      },
    });
    return res.json(newUser);
  }
  return res.json(null);
});

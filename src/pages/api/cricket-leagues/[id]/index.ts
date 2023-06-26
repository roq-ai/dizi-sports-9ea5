import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { cricketLeagueValidationSchema } from 'validationSchema/cricket-leagues';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.cricket_league
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCricketLeagueById();
    case 'PUT':
      return updateCricketLeagueById();
    case 'DELETE':
      return deleteCricketLeagueById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCricketLeagueById() {
    const data = await prisma.cricket_league.findFirst(convertQueryToPrismaUtil(req.query, 'cricket_league'));
    return res.status(200).json(data);
  }

  async function updateCricketLeagueById() {
    await cricketLeagueValidationSchema.validate(req.body);
    const data = await prisma.cricket_league.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCricketLeagueById() {
    const data = await prisma.cricket_league.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

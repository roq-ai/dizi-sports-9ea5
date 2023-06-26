import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { blogPostValidationSchema } from 'validationSchema/blog-posts';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getBlogPosts();
    case 'POST':
      return createBlogPost();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBlogPosts() {
    const data = await prisma.blog_post
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'blog_post'));
    return res.status(200).json(data);
  }

  async function createBlogPost() {
    await blogPostValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.blog_post.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}

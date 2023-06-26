import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { blogPostValidationSchema } from 'validationSchema/blog-posts';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.blog_post
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getBlogPostById();
    case 'PUT':
      return updateBlogPostById();
    case 'DELETE':
      return deleteBlogPostById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBlogPostById() {
    const data = await prisma.blog_post.findFirst(convertQueryToPrismaUtil(req.query, 'blog_post'));
    return res.status(200).json(data);
  }

  async function updateBlogPostById() {
    await blogPostValidationSchema.validate(req.body);
    const data = await prisma.blog_post.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteBlogPostById() {
    const data = await prisma.blog_post.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

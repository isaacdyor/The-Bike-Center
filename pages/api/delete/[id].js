import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const profileId = req.query.id;
  if (req.method === 'DELETE') {
    const post = await prisma.volunteer.delete({
      where: { userId: profileId },
    });
    res.json(post);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}
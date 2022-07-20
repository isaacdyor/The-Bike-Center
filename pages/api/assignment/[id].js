import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const donationId = req.query.id;
  const post = await prisma.assignment.update({
    where: { id: donationId },
    data: { completed: true },
  });
  res.json(post);
}
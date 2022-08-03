import prisma from '../../../../lib/prisma';

export default async function handle(req, res) {
  const { bikes, hours, value, description } = req.body;
  const donationId = req.query.id;
  const donation = await prisma.donation.update({
    where: { id: donationId },
    data: {
      bikes: bikes,
      hours: hours,
      value: value,
      description: description,
      approved: false,
    },
  });
  res.json(donation);
}
import { getSession } from 'next-auth/react';
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const { bikes, hours, description, value, selected } = req.body;

  const session = await getSession({ req });
  const result = await prisma.donation.create({
    data: {
      bikes: bikes,
      hours: hours,
      description: description,
      value: value,
      volunteer: { connect: { userId: session?.user?.id } },
      location: { connect: {id: selected[0].id} }
    },
  });
  res.json(result);
}

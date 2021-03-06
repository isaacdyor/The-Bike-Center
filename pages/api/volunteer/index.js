import { getSession } from 'next-auth/react';
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const { name, address, radius, phone, notes, selected } = req.body;

  const connection = selected.map(location => {
    return {id: location.id}
  })

  const session = await getSession({ req });
  const result = await prisma.volunteer.create({
    data: {
      name: name,
      address: address,
      radius: radius,
      phone: phone,
      notes: notes,
      user: { connect: { email: session?.user?.email } },
      locations: { connect: connection }
    },
  });
  res.json(result);
}

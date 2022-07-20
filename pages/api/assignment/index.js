import { getSession } from 'next-auth/react';
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const { name, email, address, phone, bikes, notes, selected, id } = req.body;

  const connection = selected.map(location => {
    return {id: location.id}
  })

  const session = await getSession({ req });
  const result = await prisma.assignment.create({
    data: {
      name: name,
      email: email,
      address: address,
      phone: phone,
      bikes: bikes,
      notes: notes,
      user: { connect: { id: id } },
      volunteer: { connect: { userId: id } },
      location: { connect: {id: selected[0].id} }
    },
  });
  res.json(result);
}
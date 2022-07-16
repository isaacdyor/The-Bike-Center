import prisma from '../../../lib/prisma';

// PUT /api/publish/:id
export default async function handle(req, res) {
  const { name, address, radius, phone, notes, id } = req.body;
  const volunteer = await prisma.volunteer.update({
    where: { userId: id },
    data: {
      name: name,
      address: address,
      radius: radius,
      phone: phone,
      notes: notes,
    },
  });
  res.json(volunteer);
}
import prisma from '../../../../lib/prisma';

export default async function handle(req, res) {
  const { name, address, radius, phone, notes, id, selected } = req.body;

  const connection = selected.map(location => {
    return {id: location.id}
  })

  const volunteer = await prisma.volunteer.update({
    where: { userId: id },
    data: {
      name: name,
      address: address,
      radius: radius,
      phone: phone,
      notes: notes,
      locations: {
        set: [],
        connect: connection
      }
    },
  });
  res.json(volunteer);
}
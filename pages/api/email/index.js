import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handle(req, res) {
  const { name, email, address, phone, bikes, notes, selected, volEmail } = req.body
  const msg = {
    to: volEmail,
    from: 'efcisaac07@gmail.com',
    subject: 'New Pickup Request',
    text: `${name} has requested you to pick up ${bikes} bike/s from ${address}.
    To schedule a pickup time either email them at ${email} or call or text them at ${phone}.
    They want this bike to be donated to ${selected[0]?.title}.
    They left the following note: ${notes}. Thank you.`,
  };

  try {
    await sgMail.send(msg);
    res.json({ message: `Email has been sent` })
  } catch (error) {
    res.status(500).json({ error: 'Error sending email' })
  }
}
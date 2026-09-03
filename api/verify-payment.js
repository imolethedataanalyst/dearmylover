// Vercel serverless function — confirms a Paystack transaction actually succeeded
// before the site treats a booking as paid. Never trust the client-side redirect
// alone; this is the real check, using the secret key (server-side only).

export default async function handler(req, res) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const reference = req.query.reference;

  if (!secretKey) {
    return res.status(500).json({ error: 'Payment is not configured yet.' });
  }
  if (!reference) {
    return res.status(400).json({ error: 'Missing payment reference.' });
  }

  try {
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );
    const result = await paystackRes.json();

    const success = !!(result.status && result.data && result.data.status === 'success');
    if (!success) {
      return res.status(200).json({ success: false });
    }

    return res.status(200).json({
      success: true,
      reference: result.data.reference,
      amount: result.data.amount,
      email: result.data.customer && result.data.customer.email,
      formData: result.data.metadata || {}
    });
  } catch (err) {
    return res.status(500).json({ error: 'Could not verify payment right now.' });
  }
}

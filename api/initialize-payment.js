// Vercel serverless function — starts a Paystack transaction for the consultation fee.
// Reads the secret key from an environment variable (Vercel Project → Settings →
// Environment Variables → PAYSTACK_SECRET_KEY). Never hardcode it here.

const CONSULTATION_FEE_NGN = 30000; // ₦30,000 consultation fee

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ error: 'Payment is not configured yet. Please contact the studio directly.' });
  }

  const data = req.body || {};
  const email = (data.email || '').trim();
  if (!email) {
    return res.status(400).json({ error: 'An email address is required to start payment.' });
  }

  const origin = `https://${req.headers.host}`;

  try {
    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        amount: CONSULTATION_FEE_NGN * 100, // Paystack expects kobo
        currency: 'NGN',
        callback_url: `${origin}/thank-you.html`,
        metadata: {
          formType: 'consultation',
          type: data.type || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          date: data.date || '',
          time: data.time || '',
          wdate: data.wdate || '',
          location: data.location || '',
          ceremonies: data.ceremonies || '',
          package: data.package || '',
          aesthetic: data.aesthetic || '',
          story: data.story || ''
        }
      })
    });

    const result = await paystackRes.json();
    if (!paystackRes.ok || !result.status) {
      return res.status(502).json({ error: result.message || 'Could not start payment. Please try again.' });
    }

    return res.status(200).json({ authorization_url: result.data.authorization_url });
  } catch (err) {
    return res.status(500).json({ error: 'Payment service unavailable right now. Please try again shortly.' });
  }
}

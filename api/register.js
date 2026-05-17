// Vercel serverless function — POST → Airtable.
// Env vars required (set in Vercel dashboard → Project Settings → Environment Variables):
//   AIRTABLE_TOKEN          Personal Access Token from airtable.com/create/tokens
//   AIRTABLE_BASE_ID        Base ID, looks like appXXXXXXXXXXXXXX (visible in Airtable URL)
//   AIRTABLE_TABLE_NAME     Table name, e.g. "Registrations 2026"

export default async function handler(req, res) {
  // CORS / method gate
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // Body parsing — Vercel's default JSON parser handles this when content-type is application/json
  const data = req.body || {};

  // Server-side validation (mirrors the HTML5 required attributes)
  const required = ['parent', 'phone', 'email', 'count', 'track', 'kids', 'location'];
  for (const k of required) {
    if (!data[k] || String(data[k]).trim() === '') {
      return res.status(400).json({ ok: false, error: `Missing required field: ${k}` });
    }
  }

  // Make sure env vars are set
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE  = process.env.AIRTABLE_BASE_ID;
  const TABLE = process.env.AIRTABLE_TABLE_NAME;
  if (!TOKEN || !BASE || !TABLE) {
    console.error('Missing Airtable env vars:', { hasToken: !!TOKEN, hasBase: !!BASE, hasTable: !!TABLE });
    return res.status(500).json({ ok: false, error: 'Server not configured. Contact admin.' });
  }

  // Build Airtable payload — field names MUST match your Airtable table column names exactly
  const fields = {
    'Parent Name': String(data.parent).trim(),
    'Phone': String(data.phone).trim(),
    'Email': String(data.email).trim(),
    'Number of Children': String(data.count).trim(),
    'Age Track': String(data.track).trim(),
    'Children Details': String(data.kids).trim(),
    'Preferred Location': String(data.location).trim(),
    'Notes': String(data.notes || '').trim(),
    'Submitted At': new Date().toISOString()
  };

  const airtableUrl = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}`;

  try {
    const r = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [{ fields }],
        typecast: true // lets Airtable accept strings for select fields, dates, etc.
      })
    });

    if (!r.ok) {
      const err = await r.text();
      console.error('Airtable error:', r.status, err);
      // Don't leak Airtable internals to the client
      return res.status(502).json({ ok: false, error: 'Could not save your registration. Please try again, or email summercamp@sahabamosque.ca directly.' });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Network error to Airtable:', e);
    return res.status(502).json({ ok: false, error: 'Network error. Please try again.' });
  }
}

export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(
      'SELECT id, description, hours, rates FROM labor_items ORDER BY created_at DESC'
    ).all();
    const parsed = results.map(r => ({
      id: r.id,
      description: r.description,
      hours: safeParseObj(r.hours),
      rates: safeParseObj(r.rates)
    }));
    return Response.json(parsed);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const description = (body.description || '').toString();
    const hours = body.hours && typeof body.hours === 'object' ? body.hours : {};
    const rates = body.rates && typeof body.rates === 'object' ? body.rates : {};
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await context.env.DB.prepare(
      'INSERT INTO labor_items (id, description, hours, rates, cost, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, description, JSON.stringify(hours), JSON.stringify(rates), 0, now, now).run();
    return Response.json({ id, description, hours, rates }, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

function safeParseObj(s) {
  if (!s) return {};
  try { const o = JSON.parse(s); return o && typeof o === 'object' ? o : {}; } catch { return {}; }
}

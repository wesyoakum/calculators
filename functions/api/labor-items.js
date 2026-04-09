export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(
      'SELECT id, description, hours FROM labor_items ORDER BY created_at ASC'
    ).all();
    const parsed = results.map(r => ({
      id: r.id,
      description: r.description,
      hours: safeParseHours(r.hours)
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
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await context.env.DB.prepare(
      'INSERT INTO labor_items (id, description, hours, cost, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(id, description, JSON.stringify(hours), 0, now, now).run();
    return Response.json({ id, description, hours }, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

function safeParseHours(s) {
  if (!s) return {};
  try { const o = JSON.parse(s); return o && typeof o === 'object' ? o : {}; } catch { return {}; }
}

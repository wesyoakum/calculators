export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(
      'SELECT id, description, cost FROM dm_items ORDER BY created_at DESC'
    ).all();
    return Response.json(results);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const description = (body.description || '').toString();
    const cost = Number(body.cost) || 0;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await context.env.DB.prepare(
      'INSERT INTO dm_items (id, description, cost, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(id, description, cost, now, now).run();
    return Response.json({ id, description, cost }, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

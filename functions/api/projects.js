export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(
      'SELECT id, name, updated_at FROM projects ORDER BY updated_at DESC'
    ).all();
    return Response.json(results);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const { name, data } = await context.request.json();
    if (!name || !data) {
      return Response.json({ error: 'name and data are required' }, { status: 400 });
    }
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await context.env.DB.prepare(
      'INSERT INTO projects (id, name, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(id, name, JSON.stringify(data), now, now).run();
    return Response.json({ id, name, created_at: now, updated_at: now }, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

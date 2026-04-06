export async function onRequestGet(context) {
  try {
    const id = context.params.id;
    const row = await context.env.DB.prepare(
      'SELECT * FROM projects WHERE id = ?'
    ).bind(id).first();
    if (!row) return Response.json({ error: 'Not found' }, { status: 404 });
    row.data = JSON.parse(row.data);
    return Response.json(row);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function onRequestPut(context) {
  try {
    const id = context.params.id;
    const body = await context.request.json();
    const existing = await context.env.DB.prepare(
      'SELECT id FROM projects WHERE id = ?'
    ).bind(id).first();
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 });

    const now = new Date().toISOString();
    const sets = [];
    const vals = [];
    if (body.name) { sets.push('name = ?'); vals.push(body.name); }
    if (body.data) { sets.push('data = ?'); vals.push(JSON.stringify(body.data)); }
    sets.push('updated_at = ?'); vals.push(now);
    vals.push(id);

    await context.env.DB.prepare(
      `UPDATE projects SET ${sets.join(', ')} WHERE id = ?`
    ).bind(...vals).run();
    return Response.json({ id, updated_at: now });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function onRequestDelete(context) {
  try {
    const id = context.params.id;
    const result = await context.env.DB.prepare(
      'DELETE FROM projects WHERE id = ?'
    ).bind(id).run();
    if (result.meta.changes === 0) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

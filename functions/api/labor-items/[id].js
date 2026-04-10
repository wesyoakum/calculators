export async function onRequestPut(context) {
  try {
    const id = context.params.id;
    const body = await context.request.json();
    const existing = await context.env.DB.prepare(
      'SELECT id FROM labor_items WHERE id = ?'
    ).bind(id).first();
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 });

    const now = new Date().toISOString();
    const sets = [];
    const vals = [];
    if (body.description !== undefined) { sets.push('description = ?'); vals.push(body.description.toString()); }
    if (body.hours !== undefined) {
      const h = body.hours && typeof body.hours === 'object' ? body.hours : {};
      sets.push('hours = ?'); vals.push(JSON.stringify(h));
    }
    if (body.rates !== undefined) {
      const r = body.rates && typeof body.rates === 'object' ? body.rates : {};
      sets.push('rates = ?'); vals.push(JSON.stringify(r));
    }
    sets.push('updated_at = ?'); vals.push(now);
    vals.push(id);

    await context.env.DB.prepare(
      `UPDATE labor_items SET ${sets.join(', ')} WHERE id = ?`
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
      'DELETE FROM labor_items WHERE id = ?'
    ).bind(id).run();
    if (result.meta.changes === 0) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

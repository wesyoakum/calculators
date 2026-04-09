CREATE TABLE IF NOT EXISTS projects (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  data       TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at DESC);

CREATE TABLE IF NOT EXISTS dm_items (
  id          TEXT PRIMARY KEY,
  description TEXT NOT NULL DEFAULT '',
  cost        REAL NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_dm_items_created_at ON dm_items(created_at);

CREATE TABLE IF NOT EXISTS labor_items (
  id          TEXT PRIMARY KEY,
  description TEXT NOT NULL DEFAULT '',
  hours       TEXT NOT NULL DEFAULT '{}',
  cost        REAL NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_labor_items_created_at ON labor_items(created_at);

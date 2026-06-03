const Database = require("better-sqlite3");

const db = new Database("jobs.db");

db.exec(`
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  country TEXT,
  search_group TEXT,

  source TEXT,
  title TEXT,
  company TEXT,
  location TEXT,
  description TEXT,
  url TEXT UNIQUE,

  salary INTEGER,
  date TEXT,

  stack TEXT
)
`);

module.exports = db;
const db = require("./db");

const result = db.prepare(`
  SELECT search_group, COUNT(*) as count
  FROM jobs
  GROUP BY search_group
  ORDER BY count DESC
`).all();

console.table(result);
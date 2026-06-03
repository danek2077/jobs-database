const db = require("./db");

const jobs = db.prepare(`
  SELECT *
  FROM jobs
  WHERE country = ?
  AND search_group = ?
  LIMIT 5
`).all("FR", "frontend");

console.log(jobs);
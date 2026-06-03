const db = require("./db");

const row = db.prepare(`
  SELECT *
  FROM jobs
  LIMIT 1
`).get();

console.log(row);
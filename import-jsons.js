const fs = require("fs");
const db = require("./db");

const FILES = [
  {
    file: "fr-frontend.json",
    country: "FR",
    search_group: "frontend",
  },

  {
    file: "fr-fullstack.json",
    country: "FR",
    search_group: "fullstack",
  },

  {
    file: "fr-next.json",
    country: "FR",
    search_group: "next",
  },

  {
    file: "fr-react.json",
    country: "FR",
    search_group: "react",
  },

  {
    file: "fr-web.json",
    country: "FR",
    search_group: "web",
  },
];

const insertJob = db.prepare(`
INSERT OR IGNORE INTO jobs (
  country,
  search_group,

  source,
  title,
  company,
  location,
  description,
  url,
  salary,
  date,
  stack
)
VALUES (
  @country,
  @search_group,

  @source,
  @title,
  @company,
  @location,
  @description,
  @url,
  @salary,
  @date,
  @stack
)
`);

for (const config of FILES) {
    const jobs = JSON.parse(
      fs.readFileSync(config.file, "utf8")
    );
  
    console.log(
      `Loading ${config.file} (${jobs.length})`
    );
  
    for (const job of jobs) {
      insertJob.run({
        country: config.country,
        search_group: config.search_group,
  
        source: job.source || null,
        title: job.title || null,
        company: job.company || null,
        location: job.location || null,
        description: job.description || null,
        url: job.url || null,
        salary: job.salary || null,
        date: job.date || null,
  
        stack: JSON.stringify(job.stack || []),
      });
    }
  }
  
  console.log("Import finished");


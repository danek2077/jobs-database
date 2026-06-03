const fs = require("fs");

const files = [
  "fr-frontend.json",
  "fr-fullstack.json",
  "fr-next.json",
  "fr-react.json",
  "fr-web.json",
];

const SEARCH_GROUPS = {
  frontend: [
    "Frontend Engineer",
    "Frontend Developer",
    "Front End Developer",
    "Front-End Engineer",
    "Développeur Frontend",
    "Développeur Front-End",
    "Ingénieur Frontend",
  ],
  react: [
    "React Developer",
    "React Engineer",
    "Développeur React",
    "React JS",
    "ReactJS",
  ],
  next: [
    "Next.js",
    "NextJS",
    "Next Developer",
    "Développeur Next.js",
  ],
  fullstack: [
    "Full Stack Developer",
    "Fullstack Developer",
    "Full Stack Engineer",
    "JavaScript Developer",
    "TypeScript Developer",
    "Node.js Developer",
  ],
};

const TECH_ALIASES = {
  NodeJS: "Node.js",
  NextJS: "Next.js",
  "Next Js": "Next.js",
  "Vue.js": "Vue",
  "ReactJS": "React",
  "React JS": "React",
  "Nest.js": "NestJS",
  "Amazon Web Services": "AWS",
  "Microsoft Azure": "Azure",
  Postgres: "PostgreSQL",
  "Tailwind CSS": "Tailwind",
};

const TECH_DICTIONARY = [
  "JavaScript",
  "TypeScript",
  "ECMAScript",
  "ES6",
  "HTML",
  "CSS",
  "HTML5",
  "CSS3",

  "React",
  "Angular",
  "Vue",
  "Vue.js",
  "Svelte",
  "SolidJS",
  "Preact",
  "Alpine.js",
  "Ember",
  "Backbone",
  "jQuery",

  "Next.js",
  "NextJS",
  "Next Js",
  "Nuxt.js",
  "Nuxt",
  "SvelteKit",
  "Remix",
  "Astro",
  "Gatsby",
  "Qwik",

  "Redux",
  "Redux Toolkit",
  "RTK",
  "Zustand",
  "MobX",
  "Recoil",
  "Jotai",
  "XState",
  "Pinia",
  "Vuex",
  "NgRx",
  "Effector",

  "Tailwind",
  "Tailwind CSS",
  "Bootstrap",
  "Sass",
  "SCSS",
  "Less",
  "Stylus",
  "Styled Components",
  "Emotion",
  "Linaria",
  "Vanilla Extract",

  "Material UI",
  "MUI",
  "Ant Design",
  "AntD",
  "Shadcn",
  "shadcn/ui",
  "Radix",
  "Radix UI",
  "DaisyUI",
  "Chakra UI",
  "Bulma",
  "Semantic UI",
  "PrimeVue",

  "Webpack",
  "Vite",
  "Turbopack",
  "Rollup",
  "Parcel",
  "Esbuild",
  "Babel",
  "SWC",
  "Rspack",

  "Jest",
  "Vitest",
  "Cypress",
  "Playwright",
  "Puppeteer",
  "Selenium",
  "Testing Library",
  "React Testing Library",
  "Mocha",
  "Chai",
  "Enzyme",
  "Storybook",
  "Chromatic",

  "Node.js",
  "NodeJS",
  "Express",
  "NestJS",
  "Nest.js",
  "Fastify",
  "Koa",

  "GraphQL",
  "Apollo",
  "Apollo Client",
  "Apollo Server",
  "Relay",
  "tRPC",
  "REST",
  "RESTful",
  "WebSockets",
  "Socket.io",

  "Firebase",
  "Supabase",
  "Prisma",
  "Drizzle",
  "Mongoose",
  "Sequelize",
  "TypeORM",

  "PostgreSQL",
  "Postgres",
  "MongoDB",
  "MySQL",
  "MariaDB",
  "SQLite",
  "Redis",
  "ElasticSearch",
  "OpenSearch",

  "Docker",
  "Docker Compose",
  "Kubernetes",
  "K8s",
  "AWS",
  "Amazon Web Services",
  "Azure",
  "Microsoft Azure",
  "GCP",
  "Google Cloud",
  "Cloudflare",
  "CloudFront",
  "Vercel",
  "Netlify",
  "Heroku",
  "DigitalOcean",

  "GitHub Actions",
  "GitLab CI",
  "GitLab CI/CD",
  "Jenkins",
  "CircleCI",
  "Bitbucket Pipelines",

  "Nginx",
  "Apache",

  "React Native",
  "Expo",
  "Electron",
  "Tauri",
  "Flutter",
  "Ionic",
  "Cordova",

  "Git",
  "GitFlow",
  "Monorepo",
  "Lerna",
  "Nx",
  "Turborepo",
  "Yarn",
  "NPM",
  "PNPM",

  "ESLint",
  "Prettier",
  "Stylelint",
  "Husky",
  "lint-staged",

  "Sentry",
  "Datadog",
  "New Relic",
  "Google Analytics",
  "GA4",
  "Google Tag Manager",
  "GTM",
  "Mixpanel",
  "Amplitude",
  "Hotjar",

  "CI/CD",
  "Agile",
  "Scrum",
  "Kanban",
  "TDD",
  "BDD",
  "OOP",
  "SOLID",
  "Design Patterns",

  "PWA",
  "SSR",
  "SSG",
  "ISR",
  "CSR",
  "RSC",
  "Server Components",
  "Server Actions",

  "Microfrontends",
  "Module Federation",

  "Figma",
  "Adobe XD",

  "OAuth",
  "JWT",
  "NextAuth",
  "Auth0",
  "Keycloak",

  "WebRTC",

  "Accessibility",
  "A11Y",

  "Responsive Design",

  "Performance Optimization",
  "Code Splitting",
  "Lazy Loading",
  "Hydration",

  "OpenAPI",
  "Swagger",

  "RabbitMQ",
  "Kafka",

  "Linux",
  "Ubuntu",

  "Pimcore",
  "WordPress",
  "Drupal",
  "Strapi",
  "Contentful",
];

const CORE_TECHS = [
  "React",
  "Angular",
  "Vue",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "NestJS",
  "GraphQL",
  "Docker",
  "AWS",
  "Azure",
  "GCP",
  "Kubernetes",
  "PostgreSQL",
  "MongoDB",
  "MySQL",
  "Redis",
  "React Native",
  "Redux",
  "Zustand",
  "Tailwind",
  "Material UI",
  "MUI",
  "Storybook",
  "Jest",
  "Vitest",
  "Cypress",
  "Playwright",
  "Webpack",
  "Vite",
  "Git",
  "GitHub Actions",
];

const MEANINGFUL_COMBO_TECHS = new Set([
  "React",
  "Angular",
  "Vue",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "NestJS",
  "Express",
  "GraphQL",
  "Apollo",
  "Redux",
  "Zustand",
  "React Native",
  "Tailwind",
  "Material UI",
  "MUI",
  "Storybook",
  "Jest",
  "Vitest",
  "Cypress",
  "Playwright",
  "Docker",
  "AWS",
  "Azure",
  "GCP",
  "Kubernetes",
  "PostgreSQL",
  "MongoDB",
  "MySQL",
  "Redis",
  "Vite",
  "Webpack",
  "Git",
  "GitHub Actions",
  "Firebase",
  "Supabase",
  "Prisma",
  "Drizzle",
  "REST",
  "SSR",
  "SSR",
  "SSG",
  "PWA",
  "OAuth",
  "JWT",
  "Webpack",
  "Babel",
  "SWC",
]);

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeTechName(skill) {
  return TECH_ALIASES[skill] || skill;
}

function buildSkillRegex(skill) {
  const escaped = escapeRegex(skill);
  return new RegExp(`(^|[^A-Za-z0-9])${escaped}($|[^A-Za-z0-9])`, "i");
}

const TECH_PATTERNS = TECH_DICTIONARY.map((skill) => ({
  original: skill,
  canonical: normalizeTechName(skill),
  regex: buildSkillRegex(skill),
}));

function extractSkills(text, patterns) {
  const source = text || "";
  const found = new Set();

  for (const pattern of patterns) {
    if (pattern.regex.test(source)) {
      found.add(pattern.canonical);
    }
  }

  return [...found];
}

function normalizeKeyPart(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function makeJobKey(job) {
  if (job.url) {
    return normalizeKeyPart(job.url);
  }

  return [
    normalizeKeyPart(job.title),
    normalizeKeyPart(job.company),
    normalizeKeyPart(job.location),
  ].join("|");
}

function extractSalary(job) {
  const directSalary = Number(job.salary);
  if (Number.isFinite(directSalary) && directSalary > 0) {
    return directSalary;
  }

  const minSalary = Number(job.salary_min ?? job.min_salary ?? job.salary?.min);
  const maxSalary = Number(job.salary_max ?? job.max_salary ?? job.salary?.max);

  if (
    Number.isFinite(minSalary) &&
    Number.isFinite(maxSalary) &&
    minSalary > 0 &&
    maxSalary > 0
  ) {
    return (minSalary + maxSalary) / 2;
  }

  if (Number.isFinite(minSalary) && minSalary > 0) {
    return minSalary;
  }

  if (Number.isFinite(maxSalary) && maxSalary > 0) {
    return maxSalary;
  }

  return null;
}

function formatPercent(value, total) {
  if (!total) return "0.0%";
  return `${((value / total) * 100).toFixed(1)}%`;
}

function buildCombinations(items, minSize = 3, maxSize = 4) {
  const results = [];

  function backtrack(start, current, targetSize) {
    if (current.length === targetSize) {
      results.push([...current]);
      return;
    }

    for (let i = start; i < items.length; i++) {
      current.push(items[i]);
      backtrack(i + 1, current, targetSize);
      current.pop();
    }
  }

  for (let size = minSize; size <= maxSize; size++) {
    if (items.length >= size) {
      backtrack(0, [], size);
    }
  }

  return results;
}

// =======================
// LOAD ALL JOBS
// =======================

let allJobs = [];

for (const file of files) {
  const jobs = JSON.parse(fs.readFileSync(file, "utf-8"));
  const category = file.replace(".json", "").replace("fr-", "");

  allJobs.push(
    ...jobs.map((job) => {
      const text = `${job.title || ""} ${job.description || ""}`;

      return {
        ...job,
        category,
        stack: extractSkills(text, TECH_PATTERNS),
      };
    })
  );
}

const totalJobs = allJobs.length;

// =======================
// DEDUPLICATION
// =======================

const jobsMap = new Map();

for (const job of allJobs) {
  const key = makeJobKey(job);

  if (!jobsMap.has(key)) {
    jobsMap.set(key, {
      ...job,
      categories: [job.category],
    });
  } else {
    const existing = jobsMap.get(key);

    existing.stack = [...new Set([...existing.stack, ...job.stack])];
    existing.categories = [...new Set([...existing.categories, job.category])];
  }
}

const uniqueJobs = [...jobsMap.values()];
const duplicatesRemoved = totalJobs - uniqueJobs.length;

// =======================
// ROLE DISTRIBUTION
// =======================

const roleDistribution = {};

for (const job of uniqueJobs) {
  for (const category of job.categories) {
    roleDistribution[category] = (roleDistribution[category] || 0) + 1;
  }
}

// =======================
// TOP TECHNOLOGIES
// =======================

const techStats = {};

for (const job of uniqueJobs) {
  for (const tech of job.stack) {
    techStats[tech] = (techStats[tech] || 0) + 1;
  }
}

const topTech = Object.entries(techStats).sort((a, b) => b[1] - a[1]);

// =======================
// CORE TECHNOLOGIES
// =======================

const coreTechStats = Object.entries(techStats)
  .filter(([tech]) => CORE_TECHS.includes(tech))
  .sort((a, b) => b[1] - a[1]);

// =======================
// TECHNOLOGIES BY CATEGORY
// =======================

const techByCategory = {};

for (const job of uniqueJobs) {
  for (const category of job.categories) {
    if (!techByCategory[category]) {
      techByCategory[category] = {};
    }

    for (const tech of job.stack) {
      techByCategory[category][tech] =
        (techByCategory[category][tech] || 0) + 1;
    }
  }
}

// =======================
// LOCATIONS
// =======================

const locationStats = {};

for (const job of uniqueJobs) {
  let location = (job.location || "Unknown").trim();

  if (!location) {
    location = "Unknown";
  }

  locationStats[location] = (locationStats[location] || 0) + 1;
}

const topLocations = Object.entries(locationStats)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15);

// =======================
// REMOTE / HYBRID / ONSITE
// =======================

const remotePatterns = [
  /\bremote\b/i,
  /\bfull\s*remote\b/i,
  /\bfully\s*remote\b/i,
  /\bremote[-\s]?first\b/i,
  /\btélétravail\b/i,
  /\b100%\s*télétravail\b/i,
  /\bwork\s*from\s*home\b/i,
];

const hybridPatterns = [
  /\bhybrid\b/i,
  /\bhybride\b/i,
];

const workMode = {
  remote: 0,
  hybrid: 0,
  onsite: 0,
};

for (const job of uniqueJobs) {
  const text = `
    ${job.title || ""}
    ${job.description || ""}
    ${job.location || ""}
  `;

  const isRemote = remotePatterns.some((pattern) => pattern.test(text));
  const isHybrid = hybridPatterns.some((pattern) => pattern.test(text));

  if (isRemote) {
    workMode.remote++;
  } else if (isHybrid) {
    workMode.hybrid++;
  } else {
    workMode.onsite++;
  }
}

// =======================
// TOP COMPANIES
// =======================

const companyStats = {};

for (const job of uniqueJobs) {
  const company = job.company?.trim() || "Unknown";
  companyStats[company] = (companyStats[company] || 0) + 1;
}

const topCompanies = Object.entries(companyStats)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15);

// =======================
// SALARY STATS
// =======================

const salaries = [];

for (const job of uniqueJobs) {
  const salary = extractSalary(job);
  if (salary !== null) {
    salaries.push(salary);
  }
}

let avgSalary = null;
let medianSalary = null;
let maxSalary = null;

if (salaries.length > 0) {
  salaries.sort((a, b) => a - b);

  avgSalary = salaries.reduce((a, b) => a + b, 0) / salaries.length;
  medianSalary = salaries[Math.floor(salaries.length / 2)];
  maxSalary = salaries[salaries.length - 1];
}

// =======================
// FRAMEWORK OVERVIEW
// =======================

const frameworkStats = {
  React: 0,
  Angular: 0,
  Vue: 0,
  "Next.js": 0,
};

for (const job of uniqueJobs) {
  const stack = new Set(job.stack);

  if (stack.has("React")) frameworkStats.React++;
  if (stack.has("Angular")) frameworkStats.Angular++;
  if (stack.has("Vue")) frameworkStats.Vue++;
  if (stack.has("Next.js")) frameworkStats["Next.js"]++;
}

// =======================
// TECH COMBINATIONS (3+)
// =======================

const comboStats = {};

for (const job of uniqueJobs) {
  const normalized = [...new Set(job.stack)]
    .filter((tech) => MEANINGFUL_COMBO_TECHS.has(tech))
    .sort();

  if (normalized.length < 3) continue;

  const combos = buildCombinations(normalized, 3, 4);
  const seenInJob = new Set();

  for (const combo of combos) {
    const key = combo.join(" + ");
    seenInJob.add(key);
  }

  for (const key of seenInJob) {
    comboStats[key] = (comboStats[key] || 0) + 1;
  }
}

const topCombinations = Object.entries(comboStats)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20);

// =======================
// REPORT
// =======================

console.log("\n================================");
console.log("MARKET REPORT - FRANCE");
console.log("================================\n");

console.log(`Total Jobs: ${totalJobs}`);
console.log(`Unique Jobs: ${uniqueJobs.length}`);
console.log(`Duplicates Removed: ${duplicatesRemoved}`);

console.log("\n--------------------------------");
console.log("Search Queries");
console.log("--------------------------------\n");

for (const [group, queries] of Object.entries(SEARCH_GROUPS)) {
  console.log(`${group.toUpperCase()} (${queries.length})`);
  for (const query of queries) {
    console.log(`  - ${query}`);
  }
  console.log("");
}

console.log("--------------------------------");
console.log("Role Distribution");
console.log("--------------------------------\n");

Object.entries(roleDistribution)
  .sort((a, b) => b[1] - a[1])
  .forEach(([role, count]) => {
    console.log(`${role}: ${count}`);
  });

console.log("\n--------------------------------");
console.log("Top Technologies");
console.log("--------------------------------\n");

topTech.slice(0, 20).forEach(([tech, count]) => {
  console.log(`${tech}: ${count}`);
});

console.log("\n--------------------------------");
console.log("Core Technologies");
console.log("--------------------------------\n");

coreTechStats.slice(0, 20).forEach(([tech, count]) => {
  console.log(`${tech}: ${count}`);
});

console.log("\n--------------------------------");
console.log("Framework Overview");
console.log("--------------------------------\n");

Object.entries(frameworkStats)
  .sort((a, b) => b[1] - a[1])
  .forEach(([framework, count]) => {
    console.log(`${framework}: ${count}`);
  });

console.log("\n--------------------------------");
console.log("Top Tech Combinations (3+)");
console.log("--------------------------------\n");

topCombinations.forEach(([combo, count]) => {
  console.log(`${combo}: ${count}`);
});

console.log("\n--------------------------------");
console.log("Top Locations");
console.log("--------------------------------\n");

topLocations.forEach(([loc, count]) => {
  console.log(`${loc}: ${count}`);
});

console.log("\n--------------------------------");
console.log("Remote Jobs");
console.log("--------------------------------\n");

const totalModes = workMode.remote + workMode.hybrid + workMode.onsite;

console.log(`Remote: ${formatPercent(workMode.remote, totalModes)}`);
console.log(`Hybrid: ${formatPercent(workMode.hybrid, totalModes)}`);
console.log(`Onsite: ${formatPercent(workMode.onsite, totalModes)}`);

console.log("\n--------------------------------");
console.log("Top Companies");
console.log("--------------------------------\n");

topCompanies.forEach(([company, count]) => {
  console.log(`${company}: ${count}`);
});

if (salaries.length > 0) {
  console.log("\n--------------------------------");
  console.log("Salary Statistics");
  console.log("--------------------------------\n");

  console.log(`Average Salary: ${Math.round(avgSalary)}`);
  console.log(`Median Salary: ${Math.round(medianSalary)}`);
  console.log(`Top Salary: ${Math.round(maxSalary)}`);
}

console.log("\n--------------------------------");
console.log("Technologies By Category");
console.log("--------------------------------\n");

for (const [category, techs] of Object.entries(techByCategory)) {
  console.log(category.toUpperCase());

  Object.entries(techs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([tech, count]) => {
      console.log(`  ${tech}: ${count}`);
    });

  console.log("");
}
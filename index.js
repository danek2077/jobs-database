const fs = require("fs");
const path = require("path");

const DATA_FILE = process.argv[2] || "frontend-europe.json";

const SEARCH_GROUPS = {
  frontend: [
    "Frontend Developer",
    "Frontend Engineer",
    "Front End Developer",
    "Front End Engineer",
    "Front-End Developer",
    "Front-End Engineer",
    "Frontend Software Engineer",
    "Frontend Software Developer",
  ],

  react: [
    "React Developer",
    "React Engineer",
    "ReactJS Developer",
    "React JS Developer",
    "Senior React Developer",
    "Frontend React Developer",
  ],

  next: [
    "Next.js Developer",
    "Next.js Engineer",
    "NextJS Developer",
    "NextJS Engineer",
    "Frontend Next.js Developer",
  ],

  fullstack: [
    "Full Stack Developer",
    "Full Stack Engineer",
    "Fullstack Developer",
    "Fullstack Engineer",
    "JavaScript Developer",
    "TypeScript Developer",
    "Node.js Developer",
    "Node.js Engineer",
    "Full Stack JavaScript Developer",
    "Full Stack TypeScript Developer",
  ],

  web: [
    "Web Developer",
    "Web Engineer",
    "UI Developer",
    "UI Engineer",
    "JavaScript Developer",
    "JavaScript Engineer",
  ],
};

const COUNTRY_NAMES = {
  gb: "United Kingdom",
  fr: "France",
  de: "Germany",
  nl: "Netherlands",
  be: "Belgium",
  it: "Italy",
  at: "Austria",
  ch: "Switzerland",
  ie: "Ireland",
};

const TECH_ALIASES = {
  NodeJS: "Node.js",
  "Node JS": "Node.js",
  NextJS: "Next.js",
  "Next Js": "Next.js",
  "Next.js": "Next.js",
  "Vue.js": "Vue",
  ReactJS: "React",
  "React JS": "React",
  "Nest.js": "NestJS",
  "Amazon Web Services": "AWS",
  "Microsoft Azure": "Azure",
  "Google Cloud Platform": "GCP",
  "Google Cloud": "GCP",
  Postgres: "PostgreSQL",
  "Tailwind CSS": "Tailwind",
  Kubernetes: "Kubernetes",
  K8s: "Kubernetes",
  ElasticSearch: "Elasticsearch",
  RESTful: "REST",
  "React Testing Library": "Testing Library",
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
  "ReactJS",
  "React JS",
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
  "Node JS",
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
  "Elasticsearch",
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
  "Google Cloud Platform",
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

const BUSINESS_DOMAINS = {
  SaaS: ["saas", "software as a service", "subscription platform", "subscription software", "cloud software", "b2b software"],
  B2B: ["b2b", "b-to-b", "btob", "business to business", "business customers", "enterprise customers", "for businesses", "business clients", "corporate clients"],
  B2C: ["b2c", "b-to-c", "btoc", "business to consumer", "consumer app", "consumer product", "end users", "customers worldwide"],
  CRM: ["crm", "customer relationship management", "sales platform", "sales enablement", "customer engagement", "customer success", "lead management"],
  ERP: ["erp", "enterprise resource planning", "business management software", "back office", "procurement", "inventory management"],
  FinTech: ["fintech", "banking", "payments", "payment", "financial services", "trading", "wealth management", "asset management", "investment", "lending", "credit", "loan", "mortgage", "neobank", "open banking", "crypto", "blockchain", "insurtech", "insurance", "accounting", "tax", "invoice", "billing"],
  HealthTech: ["healthtech", "health tech", "health care", "healthcare", "medical platform", "telemedicine", "hospital", "clinic", "patient", "digital health", "medtech", "pharma", "biotech", "clinical", "wellness", "nutrition"],
  EdTech: ["edtech", "e-learning", "elearning", "online learning", "education platform", "learning platform", "training platform", "lms", "school", "university", "student", "course", "upskilling"],
  ECommerce: ["ecommerce", "e-commerce", "e commerce", "online store", "online shop", "webshop", "marketplace", "retail platform", "retail", "commerce platform", "shopify", "checkout", "merchandising"],
  Marketplace: ["marketplace", "two sided marketplace", "two-sided marketplace", "platform connecting", "buyers and sellers", "classifieds", "on-demand platform", "booking marketplace"],
  AdTech: ["adtech", "ad tech", "advertising platform", "programmatic", "ad serving", "media buying", "dsp", "ssp", "ad exchange"],
  MarTech: ["martech", "marketing technology", "marketing automation", "campaign management", "email marketing", "customer data platform", "cdp", "growth platform", "loyalty", "personalisation", "personalization"],
  HRTech: ["hrtech", "hr tech", "recruitment platform", "talent acquisition", "human resources", "people platform", "payroll", "workforce management", "employee experience", "applicant tracking", "ats", "staffing"],
  LegalTech: ["legaltech", "legal tech", "legal services", "compliance platform", "contract management", "regtech", "regulatory", "kyc", "aml", "risk management", "governance"],
  CyberSecurity: ["cybersecurity", "cyber security", "security platform", "identity management", "fraud prevention", "infosec", "authentication", "authorization", "zero trust", "iam", "soc", "threat", "vulnerability", "penetration testing"],
  AI: ["artificial intelligence", "machine learning", "generative ai", "genai", "llm", "large language model", "ai platform", "data science", "computer vision", "nlp", "predictive analytics", "recommendation engine", "automation platform"],
  DevTools: ["developer platform", "developer tools", "devtools", "devops platform", "engineering productivity", "api platform", "cloud infrastructure", "observability", "monitoring platform", "ci/cd platform", "low-code", "no-code", "open source"],
  Logistics: ["logistics", "supply chain", "transportation platform", "fleet management", "warehouse", "shipping", "freight", "last mile", "mobility", "route optimization", "fulfilment", "fulfillment"],
  TravelTech: ["travel", "traveltech", "travel tech", "booking platform", "hospitality", "hotel", "airline", "tourism", "holiday", "vacation", "accommodation", "restaurant", "event booking"],
  RealEstate: ["real estate", "property management", "proptech", "property tech", "housing", "rental", "lettings", "mortgage", "construction", "building management", "facility management"],
  Gaming: ["gaming", "video game", "game platform", "games", "esports", "game server", "minecraft", "ark", "rust", "unity", "unreal engine"],
  Media: ["media", "streaming", "video platform", "publishing", "news", "broadcast", "content platform", "entertainment", "music", "podcast", "creator platform"],
  Telecom: ["telecom", "telecommunications", "connectivity", "broadband", "fiber", "5g", "iot", "internet of things", "network operator"],
  Energy: ["energy", "cleantech", "clean tech", "renewable", "solar", "wind", "electric vehicle", "ev charging", "smart grid", "climate tech", "carbon", "sustainability", "circular economy"],
  Automotive: ["automotive", "car", "vehicle", "mobility", "autonomous driving", "connected vehicle", "fleet", "ev", "leasing"],
  PublicSector: ["public sector", "government", "govtech", "civic tech", "municipality", "european commission", "public institution", "defence", "defense"],
  Consulting: ["consulting", "digital agency", "software agency", "it services", "professional services", "systems integrator", "consultancy"],
  Adult: ["adult content", "onlyfans", "adult entertainment", "nsfw", "sex tech"],
};

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
  "SSG",
  "PWA",
  "OAuth",
  "JWT",
  "Babel",
  "SWC",
]);

function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeTechName(skill) {
  return TECH_ALIASES[skill] || skill;
}

function buildTermRegex(term) {
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegex(term)}($|[^\\p{L}\\p{N}])`, "iu");
}

const TECH_PATTERNS = TECH_DICTIONARY
  .slice()
  .sort((a, b) => b.length - a.length)
  .map((skill) => ({
    original: skill,
    canonical: normalizeTechName(skill),
    regex: buildTermRegex(skill),
  }));

const BUSINESS_DOMAIN_PATTERNS = Object.fromEntries(
  Object.entries(BUSINESS_DOMAINS).map(([domain, terms]) => [
    domain,
    terms.slice().sort((a, b) => b.length - a.length).map(buildTermRegex),
  ])
);

function cleanText(text) {
  return String(text || "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function extractSkills(text) {
  const source = cleanText(text);
  const found = new Set();

  for (const pattern of TECH_PATTERNS) {
    if (pattern.regex.test(source)) {
      found.add(pattern.canonical);
    }
  }

  return [...found];
}

function extractBusinessDomains(text) {
  const source = cleanText(text).toLowerCase();
  const found = [];

  for (const [domain, patterns] of Object.entries(BUSINESS_DOMAIN_PATTERNS)) {
    if (patterns.some((pattern) => pattern.test(source))) {
      found.push(domain);
    }
  }

  return found;
}

function normalizeKeyPart(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function makeJobKey(job) {
  const title = normalizeKeyPart(job.title);
  const company = normalizeKeyPart(job.company);
  const location = normalizeKeyPart(job.location);
  const country = normalizeKeyPart(job.country);

  if (title && company) {
    return [country, title, company, location].join("|");
  }

  return normalizeKeyPart(job.url).replace(/[?#].*$/, "");
}

function extractSalary(job) {
  const directSalary = Number(job.salary);
  if (Number.isFinite(directSalary) && directSalary > 0) {
    return directSalary;
  }

  const minSalary = Number(job.salary_min ?? job.min_salary ?? job.salary?.min);
  const maxSalary = Number(job.salary_max ?? job.max_salary ?? job.salary?.max);

  if (Number.isFinite(minSalary) && Number.isFinite(maxSalary) && minSalary > 0 && maxSalary > 0) {
    return (minSalary + maxSalary) / 2;
  }

  if (Number.isFinite(minSalary) && minSalary > 0) return minSalary;
  if (Number.isFinite(maxSalary) && maxSalary > 0) return maxSalary;

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
    if (items.length >= size) backtrack(0, [], size);
  }

  return results;
}

function countBy(items, keyFn) {
  const stats = {};

  for (const item of items) {
    const key = keyFn(item) || "Unknown";
    stats[key] = (stats[key] || 0) + 1;
  }

  return stats;
}

function sortedEntries(stats, limit = Infinity) {
  return Object.entries(stats)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit);
}

function printEntries(entries, total = null) {
  for (const [name, count] of entries) {
    const suffix = total ? ` (${formatPercent(count, total)})` : "";
    console.log(`${name}: ${count}${suffix}`);
  }
}

const dataPath = path.resolve(DATA_FILE);
const rawJobs = JSON.parse(fs.readFileSync(dataPath, "utf8"));

if (!Array.isArray(rawJobs)) {
  throw new Error(`${DATA_FILE} must contain a JSON array`);
}

const jobsMap = new Map();

for (const rawJob of rawJobs) {
  const analysisText = [
    rawJob.title,
    rawJob.company,
    rawJob.location,
    rawJob.description,
  ].join(" ");

  const extractedStack = extractSkills(analysisText);
  const persistedStack = Array.isArray(rawJob.stack)
    ? rawJob.stack.filter((tech) => tech && tech !== "Not specified").map(normalizeTechName)
    : [];

  const extractedDomains = extractBusinessDomains(analysisText);

  const job = {
    ...rawJob,
    stack: [...new Set([...persistedStack, ...extractedStack])].sort(),
    business_domains: [...new Set(extractedDomains)].sort(),
  };

  if (job.stack.length === 0) job.stack = ["Not specified"];
  if (job.business_domains.length === 0) job.business_domains = ["Unknown"];

  const key = makeJobKey(job);

  if (!jobsMap.has(key)) {
    jobsMap.set(key, job);
  } else {
    const existing = jobsMap.get(key);
    existing.stack = [...new Set([...existing.stack, ...job.stack])].filter((tech) => tech !== "Not specified").sort();
    existing.business_domains = [...new Set([...existing.business_domains, ...job.business_domains])]
      .filter((domain) => domain !== "Unknown")
      .sort();
    if (existing.stack.length === 0) existing.stack = ["Not specified"];
    if (existing.business_domains.length === 0) existing.business_domains = ["Unknown"];
  }
}

const uniqueJobs = [...jobsMap.values()];
const totalJobs = rawJobs.length;
const duplicatesRemoved = totalJobs - uniqueJobs.length;

const countryStats = countBy(uniqueJobs, (job) => COUNTRY_NAMES[job.country] || job.country || "Unknown");
const locationStats = countBy(uniqueJobs, (job) => String(job.location || "Unknown").trim() || "Unknown");
const companyStats = countBy(uniqueJobs, (job) => String(job.company || "Unknown").trim() || "Unknown");

const techStats = {};
const coreTechStats = {};
const domainStats = {};
const techByCountry = {};
const domainsByCountry = {};

for (const job of uniqueJobs) {
  const country = COUNTRY_NAMES[job.country] || job.country || "Unknown";
  if (!techByCountry[country]) techByCountry[country] = {};
  if (!domainsByCountry[country]) domainsByCountry[country] = {};

  for (const tech of job.stack) {
    if (tech === "Not specified") continue;
    techStats[tech] = (techStats[tech] || 0) + 1;
    techByCountry[country][tech] = (techByCountry[country][tech] || 0) + 1;
    if (CORE_TECHS.includes(tech)) coreTechStats[tech] = (coreTechStats[tech] || 0) + 1;
  }

  for (const domain of job.business_domains) {
    domainStats[domain] = (domainStats[domain] || 0) + 1;
    domainsByCountry[country][domain] = (domainsByCountry[country][domain] || 0) + 1;
  }
}

const remotePatterns = [
  /\bremote\b/i,
  /\bfully\s*remote\b/i,
  /\bfull\s*remote\b/i,
  /\bremote[-\s]?first\b/i,
  /\bwork\s*from\s*home\b/i,
  /\bwfh\b/i,
  /\bhome\s*office\b/i,
  /\btelework\b/i,
  /\btelecommute\b/i,
  /\bt[eé]l[eé]travail\b/i,
  /\bremoto\b/i,
  /\bda\s*remoto\b/i,
  /\bfernarbeit\b/i,
  /\bthuiswerken\b/i,
  /\b100%\s*(remote|remoto|t[eé]l[eé]travail)\b/i,
];

const hybridPatterns = [
  /\bhybrid\b/i,
  /\bhybride\b/i,
  /\bibrido\b/i,
  /\bhybrides\b/i,
  /\bteilweise\s*remote\b/i,
  /\bpartly\s*remote\b/i,
  /\bflexible\s*working\b/i,
];

const workMode = { remote: 0, hybrid: 0, onsite: 0 };

for (const job of uniqueJobs) {
  const text = [job.title, job.description, job.location].join(" ");
  const isRemote = remotePatterns.some((pattern) => pattern.test(text));
  const isHybrid = hybridPatterns.some((pattern) => pattern.test(text));

  if (isRemote) workMode.remote++;
  else if (isHybrid) workMode.hybrid++;
  else workMode.onsite++;
}

const salaries = uniqueJobs.map(extractSalary).filter((salary) => salary !== null).sort((a, b) => a - b);
const avgSalary = salaries.length ? salaries.reduce((a, b) => a + b, 0) / salaries.length : null;
const medianSalary = salaries.length ? salaries[Math.floor((salaries.length - 1) / 2)] : null;
const maxSalary = salaries.length ? salaries[salaries.length - 1] : null;

const frameworkStats = {
  React: 0,
  Angular: 0,
  Vue: 0,
  "Next.js": 0,
  Svelte: 0,
};

for (const job of uniqueJobs) {
  const stack = new Set(job.stack);
  for (const framework of Object.keys(frameworkStats)) {
    if (stack.has(framework)) frameworkStats[framework]++;
  }
}

const comboStats = {};

for (const job of uniqueJobs) {
  const normalized = [...new Set(job.stack)]
    .filter((tech) => MEANINGFUL_COMBO_TECHS.has(tech))
    .sort();

  if (normalized.length < 3) continue;

  for (const combo of buildCombinations(normalized, 3, 4)) {
    const key = combo.join(" + ");
    comboStats[key] = (comboStats[key] || 0) + 1;
  }
}

const totalModes = workMode.remote + workMode.hybrid + workMode.onsite;

console.log("\n================================");
console.log("MARKET REPORT - EUROPE");
console.log("================================\n");

console.log(`Data File: ${DATA_FILE}`);
console.log(`Raw Jobs: ${totalJobs}`);
console.log(`Unique Jobs: ${uniqueJobs.length}`);
console.log(`Duplicates Removed: ${duplicatesRemoved}`);
console.log(`Jobs With Detected Tech: ${uniqueJobs.filter((job) => !job.stack.includes("Not specified")).length} (${formatPercent(uniqueJobs.filter((job) => !job.stack.includes("Not specified")).length, uniqueJobs.length)})`);
console.log(`Jobs With Detected Business Domain: ${uniqueJobs.filter((job) => !job.business_domains.includes("Unknown")).length} (${formatPercent(uniqueJobs.filter((job) => !job.business_domains.includes("Unknown")).length, uniqueJobs.length)})`);

console.log("\n--------------------------------");
console.log("Search Queries Covered By EU Collector");
console.log("--------------------------------\n");

for (const [group, queries] of Object.entries(SEARCH_GROUPS)) {
  console.log(`${group.toUpperCase()} (${queries.length})`);
  for (const query of queries) console.log(`  - ${query}`);
  console.log("");
}

console.log("--------------------------------");
console.log("Countries");
console.log("--------------------------------\n");
printEntries(sortedEntries(countryStats), uniqueJobs.length);

console.log("\n--------------------------------");
console.log("Top Technologies");
console.log("--------------------------------\n");
printEntries(sortedEntries(techStats, 25), uniqueJobs.length);

console.log("\n--------------------------------");
console.log("Core Technologies");
console.log("--------------------------------\n");
printEntries(sortedEntries(coreTechStats, 25), uniqueJobs.length);

console.log("\n--------------------------------");
console.log("Framework Overview");
console.log("--------------------------------\n");
printEntries(sortedEntries(frameworkStats), uniqueJobs.length);

console.log("\n--------------------------------");
console.log("Business Domains");
console.log("--------------------------------\n");
printEntries(sortedEntries(domainStats, 30), uniqueJobs.length);

console.log("\n--------------------------------");
console.log("Top Tech Combinations (3-4)");
console.log("--------------------------------\n");
printEntries(sortedEntries(comboStats, 20), uniqueJobs.length);

console.log("\n--------------------------------");
console.log("Top Locations");
console.log("--------------------------------\n");
printEntries(sortedEntries(locationStats, 20));

console.log("\n--------------------------------");
console.log("Remote / Hybrid / Onsite");
console.log("--------------------------------\n");
console.log(`Remote: ${workMode.remote} (${formatPercent(workMode.remote, totalModes)})`);
console.log(`Hybrid: ${workMode.hybrid} (${formatPercent(workMode.hybrid, totalModes)})`);
console.log(`Onsite/Unspecified: ${workMode.onsite} (${formatPercent(workMode.onsite, totalModes)})`);

console.log("\n--------------------------------");
console.log("Top Companies");
console.log("--------------------------------\n");
printEntries(sortedEntries(companyStats, 20));

if (salaries.length > 0) {
  console.log("\n--------------------------------");
  console.log("Salary Statistics (raw source currency/mixed EU currencies)");
  console.log("--------------------------------\n");
  console.log(`Salary Samples: ${salaries.length}`);
  console.log(`Average Salary: ${Math.round(avgSalary)}`);
  console.log(`Median Salary: ${Math.round(medianSalary)}`);
  console.log(`Top Salary: ${Math.round(maxSalary)}`);
}

console.log("\n--------------------------------");
console.log("Top Technologies By Country");
console.log("--------------------------------\n");

for (const [country, techs] of sortedEntries(countryStats)) {
  console.log(country.toUpperCase());
  printEntries(sortedEntries(techByCountry[country] || {}, 10));
  console.log("");
}

console.log("--------------------------------");
console.log("Top Business Domains By Country");
console.log("--------------------------------\n");

for (const [country] of sortedEntries(countryStats)) {
  console.log(country.toUpperCase());
  printEntries(sortedEntries(domainsByCountry[country] || {}, 10));
  console.log("");
}

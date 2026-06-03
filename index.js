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

const CANONICAL_COUNTRIES = {
  "United Kingdom": ["gb", "uk", "u.k.", "united kingdom", "great britain", "britain", "england", "scotland", "wales", "northern ireland"],
  France: ["fr", "france", "frankreich"],
  Germany: ["de", "germany", "deutschland", "alemania", "allemagne"],
  Netherlands: ["nl", "netherlands", "nederland", "holland", "the netherlands"],
  Belgium: ["be", "belgium", "belgique", "belgië", "belgie"],
  Italy: ["it", "italy", "italia", "italie"],
  Austria: ["at", "austria", "österreich", "osterreich"],
  Switzerland: ["ch", "switzerland", "schweiz", "suisse", "svizzera"],
  Ireland: ["ie", "ireland", "éire", "eire"],
};

const COUNTRY_ALIASES = Object.fromEntries(
  Object.entries(CANONICAL_COUNTRIES).flatMap(([canonical, aliases]) =>
    aliases.map((alias) => [alias.toLowerCase(), canonical])
  )
);

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

const COUNTRY_CURRENCY = {
  "United Kingdom": "GBP",
  Switzerland: "CHF",
  France: "EUR",
  Germany: "EUR",
  Netherlands: "EUR",
  Belgium: "EUR",
  Italy: "EUR",
  Austria: "EUR",
  Ireland: "EUR",
};

const EUR_EXCHANGE_RATES = {
  EUR: 1,
  GBP: 1.17,
  CHF: 1.06,
};

const TECH_ALIASES = {
  JS: "JavaScript",
  TS: "TypeScript",
  NodeJS: "Node.js",
  "Node JS": "Node.js",
  "Node.JS": "Node.js",
  NextJS: "Next.js",
  "Next Js": "Next.js",
  "Next.js": "Next.js",
  "Vue.js": "Vue",
  ReactJS: "React",
  "React JS": "React",
  "React.js": "React",
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
  "JS",
  "TS",
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

const TECH_CATEGORIES = {
  "Frontend Frameworks": ["React", "Angular", "Vue", "Next.js", "Svelte", "Preact", "SolidJS", "Nuxt", "Nuxt.js", "Remix", "Astro", "Gatsby"],
  "Backend Frameworks": ["Node.js", "Express", "NestJS", "Fastify", "Koa", "GraphQL", "Apollo", "tRPC"],
  "Cloud Providers": ["AWS", "Azure", "GCP", "Cloudflare", "Vercel", "Netlify", "Heroku", "DigitalOcean", "Firebase", "Supabase"],
  Databases: ["PostgreSQL", "MongoDB", "MySQL", "MariaDB", "SQLite", "Redis", "Elasticsearch", "OpenSearch"],
  "Testing Tools": ["Jest", "Vitest", "Cypress", "Playwright", "Puppeteer", "Selenium", "Testing Library", "Mocha", "Chai", "Storybook"],
  "CI/CD Tools": ["GitHub Actions", "GitLab CI", "GitLab CI/CD", "Jenkins", "CircleCI", "Bitbucket Pipelines", "Docker", "Kubernetes"],
  "State Management": ["Redux", "Redux Toolkit", "Zustand", "MobX", "Recoil", "Jotai", "XState", "Pinia", "Vuex", "NgRx", "Apollo Client"],
  "Styling Tools": ["Tailwind", "Bootstrap", "Sass", "SCSS", "Less", "Styled Components", "Emotion", "Material UI", "MUI", "Ant Design", "Chakra UI", "Radix UI", "DaisyUI"],
};

const ADOPTION_TECHS = ["React", "Angular", "Vue", "Next.js", "TypeScript", "Node.js"];
const SALARY_COUNTRIES = ["Germany", "United Kingdom", "France", "Belgium", "Austria", "Switzerland", "Netherlands", "Italy"];
const MIN_CONFIDENT_SAMPLE_SIZE = 10;

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

function stripDiacritics(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function titleCase(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((part) => {
      if (/^(uk|usa|eu)$/i.test(part)) return part.toUpperCase();
      return part ? part[0].toLocaleUpperCase("en-US") + part.slice(1) : part;
    })
    .join(" ");
}

function canonicalizeCountry(value) {
  const original = String(value || "").trim();
  const normalized = stripDiacritics(original).toLowerCase().replace(/\./g, "").trim();
  const direct = COUNTRY_ALIASES[original.toLowerCase()] || COUNTRY_ALIASES[normalized];
  if (direct) return { country: direct, original_country: original || "Unknown", confidence: "High" };

  for (const [alias, canonical] of Object.entries(COUNTRY_ALIASES)) {
    const aliasRegex = new RegExp(`(^|[^a-z])${escapeRegex(stripDiacritics(alias).replace(/\./g, ""))}([^a-z]|$)`, "i");
    if (aliasRegex.test(normalized)) {
      return { country: canonical, original_country: original || alias, confidence: "Medium" };
    }
  }

  return { country: original || "Unknown", original_country: original || "Unknown", confidence: original ? "Low" : "Low" };
}

const CITY_ALIASES = {
  zurich: "Zurich",
  zürich: "Zurich",
  munich: "Munich",
  münchen: "Munich",
  cologne: "Cologne",
  köln: "Cologne",
  nuremberg: "Nuremberg",
  nürnberg: "Nuremberg",
  brussels: "Brussels",
  bruxelles: "Brussels",
  brussel: "Brussels",
  wien: "Vienna",
  vienna: "Vienna",
};

const REGION_BY_CITY = {
  Paris: "Ile-de-France",
  London: "London",
  Berlin: "Berlin",
  Hamburg: "Hamburg",
  Munich: "Bavaria",
  Cologne: "North Rhine-Westphalia",
  Frankfurt: "Hesse",
  Amsterdam: "North Holland",
  Rotterdam: "South Holland",
  Brussels: "Brussels",
  Antwerp: "Flanders",
  Vienna: "Vienna",
  Zurich: "Zurich",
  Geneva: "Geneva",
  Milan: "Lombardy",
  Rome: "Lazio",
};

function normalizeCity(value) {
  const cleaned = String(value || "").trim().replace(/\s+/g, " ");
  const key = stripDiacritics(cleaned).toLowerCase();
  return CITY_ALIASES[cleaned.toLowerCase()] || CITY_ALIASES[key] || titleCase(cleaned);
}

function normalizeLocation(rawLocation, rawCountry) {
  const countryGuess = canonicalizeCountry(rawCountry);
  const original = String(rawLocation || "").trim();
  if (!original) {
    return {
      country: countryGuess.country,
      region: "Unknown",
      city: "Unknown",
      original_location: "Unknown",
      confidence: "Low",
    };
  }

  const parts = original.split(",").map((part) => part.trim()).filter(Boolean);
  let country = countryGuess.country;
  let confidence = countryGuess.confidence === "High" ? "High" : "Medium";
  const lastCountry = parts.length ? canonicalizeCountry(parts[parts.length - 1]) : null;

  if (lastCountry && lastCountry.country !== "Unknown" && lastCountry.confidence !== "Low") {
    country = lastCountry.country;
    if (parts.length > 1) parts.pop();
  }

  const city = normalizeCity(parts[0] || country);
  let region = parts[1] ? normalizeCity(parts[1]) : REGION_BY_CITY[city] || city;

  if (/^(uk|united kingdom|germany|france|belgium|netherlands|italy|austria|switzerland)$/i.test(region)) {
    region = REGION_BY_CITY[city] || city;
  }

  if (!parts[0] || city === country) confidence = "Low";
  else if (!REGION_BY_CITY[city] && parts.length < 2) confidence = "Medium";

  return {
    country,
    region,
    city,
    original_location: original,
    confidence,
  };
}

function confidenceForSampleCount(count) {
  if (count >= 30) return "High";
  if (count >= 10) return "Medium";
  return "Low";
}

function percentile(sortedValues, p) {
  if (!sortedValues.length) return null;
  const index = (sortedValues.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sortedValues[lower];
  return sortedValues[lower] + (sortedValues[upper] - sortedValues[lower]) * (index - lower);
}

function summarizeNumbers(values) {
  const sorted = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  if (!sorted.length) return null;
  return {
    count: sorted.length,
    average: sorted.reduce((sum, value) => sum + value, 0) / sorted.length,
    median: percentile(sorted, 0.5),
    p25: percentile(sorted, 0.25),
    p75: percentile(sorted, 0.75),
    p90: percentile(sorted, 0.9),
    confidence: confidenceForSampleCount(sorted.length),
  };
}

function formatCurrency(value) {
  if (!Number.isFinite(value)) return "n/a";
  return `€${Math.round(value).toLocaleString("en-US")}`;
}

function makeJobKey(job) {
  const title = normalizeKeyPart(job.title);
  const company = normalizeKeyPart(job.company);
  const location = normalizeKeyPart(job.location_normalized ? `${job.location_normalized.country}|${job.location_normalized.region}|${job.location_normalized.city}` : job.location);
  const country = normalizeKeyPart(job.country_canonical || job.country);

  if (title && company) {
    return [country, title, company, location].join("|");
  }

  return normalizeKeyPart(job.url).replace(/[?#].*$/, "");
}

function extractSalaryAmount(job) {
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

  const text = [job.salary_text, job.compensation, job.description, job.title].filter(Boolean).join(" ");
  const salaryMatch = cleanText(text).match(/(?:€|£|CHF|EUR|GBP)\s*([0-9][0-9.,]*)\s*(k|000)?(?:\s*[-–—to]+\s*(?:€|£|CHF|EUR|GBP)?\s*([0-9][0-9.,]*)\s*(k|000)?)?/i);
  if (!salaryMatch) return null;

  const parseAmount = (value, multiplierToken) => {
    const normalized = Number(String(value).replace(/,/g, ""));
    if (!Number.isFinite(normalized) || normalized <= 0) return null;
    return /k|000/i.test(multiplierToken || "") || normalized < 1000 ? normalized * 1000 : normalized;
  };

  const min = parseAmount(salaryMatch[1], salaryMatch[2]);
  const max = salaryMatch[3] ? parseAmount(salaryMatch[3], salaryMatch[4]) : null;
  if (min && max) return (min + max) / 2;
  return min;
}

function normalizeSalaryPeriod(amount, normalizedLocation) {
  if (!Number.isFinite(amount) || amount <= 0) return { amount: null, confidence: "Low" };
  if (amount >= 15000) return { amount, confidence: "High" };
  if (amount >= 1000) {
    const monthlyMultiplier = normalizedLocation.country === "Austria" ? 14 : 12;
    return { amount: amount * monthlyMultiplier, confidence: "Medium" };
  }
  if (amount >= 15 && amount <= 200) {
    return { amount: amount * 40 * 52, confidence: "Low" };
  }
  return { amount: null, confidence: "Low" };
}

function lowerConfidence(...levels) {
  if (levels.includes("Low")) return "Low";
  if (levels.includes("Medium")) return "Medium";
  return "High";
}

function detectSalaryCurrency(job, normalizedLocation) {
  const text = [job.salary_text, job.compensation, job.description, job.title].filter(Boolean).join(" ");
  if (/£|\bGBP\b|\bpounds?\b/i.test(text)) return { currency: "GBP", confidence: "High" };
  if (/\bCHF\b|\bSwiss francs?\b|\bFr\.\b/i.test(text)) return { currency: "CHF", confidence: "High" };
  if (/€|\bEUR\b|\beuros?\b/i.test(text)) return { currency: "EUR", confidence: "High" };

  const countryCurrency = COUNTRY_CURRENCY[normalizedLocation.country];
  if (countryCurrency) return { currency: countryCurrency, confidence: "Medium" };
  return { currency: "EUR", confidence: "Low" };
}

function normalizeSalary(job, normalizedLocation) {
  const amount = extractSalaryAmount(job);
  if (amount === null) {
    return {
      amount_original: null,
      currency_original: null,
      amount_eur: null,
      confidence: "Low",
    };
  }

  const periodicity = normalizeSalaryPeriod(amount, normalizedLocation);
  if (!periodicity.amount) {
    return {
      amount_original: amount,
      currency_original: null,
      amount_eur: null,
      confidence: "Low",
    };
  }

  const currency = detectSalaryCurrency(job, normalizedLocation);
  const rate = EUR_EXCHANGE_RATES[currency.currency] || 1;
  return {
    amount_original: amount,
    currency_original: currency.currency,
    amount_eur: periodicity.amount * rate,
    confidence: lowerConfidence(currency.confidence, periodicity.confidence),
  };
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
  const normalizedLocation = normalizeLocation(rawJob.location, rawJob.country);
  const normalizedSalary = normalizeSalary(rawJob, normalizedLocation);
  const countryInfo = canonicalizeCountry(rawJob.country);

  const job = {
    ...rawJob,
    country_original: countryInfo.original_country,
    country_canonical: normalizedLocation.country,
    country_confidence: countryInfo.confidence,
    location_original: normalizedLocation.original_location,
    location_normalized: {
      country: normalizedLocation.country,
      region: normalizedLocation.region,
      city: normalizedLocation.city,
    },
    location_confidence: normalizedLocation.confidence,
    salary_normalized: normalizedSalary,
    salary_confidence: normalizedSalary.confidence,
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

const countryStats = countBy(uniqueJobs, (job) => job.country_canonical || COUNTRY_NAMES[job.country] || job.country || "Unknown");
const sourceCountryStats = countBy(uniqueJobs, (job) => job.country_original || job.country || "Unknown");
const locationStats = countBy(uniqueJobs, (job) => {
  const location = job.location_normalized;
  return location ? `${location.country} / ${location.region} / ${location.city}` : "Unknown";
});
const companyStats = countBy(uniqueJobs, (job) => String(job.company || "Unknown").trim() || "Unknown");

const techStats = {};
const coreTechStats = {};
const domainStats = {};
const techByCountry = {};
const domainsByCountry = {};

for (const job of uniqueJobs) {
  const country = job.country_canonical || COUNTRY_NAMES[job.country] || job.country || "Unknown";
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

const salaryRecords = uniqueJobs
  .map((job) => ({ job, salary: job.salary_normalized }))
  .filter(({ salary }) => salary && Number.isFinite(salary.amount_eur) && salary.confidence !== "Low");
const salarySummary = summarizeNumbers(salaryRecords.map(({ salary }) => salary.amount_eur));
const salaryCurrencyStats = countBy(salaryRecords, ({ salary }) => salary.currency_original || "Unknown");
const salaryByCountry = {};
for (const country of SALARY_COUNTRIES) {
  const countrySalaries = salaryRecords
    .filter(({ job, salary }) => job.country_canonical === country && salary.confidence !== "Low")
    .map(({ salary }) => salary.amount_eur);
  if (countrySalaries.length >= MIN_CONFIDENT_SAMPLE_SIZE) {
    salaryByCountry[country] = summarizeNumbers(countrySalaries);
  }
}

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

const categoryStats = Object.fromEntries(Object.keys(TECH_CATEGORIES).map((category) => [category, {}]));
for (const job of uniqueJobs) {
  const stack = new Set(job.stack);
  for (const [category, techs] of Object.entries(TECH_CATEGORIES)) {
    for (const tech of techs) {
      if (stack.has(tech)) categoryStats[category][tech] = (categoryStats[category][tech] || 0) + 1;
    }
  }
}

const comboStats = {};

for (const job of uniqueJobs) {
  const stack = new Set(job.stack);
  if (stack.has("React") && stack.has("Angular") && stack.has("Vue")) continue;

  const normalized = [...stack]
    .filter((tech) => MEANINGFUL_COMBO_TECHS.has(tech))
    .sort();

  if (normalized.length < 3) continue;

  for (const combo of buildCombinations(normalized, 3, 3)) {
    const comboSet = new Set(combo);
    if (comboSet.has("React") && comboSet.has("Angular") && comboSet.has("Vue")) continue;
    const key = combo.join(" + ");
    comboStats[key] = (comboStats[key] || 0) + 1;
  }
}

for (const [key, count] of Object.entries(comboStats)) {
  if (count < MIN_CONFIDENT_SAMPLE_SIZE) delete comboStats[key];
}

const technologyAdoptionByCountry = {};
for (const [country, total] of Object.entries(countryStats)) {
  technologyAdoptionByCountry[country] = Object.fromEntries(
    ADOPTION_TECHS.map((tech) => {
      const count = (techByCountry[country] || {})[tech] || 0;
      return [tech, { count, percent: total ? (count / total) * 100 : 0, confidence: confidenceForSampleCount(total) }];
    })
  );
}

const confidenceMetrics = {
  country: countBy(uniqueJobs, (job) => job.country_confidence || "Low"),
  location: countBy(uniqueJobs, (job) => job.location_confidence || "Low"),
  salary: countBy(uniqueJobs, (job) => job.salary_confidence || "Low"),
  technology: {
    High: uniqueJobs.filter((job) => !job.stack.includes("Not specified")).length,
    Low: uniqueJobs.filter((job) => job.stack.includes("Not specified")).length,
  },
  business_domain: {
    Medium: uniqueJobs.filter((job) => !job.business_domains.includes("Unknown")).length,
    Low: uniqueJobs.filter((job) => job.business_domains.includes("Unknown")).length,
  },
};

const totalModes = workMode.remote + workMode.hybrid + workMode.onsite;

console.log("\n================================");
console.log("MARKET REPORT - EUROPE");
console.log("================================\n");

console.log(`Data File: ${DATA_FILE}`);
console.log(`Raw Jobs Processed: ${totalJobs}`);
console.log(`Unique Jobs: ${uniqueJobs.length}`);
console.log(`Duplicates Removed: ${duplicatesRemoved}`);
console.log(`Jobs With Detected Tech: ${uniqueJobs.filter((job) => !job.stack.includes("Not specified")).length} (${formatPercent(uniqueJobs.filter((job) => !job.stack.includes("Not specified")).length, uniqueJobs.length)})`);
console.log(`Jobs With Salary: ${salaryRecords.length} (${formatPercent(salaryRecords.length, uniqueJobs.length)})`);
console.log(`Jobs With Company: ${uniqueJobs.filter((job) => job.company).length} (${formatPercent(uniqueJobs.filter((job) => job.company).length, uniqueJobs.length)})`);
console.log(`Jobs With Location: ${uniqueJobs.filter((job) => job.location_normalized?.city && job.location_normalized.city !== "Unknown").length} (${formatPercent(uniqueJobs.filter((job) => job.location_normalized?.city && job.location_normalized.city !== "Unknown").length, uniqueJobs.length)})`);
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
console.log("Canonical Countries");
console.log("--------------------------------\n");
printEntries(sortedEntries(countryStats), uniqueJobs.length);

console.log("\n--------------------------------");
console.log("Original Source Countries");
console.log("--------------------------------\n");
printEntries(sortedEntries(sourceCountryStats), uniqueJobs.length);

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
console.log("Technology Categories");
console.log("--------------------------------\n");
for (const [category, stats] of Object.entries(categoryStats)) {
  console.log(category.toUpperCase());
  printEntries(sortedEntries(stats, 12), uniqueJobs.length);
  console.log("");
}

console.log("--------------------------------");
console.log("High-Confidence Tech Combinations (3 only; React+Angular+Vue excluded)");
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

if (salarySummary) {
  console.log("\n--------------------------------");
  console.log("Salary Statistics (normalized to EUR)");
  console.log("--------------------------------\n");
  console.log(`Salary Samples: ${salarySummary.count}`);
  console.log(`Average Salary: ${formatCurrency(salarySummary.average)}`);
  console.log(`Median Salary: ${formatCurrency(salarySummary.median)}`);
  console.log(`P25 Salary: ${formatCurrency(salarySummary.p25)}`);
  console.log(`P75 Salary: ${formatCurrency(salarySummary.p75)}`);
  console.log(`P90 Salary: ${formatCurrency(salarySummary.p90)}`);
  console.log(`Confidence: ${salarySummary.confidence}`);

  console.log("\nOriginal Currency Distribution");
  printEntries(sortedEntries(salaryCurrencyStats));

  console.log("\nSalary By Country (EUR; countries with fewer than 10 salary samples hidden)");
  for (const country of SALARY_COUNTRIES) {
    const stats = salaryByCountry[country];
    if (!stats) continue;
    console.log(`${country}: median ${formatCurrency(stats.median)}, p25 ${formatCurrency(stats.p25)}, p75 ${formatCurrency(stats.p75)}, samples ${stats.count}, confidence ${stats.confidence}`);
  }
}

console.log("\n--------------------------------");
console.log("Technology Adoption By Country");
console.log("--------------------------------\n");

for (const [country] of sortedEntries(countryStats)) {
  console.log(country.toUpperCase());
  for (const tech of ADOPTION_TECHS) {
    const stat = technologyAdoptionByCountry[country][tech];
    console.log(`${tech}: ${stat.percent.toFixed(1)}% (${stat.count}/${countryStats[country]}, confidence ${stat.confidence})`);
  }
  console.log("");
}

console.log("--------------------------------");
console.log("Confidence Metrics");
console.log("--------------------------------\n");
for (const [field, stats] of Object.entries(confidenceMetrics)) {
  console.log(field.toUpperCase());
  printEntries(sortedEntries(stats));
  console.log("");
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

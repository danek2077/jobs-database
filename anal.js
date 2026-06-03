const fs = require("fs");
const axios = require("axios");

const ADZUNA_APP_ID = "97396f0f";
const ADZUNA_APP_KEY = "d2c5ffc48d299775c18e381883d8b420";

const GROUP = "frontend"

const COUNTRIES = [
  "gb", // United Kingdom
  "fr", // France
  "de", // Germany
  "nl", // Netherlands
  "be", // Belgium
  "it", // Italy
  "at", // Austria
  "ch", // Switzerland
  "ie", // Ireland
];

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
    "Frontend React Developer",
    "Senior React Developer",
  ],

  next: [
    "Next.js Developer",
    "Next.js Engineer",
    "NextJS Developer",
    "NextJS Engineer",
  ],

  fullstack: [
    "Full Stack Developer",
    "Full Stack Engineer",
    "Fullstack Developer",
    "Fullstack Engineer",
    "Node.js Developer",
    "Node.js Engineer",
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

const keywords = SEARCH_GROUPS[GROUP];

const fileName = `${GROUP}-europe.json`;


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

const BUSINESS_DOMAINS = {
  SaaS: ["saas", "software as a service", "subscription platform"],

  B2B: ["b2b", "business to business"],

  B2C: ["b2c", "business to consumer"],

  CRM: ["crm", "customer relationship management", "sales platform"],

  ERP: ["erp", "enterprise resource planning"],

  FinTech: [
    "fintech",
    "banking",
    "payments",
    "financial services",
    "trading",
    "insurance technology",
  ],

  HealthTech: [
    "healthtech",
    "health care",
    "healthcare",
    "medical platform",
    "telemedicine",
    "hospital",
  ],

  EdTech: ["edtech", "e-learning", "online learning", "education platform"],

  ECommerce: [
    "ecommerce",
    "e-commerce",
    "online store",
    "marketplace",
    "retail platform",
  ],

  Marketplace: ["marketplace", "two sided marketplace", "platform connecting"],

  AdTech: ["adtech", "advertising platform", "marketing platform"],

  MarTech: ["martech", "marketing automation", "campaign management"],

  HRTech: [
    "hrtech",
    "recruitment platform",
    "talent acquisition",
    "human resources",
  ],

  LegalTech: ["legaltech", "legal services", "compliance platform"],

  CyberSecurity: [
    "cybersecurity",
    "security platform",
    "identity management",
    "fraud prevention",
  ],

  AI: [
    "artificial intelligence",
    "machine learning",
    "generative ai",
    "llm",
    "ai platform",
  ],

  DevTools: [
    "developer platform",
    "developer tools",
    "devops platform",
    "engineering productivity",
  ],

  Logistics: [
    "logistics",
    "supply chain",
    "transportation platform",
    "fleet management",
  ],

  TravelTech: ["travel", "booking platform", "hospitality"],

  RealEstate: ["real estate", "property management", "proptech"],

  Gaming: ["gaming", "video game", "game platform"],

  Adult: [
    "adult content",
    "creator economy",
    "onlyfans",
    "adult entertainment",
  ],
};

const apiConfig = {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    Accept: "application/json",
    Referer: "https://your-domain.com/",
  },
};

const scrapingConfig = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-GB,en;q=0.9",
  },
  timeout: 10000,
  maxRedirects: 5,
};

function extractTechStack(htmlOrText) {
  if (!htmlOrText) return [];

  htmlOrText = String(htmlOrText);

  if (!htmlOrText.trim()) return [];
  let cleanText = htmlOrText
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ");
  cleanText = cleanText.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  return TECH_DICTIONARY.filter((tech) => {
    const escapedTech = tech.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(
      `(?<![a-zA-Z0-9А-Яа-яёЁ])${escapedTech}(?![a-zA-Z0-9А-Яа-яёЁ])`,
      "i"
    );
    return regex.test(cleanText);
  });
}

function extractBusinessDomains(text) {
  const found = [];

  const source = text.toLowerCase();

  for (const [domain, keywords] of Object.entries(BUSINESS_DOMAINS)) {
    const matched = keywords.some((keyword) =>
      source.includes(keyword.toLowerCase())
    );

    if (matched) {
      found.push(domain);
    }
  }

  return found;
}

// Глубокий сбор с Adzuna (парсит несколько страниц)
async function fetchAdzunaDeep(keyword, country, pages = 1) {
  let results = [];

  for (let page = 1; page <= pages; page++) {
    try {
      const res = await axios.get(
        `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`,
        {
          params: {
            app_id: ADZUNA_APP_ID,
            app_key: ADZUNA_APP_KEY,
            what: keyword,
            results_per_page: 5,
          },
          ...apiConfig,
        }
      );

      const jobs = res.data.results || [];

      if (jobs.length === 0) break;

      results.push(...jobs);
    } catch (err) {
      console.error(
        `[${country}] ${keyword} page ${page}`,
        err.response?.status,
        err.message
      );
      break;
    }
  }

  console.log(
    `✅ ${country.toUpperCase()} | ${keyword} | ${results.length} jobs`
  );

  return results.map((job) => ({
    source: "Adzuna",

    country,

    title: job.title || "Unknown",

    company:
      typeof job.company === "string"
        ? job.company
        : job.company?.display_name || "Unknown",

    location: job.location?.display_name || country,

    description: job.description || "",

    url: job.redirect_url || job.url,

    salary: job.salary_min || null,

    date: job.created || null,

    snippet: `${job.title || ""} ${job.description || ""}`,

    stack: [],
  }));
}

async function runAggregator() {
  console.log(
    "🇨🇵 ШАГ 1: Глубокий сбор сырой базы (Цель: 300+ уникальных вакансий)...\n"
  );

  // Расширили ключи, чтобы зацепить "скрытый" фронтенд и фулстек на JS/TS

  let rawJobs = [];

for (const country of COUNTRIES) {
  console.log(`\n🌍 ${country.toUpperCase()}\n`);

  for (const key of keywords) {
    const jobs = await fetchAdzunaDeep(
      key,
      country,
      5
    );

    rawJobs.push(...jobs);

    await new Promise((r) => setTimeout(r, 500));
  }
}

  console.log(`\nВсего собрано сырых позиций: ${rawJobs.length}`);

  const uniqueJobsMap = new Map();

  rawJobs.forEach((job) => {
    const title = String(job?.title || "Unknown title")
      .toLowerCase()
      .trim();

    const company = String(
      typeof job?.company === "object"
        ? job.company?.display_name || job.company?.name || "Unknown company"
        : job?.company || "Unknown company"
    )
      .toLowerCase()
      .trim();

    const uniqueKey = `${title}_${company}`;

    if (!uniqueJobsMap.has(uniqueKey)) {
      uniqueJobsMap.set(uniqueKey, {
        ...job,

        title: String(job?.title || "Unknown title"),

        company:
          typeof job?.company === "object"
            ? job.company?.display_name ||
              job.company?.name ||
              "Unknown company"
            : String(job?.company || "Unknown company"),
      });
    }
  });

  const uniqueJobs = Array.from(uniqueJobsMap.values());
  console.log(
    `После жесткой чистки дубликатов осталось: ${uniqueJobs.length} ЧИСТЫХ ВАКАНСИЙ.`
  );

  if (uniqueJobs.length < 200) {
    console.log(
      "⚠️ Маловато вышло. Попробуй запустить чуть позже или добавь еще ключевых слов."
    );
  }

  console.log(
    "\n🇨🇵 ШАГ 2: Глубокое сканирование контента сайтов (Deep Enrichment)..."
  );
  console.log("Парсим пачками, чтобы ускорить процесс. Погнали...\n");

  const finalJobs = [];
  const batchSize = 3; // обрабатываем по 3 сайта параллельно, чтобы ускорить

  for (let i = 0; i < uniqueJobs.length; i += batchSize) {
    const batch = uniqueJobs.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (job, index) => {
        const currentIdx = i + index + 1;
        console.log(
          `[${currentIdx}/${uniqueJobs.length}] Сканируем: "${String(
            job.title || "Unknown title"
          ).slice(0, 35)}..." от ${String(job.company || "Unknown company")}`
        );

        let textToAnalyze = job.snippet || "";
        if (job.url) {
          try {
            const pageRes = await axios.get(job.url, scrapingConfig);
            if (pageRes.data && typeof pageRes.data === "string") {
              textToAnalyze += " " + pageRes.data;
            }
          } catch (e) {
            // Игнорируем ошибки заблокированных сайтов
          }
        }

        const detectedStack = extractTechStack(textToAnalyze);
        const domains = extractBusinessDomains(textToAnalyze);

        job.business_domains = domains.length > 0 ? domains : ["Unknown"];
        job.stack =
          detectedStack.length > 0 ? detectedStack : ["Not specified"];
        delete job.snippet;
        finalJobs.push(job);
      })
    );

    // Небольшая пауза между пачками
    await new Promise((r) => setTimeout(r, 1200));
  }

  fs.writeFileSync(fileName, JSON.stringify(finalJobs, null, 2), "utf8");
  console.log(
    `\n🎉 ГОТОВО! База данных на ${finalJobs.length} вакансий собрана`
  );
  console.log("Теперь запускай: node analyzer.js");
}

runAggregator();

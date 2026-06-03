const fs = require("fs");
const axios = require("axios");

const ADZUNA_APP_ID = "97396f0f";
const ADZUNA_APP_KEY = "d2c5ffc48d299775c18e381883d8b420";

const keywords = [
  "Web Developer",
  "Software Engineer JavaScript",
  "Software Engineer TypeScript"
]

const fileName = "fr-web.json"

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

const apiConfig = {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    Accept: "application/json",
    Referer: "https://your-domain.com/"
  }
};

const scrapingConfig = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
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

// Глубокий сбор с Adzuna (парсит несколько страниц)
async function fetchAdzunaDeep(keyword, pages = 3) {
  let results = [];
  for (let page = 1; page <= pages; page++) {
    try {
      const res = await axios.get(
        "https://api.adzuna.com/v1/api/jobs/fr/search/" + page,
        {
          params: {
            app_id: ADZUNA_APP_ID,
            app_key: ADZUNA_APP_KEY,
            what: keyword,
            results_per_page: 50,
          },
          ...apiConfig,
        }
      );
      const jobs = res.data.results || [];
      if (jobs.length === 0) break;
      results.push(...jobs);
    } catch (err) {
      console.error(
        `[Adzuna] Page ${page}:`,
        err.response?.status,
        err.message
      );
      break;
    }
  }
  console.log(
    `✅ [Adzuna] По ключу "${keyword}" собрано страниц: ${pages}. Вакансий: ${results.length}`
  );
  return results.map((job) => ({
    source: "Adzuna",

    title: job.title || "Unknown",

    company:
      typeof job.company === "string"
        ? job.company
        : job.company?.display_name || "Unknown",

    location: job.location?.display_name || "France",

    description: job.description || "",

    url: job.redirect_url || job.url,

    salary: job.salary_min || null,

    date: job.created || null,

    snippet: `${job.title || ""} ${job.description || ""}`,

    stack: [],
  }));
}

// Глубокий сбор с Careerjet (парсит несколько страниц)
async function fetchCareerjetDeep(keyword, pages = 3) {
  const searchKeyword = keyword.trim();

  const requests = Array.from({ length: pages }, (_, i) =>
    axios.get("http://public.api.careerjet.net/search", {
      params: {
        locale_code: "fr_FR",
        keywords: searchKeyword,
        location: "France",
        pagesize: 50,
        page: i + 1,
        user_agent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        user_ip: "127.0.0.1",
      },
      ...apiConfig,
    })
  );

  try {
    const responses = await Promise.allSettled(requests);

    const jobs = responses.flatMap((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `[Careerjet] Page ${index + 1} failed:`,
          result.reason?.response?.status,
          result.reason?.response?.data || result.reason?.message
        );
        return [];
      }
    
      return Array.isArray(result.value?.data?.jobs)
        ? result.value.data.jobs
        : [];
    });

    // Удаляем дубликаты по URL
    const uniqueJobs = [...new Map(jobs.map((job) => [job.url, job])).values()];

    if (result.status === "rejected") {
      console.error(
        `[Careerjet] Page ${index + 1} failed:`,
        result.reason?.response?.status,
        result.reason?.response?.data || result.reason?.message
      );
      return [];
    }

    return uniqueJobs.map((job) => ({
      source: "Careerjet",

      title: job.title?.trim() || "Sans titre",

      company: job.company?.trim() || "Inconnu",

      location: job.locations || "France",

      description: job.description || "",

      url: job.url,

      salary: null,

      date: job.date || null,

      snippet: `${job.title || ""} ${job.description || ""}`,

      stack: [],
    }));
  } catch (error) {
    console.error(
      "[Careerjet] Fatal error:",
      error.response?.data || error.message
    );
    return [];
  }
}

async function runAggregator() {
  console.log(
    "🇨🇵 ШАГ 1: Глубокий сбор сырой базы (Цель: 300+ уникальных вакансий)...\n"
  );

  // Расширили ключи, чтобы зацепить "скрытый" фронтенд и фулстек на JS/TS
  

  let rawJobs = [];
  for (const key of keywords) {
    const adz = await fetchAdzunaDeep(key, 3); // по 3 страницы с каждого ключа
    rawJobs.push(...adz);
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
        job.stack =
          detectedStack.length > 0 ? detectedStack : ["Not specified"];
        delete job.snippet;
        finalJobs.push(job);
      })
    );

    // Небольшая пауза между пачками
    await new Promise((r) => setTimeout(r, 1200));
  }

  fs.writeFileSync(
    fileName,
    JSON.stringify(finalJobs, null, 2),
    "utf8"
  );
  console.log(
    `\n🎉 ГОТОВО! База данных на ${finalJobs.length} вакансий собрана`
  );
  console.log("Теперь запускай: node analyzer.js");
}

runAggregator();

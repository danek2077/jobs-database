const fs = require("fs");
const axios = require("axios");

const ADZUNA_APP_ID = "97396f0f";
const ADZUNA_APP_KEY = "d2c5ffc48d299775c18e381883d8b420";

// Твой полный словарь технологий
const TECH_DICTIONARY = [
  // --- Языки и База ---
  "JavaScript", "TypeScript", "ECMAScript", "ES6", "HTML", "CSS", "HTML5", "CSS3",
  // --- Основные Фреймворки и Либы ---
  "React", "Angular", "Vue", "Vue.js", "Svelte", "SolidJS", "Preact", "Alpine.js", "Ember", "Backbone", "jQuery",
  // --- Мета-фреймворки (SSR, SSG) ---
  "Next.js", "Nuxt.js", "SvelteKit", "Remix", "Astro", "Gatsby", "VitePress", "Qwik",
  // --- Управление состоянием (State Management) ---
  "Redux", "Redux Toolkit", "RTK", "Zustand", "MobX", "Recoil", "Jotai", "XState", "Pinia", "Vuex", "NgRx", "Effector",
  // --- Стилизация и UI-компоненты ---
  "Tailwind", "Tailwind CSS", "Bootstrap", "Sass", "SCSS", "Less", "Stylus", 
  "Styled Components", "Emotion", "Linaria", "Vanilla Extract",
  "Material UI", "MUI", "Ant Design", "AntD", "Shadcn", "Radix", "DaisyUI", "Chakra UI", "Bulma", "Semantic UI", "PrimeVue",
  // --- Сборщики и Инструменты тасок ---
  "Webpack", "Vite", "Turbopack", "Rollup", "Parcel", "Esbuild", "Gulp", "Grunt", "Babel",
  // --- Тестирование ---
  "Jest", "Vitest", "Cypress", "Playwright", "Puppeteer", "Selenium", "Testing Library", "Mocha", "Chai", "Enzyme", "Storybook",
  // --- Бэкенд / API / Базы (для фулстэк вакансий) ---
  "Node.js", "Express", "NestJS", "Fastify", "Koa", "GraphQL", "Apollo", "tRPC", "REST", "RESTful", "WebSockets", "Socket.io",
  "Firebase", "Supabase", "Prisma", "Drizzle", "Mongoose", "Sequelize", "TypeORM", 
  "PostgreSQL", "Postgres", "MongoDB", "MySQL", "SQLite", "Redis",
  // --- Девопс / Инфраструктура / CI/CD ---
  "Docker", "Kubernetes", "AWS", "Amazon Web Services", "Vercel", "Netlify", "Heroku", "DigitalOcean",
  "GitHub Actions", "GitLab CI", "Jenkins", "Nginx",
  // --- Мобильная и Десктопная разработка ---
  "React Native", "Electron", "Tauri", "Flutter", "Ionic", "Cordova",
  // --- Архитектура, Линтеры и Менеджеры пакетов ---
  "Git", "Monorepo", "Lerna", "Nx", "Turborepo", "Yarn", "NPM", "PNPM",
  "ESLint", "Prettier", "Stylelint", "Husky",
  "CI/CD", "Agile", "Scrum", "Kanban", "TDD", "BDD", "OOP", "FRP", "PWA", "SSR", "SSG", "ISR", "Microfrontends"
];

// Разделяем конфиги, чтобы не путать сервера
const apiConfig = {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json" // Для API просим строго JSON
  }
};

const scrapingConfig = {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8", // Для сайтов притворяемся браузером
    "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7"
  },
  timeout: 12000, 
  maxRedirects: 8 
};

function extractTechStack(htmlOrText) {
  if (!htmlOrText || !htmlOrText.trim()) return [];

  let cleanText = htmlOrText.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ');
  cleanText = cleanText.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ');
  cleanText = cleanText.replace(/<[^>]+>/g, ' ');
  cleanText = cleanText.replace(/\s+/g, ' ');

  return TECH_DICTIONARY.filter(tech => {
    const escapedTech = tech.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(?<![a-zA-Z0-9А-Яа-яёЁ])${escapedTech}(?![a-zA-Z0-9А-Яа-яёЁ])`, 'i');
    return regex.test(cleanText);
  });
}

// --- СБОР С АДЗУНЫ ---
async function fetchAdzunaFR(keyword) {
  try {
    const res = await axios.get("https://api.adzuna.com/v1/api/jobs/fr/search/1", {
      params: { app_id: ADZUNA_APP_ID, app_key: ADZUNA_APP_KEY, what: keyword, results_per_page: 50 },
      ...apiConfig
    });
    const jobs = res.data.results || [];
    console.log(`✅ [Adzuna] По ключу "${keyword}" получено: ${jobs.length} вакансий.`);
    
    return jobs.map(job => ({
      source: "Adzuna",
      title: job.title || "Sans titre",
      company: job.company?.display_name || "Inconnu",
      location: job.location?.display_name || "France",
      url: job.redirect_url,
      snippet: `${job.title} ${job.description || ""}`,
      stack: []
    }));
  } catch (err) {
    console.error(`❌ [Adzuna] Ошибка при поиске "${keyword}":`, err.message);
    return [];
  }
}

// --- СБОР С CAREERJET ---
async function fetchCareerjetFR(keyword) {
  try {
    const res = await axios.get("http://public.api.careerjet.net/search", {
      params: { 
        locale_code: "fr_FR", 
        keywords: keyword, 
        location: "France", 
        pagesize: 50, 
        page: 1, 
        affid: "213e213hd123456789abcdef12345678",
        user_ip: "127.0.0.1",
        user_agent: "Mozilla/5.0"
      },
      ...apiConfig
    });
    const jobs = res.data.jobs || [];
    console.log(`✅ [Careerjet] По ключу "${keyword}" получено: ${jobs.length} вакансий.`);
    
    return jobs.map(job => ({
      source: "Careerjet",
      title: job.title,
      company: job.company || "Inconnu",
      location: job.locations || "France",
      url: job.url,
      snippet: `${job.title} ${job.description || ""}`,
      stack: []
    }));
  } catch (err) {
    console.error(`❌ [Careerjet] Ошибка при поиске "${keyword}":`, err.message);
    return [];
  }
}

// --- ГЛАВНЫЙ ПРОЦЕССОР ---
async function runAggregator() {
  console.log("🇨🇵 Шаг 1: Быстрый сбор базы вакансий во Франции...\n");
  
  const apiResults = await Promise.allSettled([
    fetchAdzunaFR("react front"),
    fetchAdzunaFR("développeur react"),
    fetchCareerjetFR("react frontend"),
    fetchCareerjetFR("développeur react")
  ]);

  let rawJobs = [];
  apiResults.forEach(res => { if (res.status === "fulfilled") rawJobs.push(...res.value); });

  console.log(`\nВсего собрано сырых позиций со всех API: ${rawJobs.length}`);

  if (rawJobs.length === 0) {
    console.log("⚠️ Не удалось собрать вакансии. Проверь интернет или ключи API.");
    return;
  }

  const uniqueJobsMap = new Map();
  rawJobs.forEach(job => {
    const uniqueKey = `${job.title.toLowerCase().trim()}_${job.company.toLowerCase().trim()}`;
    if (!uniqueJobsMap.has(uniqueKey)) uniqueJobsMap.set(uniqueKey, job);
  });

  const uniqueJobs = Array.from(uniqueJobsMap.values());
  console.log(`После удаления дубликатов осталось: ${uniqueJobs.length} уникальных вакансий.`);
  
  console.log("\n🇨🇵 Шаг 2: Глубокое сканирование оригинальных сайтов (Deep Enrichment)...");
  console.log("Включен медленный сочный режим. Пожалуйста, подождите...\n");

  const finalJobs = [];

  for (let i = 0; i < uniqueJobs.length; i++) {
    const job = uniqueJobs[i];
    console.log(`[${i + 1}/${uniqueJobs.length}] Прокачиваем: "${job.title}" от ${job.company}`);

    let textToAnalyze = job.snippet; 

    if (job.url) {
      try {
        const pageRes = await axios.get(job.url, scrapingConfig); // Тут используем scrapingConfig с text/html
        
        if (pageRes.data && typeof pageRes.data === "string") {
          textToAnalyze += " " + pageRes.data;
          console.log(`   --> Успешно скачали полную страницу сайта!`);
        }
      } catch (err) {
        console.log(`   ⚠️ Напрямую зайти не удалось (${err.message}). Парсим сниппет.`);
      }
    }

    const detectedStack = extractTechStack(textToAnalyze);
    job.stack = detectedStack.length > 0 ? detectedStack : ["Not specified"];
    
    delete job.snippet; 
    finalJobs.push(job);

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const filename = "france_juicy_jobs.json";
  fs.writeFileSync(filename, JSON.stringify(finalJobs, null, 2), "utf8");
  
  console.log(`\n🎉 МИССИЯ РЕАЛЬНО ВЫПОЛНЕНА!`);
  console.log(`📂 Результат сохранен в: ${filename}`);
}

runAggregator();
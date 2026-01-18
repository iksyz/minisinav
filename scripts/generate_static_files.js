const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const escapeXml = (unsafe) => {
    return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
};

const getSiteUrl = () => {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (envUrl) return envUrl.replace(/\/$/, '');
    return 'https://xders.net';
};

const slugToCategory = (slug) => {
    return String(slug || '').toUpperCase().replace(/-/g, '_');
};

function getCoursesByCategory(quizData) {
    const coursesByCategory = {};

    quizData.forEach((quiz) => {
        if (!quiz.kategori || !quiz.dersSlug) return;

        const categoryId = slugToCategory(quiz.kategori);

        if (!coursesByCategory[categoryId]) {
            coursesByCategory[categoryId] = new Map();
        }

        if (!coursesByCategory[categoryId].has(quiz.dersSlug)) {
            coursesByCategory[categoryId].set(quiz.dersSlug, {
                title: quiz.ders,
                slug: quiz.dersSlug,
            });
        }
    });

    const result = {};
    Object.keys(coursesByCategory).forEach((cat) => {
        result[cat] = Array.from(coursesByCategory[cat].values());
    });

    return result;
}

function main() {
    ensureDir(publicDir);

    const quizPath = path.join(projectRoot, 'sorular.json');
    const raw = fs.readFileSync(quizPath, 'utf8');
    const quizData = JSON.parse(raw);
    const quizzes = Array.isArray(quizData) ? quizData : [];

    // courses.json
    const coursesByCategory = getCoursesByCategory(quizzes);
    fs.writeFileSync(
        path.join(publicDir, 'courses.json'),
        JSON.stringify(coursesByCategory),
        'utf8'
    );

    // robots.txt
    const baseUrl = getSiteUrl();
    const robots = [
        'User-agent: *',
        'Allow: /',
        'Disallow: /*?q=',
        '',
        `Host: ${baseUrl}`,
        `Sitemap: ${baseUrl}/sitemap.xml`,
        '',
    ].join('\n');
    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf8');

    // sitemap.xml
    const lastmod = new Date().toISOString();

    const quizSlugs = quizzes.map((q) => q.slug).filter(Boolean);
    const dersSlugs = Array.from(
        new Set(
            quizzes
                .map((q) => q.dersSlug)
                .filter(Boolean)
                .map((s) => String(s).toLowerCase().replace(/_/g, '-'))
        )
    );
    const kategoriSlugs = Array.from(
        new Set(
            quizzes
                .map((q) => q.kategori)
                .filter(Boolean)
                .map((s) => String(s).toLowerCase().replace(/ /g, '-'))
        )
    );

    const staticPaths = ['/', '/hakkinda', '/gizlilik', '/iletisim'];
    const categoryPaths = kategoriSlugs.map((s) => `/kategori/${s}`);
    const dersPaths = dersSlugs.map((s) => `/ders/${s}`);
    const quizPaths = quizSlugs.map((s) => `/quiz/${s}`);

    const urls = [...staticPaths, ...categoryPaths, ...dersPaths, ...quizPaths]
        .filter(Boolean)
        .map((p) => `${baseUrl}${p}`);

    const xml =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls
            .map(
                (u) =>
                    `  <url><loc>${escapeXml(u)}</loc><lastmod>${escapeXml(
                        lastmod
                    )}</lastmod></url>`
            )
            .join('\n') +
        `\n</urlset>`;

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');
}

main();

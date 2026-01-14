// pages/sitemap.xml.js

export const runtime = 'experimental-edge';

const getSiteUrl = (req) => {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (envUrl) return envUrl.replace(/\/$/, '');

    const host = req?.headers?.host;
    const proto = req?.headers?.['x-forwarded-proto'] || 'http';
    if (host) return `${proto}://${host}`;
    return 'http://localhost:3000';
};

const escapeXml = (unsafe) => {
    return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
};

const buildUrl = (baseUrl, path) => {
    const cleanBase = baseUrl.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
};

export async function getServerSideProps({ res, req }) {
    const baseUrl = getSiteUrl(req);
    const lastmod = new Date().toISOString();

    const quizData = require('../sorular.json');
    const quizSlugs = Array.isArray(quizData) ? quizData.map((q) => q.slug).filter(Boolean) : [];

    const dersSlugs = Array.isArray(quizData)
        ? Array.from(
            new Set(
                quizData
                    .map((q) => q.dersSlug)
                    .filter(Boolean)
                    .map((s) => String(s).toLowerCase().replace(/_/g, '-'))
            )
        )
        : [];

    const kategoriSlugs = Array.isArray(quizData)
        ? Array.from(
            new Set(
                quizData
                    .map((q) => q.kategori)
                    .filter(Boolean)
                    .map((s) => String(s).toLowerCase().replace(/ /g, '-'))
            )
        )
        : [];

    const staticPaths = ['/', '/hakkinda', '/gizlilik', '/iletisim'];
    const categoryPaths = kategoriSlugs.map((s) => `/kategori/${s}`);
    const dersPaths = dersSlugs.map((s) => `/ders/${s}`);
    const quizPaths = quizSlugs.map((s) => `/quiz/${s}`);

    const urls = [...staticPaths, ...categoryPaths, ...dersPaths, ...quizPaths]
        .filter(Boolean)
        .map((p) => buildUrl(baseUrl, p));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls
            .map((u) => `  <url><loc>${escapeXml(u)}</loc><lastmod>${escapeXml(lastmod)}</lastmod></url>`)
            .join('\n') +
        `\n</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.write(xml);
    res.end();

    return { props: {} };
}

export default function SitemapXml() {
    return null;
}

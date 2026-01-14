// pages/robots.txt.js

export const runtime = 'edge';

const getSiteUrl = (req) => {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (envUrl) return envUrl.replace(/\/$/, '');

    const host = req?.headers?.host;
    const proto = req?.headers?.['x-forwarded-proto'] || 'http';
    if (host) return `${proto}://${host}`;
    return 'http://localhost:3000';
};

export async function getServerSideProps({ res, req }) {
    const baseUrl = getSiteUrl(req);

    const content = [
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${baseUrl}/sitemap.xml`,
        '',
    ].join('\n');

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.write(content);
    res.end();

    return { props: {} };
}

export default function RobotsTxt() {
    return null;
}

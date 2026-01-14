// pages/_app.js

import '@/styles/globals.css';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Kategori icon mapping
const CATEGORY_ICONS = {
  'LGS': 'fa-school',
  'KPSS_GENEL': 'fa-briefcase',
  'KPSS_ALAN': 'fa-briefcase',
  'TYT': 'fa-pencil-ruler',
  'AYT': 'fa-brain',
  'DGS': 'fa-graduation-cap',
  'YDT': 'fa-language',
};

// Kategori slug mapping
const CATEGORY_SLUGS = {
  'LGS': 'lgs',
  'KPSS_GENEL': 'kpss-genel',
  'KPSS_ALAN': 'kpss-alan',
  'TYT': 'tyt',
  'AYT': 'ayt',
  'DGS': 'dgs',
  'YDT': 'ydt',
};

// Slug'ı kategori ID'sine çevir
const slugToCategory = (slug) => {
  return slug.toUpperCase().replace(/-/g, '_');
};

// Kategorilere göre dersleri grupla
function getCoursesByCategory(quizData) {
  const coursesByCategory = {};

  quizData.forEach(quiz => {
    if (!quiz.kategori || !quiz.dersSlug) return;

    const categoryId = slugToCategory(quiz.kategori);

    if (!coursesByCategory[categoryId]) {
      coursesByCategory[categoryId] = new Map();
    }

    // Aynı dersSlug'dan sadece bir tane ekle
    if (!coursesByCategory[categoryId].has(quiz.dersSlug)) {
      coursesByCategory[categoryId].set(quiz.dersSlug, {
        title: quiz.ders,
        slug: quiz.dersSlug,
      });
    }
  });

  // Map'leri array'e çevir
  const result = {};
  Object.keys(coursesByCategory).forEach(cat => {
    result[cat] = Array.from(coursesByCategory[cat].values());
  });

  return result;
}

App.getInitialProps = async () => {
  // Server-side'da sorular.json'u oku
  const quizData = require('../sorular.json');
  const coursesByCategory = getCoursesByCategory(quizData);

  return {
    coursesByCategory,
  };
};

export default function App({ Component, pageProps, coursesByCategory = {} }) {
  const courses = coursesByCategory;
  const router = useRouter();

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
  const canonicalPath = (router.asPath || '/').split('#')[0];
  const canonicalUrl = siteUrl ? `${siteUrl}${canonicalPath}` : undefined;

  const defaultTitle = 'xDers';
  const defaultDescription = 'TYT, AYT, LGS, DGS ve YDT için hızlı ve modern quiz deneyimi.';
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: defaultTitle,
        url: siteUrl || undefined,
        logo: siteUrl ? `${siteUrl}/xders-logo.svg` : undefined,
      },
      {
        '@type': 'WebSite',
        name: defaultTitle,
        url: siteUrl || undefined,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: siteUrl ? `${siteUrl}/?q={search_term_string}` : undefined,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  // Sidebar menü yapısı
  const sidebarMenu = [
    { id: 'LGS', title: 'LGS', icon: 'fa-school', slug: 'lgs' },
    { id: 'TYT', title: 'TYT', icon: 'fa-pencil-ruler', slug: 'tyt' },
    { id: 'AYT', title: 'AYT', icon: 'fa-brain', slug: 'ayt' },
    { id: 'DGS', title: 'DGS', icon: 'fa-graduation-cap', slug: 'dgs' },
    { id: 'YDT', title: 'YDT', icon: 'fa-language', slug: 'ydt' },
  ];

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <meta name="description" content={defaultDescription} key="description" />

        <meta property="og:site_name" content={defaultTitle} key="og:site_name" />
        <meta property="og:type" content="website" key="og:type" />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} key="og:url" />}
        <meta property="og:title" content={defaultTitle} key="og:title" />
        <meta property="og:description" content={defaultDescription} key="og:description" />
        {siteUrl && <meta property="og:image" content={`${siteUrl}/xders-logo.svg`} key="og:image" />}

        <meta name="twitter:card" content="summary" key="twitter:card" />
        <meta name="twitter:title" content={defaultTitle} key="twitter:title" />
        <meta name="twitter:description" content={defaultDescription} key="twitter:description" />
        {siteUrl && <meta name="twitter:image" content={`${siteUrl}/xders-logo.svg`} key="twitter:image" />}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          key="structured-data"
        />
      </Head>

      {/* ANA FLEX KAPSAYICISI: Body'de display: flex; olduğu için bu kapsayıcıya gerek yok. */}
      {/* Sadece Navbar ve Wrapper'ı yan yana koyuyoruz. */}

      {/* 1. MOBİL OVERLAY (Sidebar açıkken arka planı karartmak için) */}
      <div className="sidebar-overlay" id="sidebar-overlay"></div>

      {/* 2. MOBİL HEADER (Mobil açma butonu) */}
      <div id="mobile-header" className="mobile-header">
        <button id="mobile-toggle-btn" className="mobile-menu-toggle-btn">
          <i className="fa-solid fa-bars"></i>
        </button>
        <Link href="/" className="flex items-center space-x-2">
          <img src="/xders-logo.svg" alt="xDers" className="xders-logo" />
          <span className="logo-text">
            <span className="logo-part1">x</span><span className="logo-part2">Ders</span>
          </span>
        </Link>
        <div className="w-10"></div>
      </div>

      {/* 3. SİDEBAR HTML KODU */}
      <nav className="sidebar" id="sidebar-menu">
        <div className="sidebar-header">
          <img src="/xders-logo.svg" alt="xDers" className="xders-logo" />
          <Link href="/" className="logo-text">
            <span className="logo-part1">x</span><span className="logo-part2">Ders</span>
          </Link>
          <button className="toggle-btn"><i className="fa-solid fa-chevron-left"></i></button>
        </div>

        <ul className="sidebar-links">
          <li>
            <Link href="/" className="active">
              <span className="icon"><i className="fa-solid fa-house"></i></span>
              <span className="text">Ana Sayfa</span>
            </Link>
          </li>

          <hr />

          {sidebarMenu.map((menuItem) => {
            // Dinamik dersleri al
            const categoryCourses = courses[menuItem.id] || [];
            const hasSubItems = categoryCourses.length > 0;

            return (
              <li key={menuItem.id} className={hasSubItems ? "has-submenu" : ""}>
                <a href={hasSubItems ? "#" : `/kategori/${menuItem.slug}`}>
                  <span className="icon"><i className={`fa-solid ${menuItem.icon}`}></i></span>
                  <span className="text">{menuItem.title}</span>
                  {hasSubItems && <span className="arrow"><i className="fa-solid fa-angle-down"></i></span>}
                </a>
                {hasSubItems && (
                  <ul className="submenu">
                    {categoryCourses.map((course) => (
                      <li key={course.slug}>
                        <Link href={`/ders/${course.slug}`}>{course.title}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}

          <hr />

          <li>
            <Link href="/hakkinda">
              <span className="icon"><i className="fa-solid fa-circle-info"></i></span>
              <span className="text">Hakkında</span>
            </Link>
          </li>
          <li>
            <Link href="/gizlilik">
              <span className="icon"><i className="fa-solid fa-shield-halved"></i></span>
              <span className="text">Gizlilik</span>
            </Link>
          </li>
          <li>
            <Link href="/iletisim">
              <span className="icon"><i className="fa-solid fa-envelope"></i></span>
              <span className="text">İletişim</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* 💥 DÜZELTME: İÇERİK VE FOOTER'I SARAN TEK BİR DİKEY SÜTUN YAPIYORUZ */}
      <div className="content-and-footer-wrapper">

        {/* 4. İÇERİK ALANI */}
        <main className="content">
          {/* Ana içerik (index.js, [slug].js) buraya basılacak */}
          <Component {...pageProps} />
        </main>

        {/* 5. FOOTER HTML KODU */}
        <footer className="mt-10">
          <div className="footer-bleed bg-gradient-to-b from-gray-900 to-gray-950 text-gray-200">
            <div className="footer-inner">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 text-2xl font-serif font-extrabold tracking-tight">
                    <img src="/xders-logo.svg" alt="xDers" className="xders-logo xders-logo--footer" />
                    <span><span className="text-white">x</span><span className="text-blue-300">Ders</span></span>
                  </div>
                  <p className="mt-2 text-sm text-gray-300 leading-relaxed max-w-xl">
                    TYT, AYT, LGS ve daha fazlası için hızlı quiz deneyimi. Düzenli tekrar, net artışı.
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Sayfanın en üstüne çık"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="shrink-0 inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-gray-200 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-950"
                >
                  <i className="fa-solid fa-arrow-up"></i>
                  Yukarı Çık
                </button>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <nav className="space-y-3" aria-label="Footer bağlantıları">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Bağlantılar</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Link href="/" className="text-gray-300 hover:text-white focus:outline-none focus:underline">Ana Sayfa</Link>
                    <Link href="/hakkinda" className="text-gray-300 hover:text-white focus:outline-none focus:underline">Hakkında</Link>
                    <Link href="/gizlilik" className="text-gray-300 hover:text-white focus:outline-none focus:underline">Gizlilik</Link>
                    <Link href="/iletisim" className="text-gray-300 hover:text-white focus:outline-none focus:underline">İletişim</Link>
                  </div>
                </nav>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Kısa Bilgi</h3>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <i className="fa-solid fa-bolt text-blue-300 mt-0.5"></i>
                      <span>Hızlı ve sade arayüz, odağını bozmadan pratik yap.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fa-solid fa-shuffle text-blue-300 mt-0.5"></i>
                      <span>Rastgele soru deneyimiyle tekrarları güçlendir.</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">İletişim</h3>
                  <div className="text-sm text-gray-300 space-y-2">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-envelope text-blue-300"></i>
                      <span>ipekyuzemre65@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fa-brands fa-instagram text-blue-300"></i>
                      <span>@xders</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} xDers. Tüm hakları saklıdır.</p>
                <p className="text-xs text-gray-500">Bu projedeki bazı içerikler örnek amaçlıdır.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
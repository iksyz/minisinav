// pages/ders/[dersSlug].js
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import quizData from '../../sorular.json'; 

// --- İHTİYAÇ DUYULAN YARDIMCI SABİTLER ---

// Tailwind Renk Eşleştiricisi (pages/index.js'deki renk haritasını kullanır)
// 2. Renk Eşleştirmeleri (Tüm Sınavlar Dahil)
const COLOR_MAP = {
  // Üniversite Sınavları
  TYT: { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-500', linkBg: 'bg-red-600 hover:bg-red-700' },
  AYT: { text: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-500', linkBg: 'bg-purple-600 hover:bg-purple-700' },
  
  // LGS
  LGS: { text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-500', linkBg: 'bg-green-600 hover:bg-green-700' },
  
  // KPSS Grupları
  KPSS_GENEL: { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-500', linkBg: 'bg-blue-600 hover:bg-blue-700' },
  KPSS_ALAN: { text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-500', linkBg: 'bg-yellow-600 hover:bg-yellow-700' },
  
  // DGS ve YDT
  DGS: { text: 'text-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-500', linkBg: 'bg-cyan-600 hover:bg-cyan-700' }, // Yeni
  YDT: { text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-500', linkBg: 'bg-orange-600 hover:bg-orange-700' }, // Yeni
};


export default function DersListelemeSayfasi({ konuQuizleri, dersAdi, kategoriKodu }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div className="container mx-auto p-8 max-w-6xl text-center text-gray-500">Ders yükleniyor...</div>;
  }
  
  if (!konuQuizleri || konuQuizleri.length === 0) {
    return (
      <div className="container mx-auto p-8 max-w-6xl text-center">
        <h1 className="text-4xl font-extrabold text-red-600">Henüz Konu Bulunamadı!</h1>
        <p className="text-gray-500 mt-2">Bu ders için quiz eklenmemiş. Lütfen `sorular.json` dosyasını kontrol edin.</p>
        <Link href="/" className="mt-4 inline-block text-blue-500 hover:text-blue-700">Ana Sayfaya Geri Dön</Link>
      </div>
    );
  }

  // Renkleri kategoriden çek
  const colors = COLOR_MAP[kategoriKodu] || { text: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-500' };

  // Tailwind'i renklere zorlamak için gizli div (tüm renkleri içerir)
  const dynamicClasses = `text-red-700 bg-red-50 border-red-500 bg-red-600 hover:bg-red-700
                          text-purple-700 bg-purple-50 border-purple-500 bg-purple-600 hover:bg-purple-700
                          text-green-700 bg-green-50 border-green-500 bg-green-600 hover:bg-green-700
                          text-blue-700 bg-blue-50 border-blue-500 bg-blue-600 hover:bg-blue-700
                          text-yellow-700 bg-yellow-50 border-yellow-500 bg-yellow-600 hover:bg-yellow-700
                          text-cyan-700 bg-cyan-50 border-cyan-500 bg-cyan-600 hover:bg-cyan-700
                          text-orange-700 bg-orange-50 border-orange-500 bg-orange-600 hover:bg-orange-700`;

  return (
    <>
      <Head>
        <title>{dersAdi} Tüm Konu Testleri | xDers</title>
        <meta name="description" content={`${dersAdi} dersine ait tüm konuların listesi. Her konudan rastgele 10 soru çözün.`} />
      </Head>

      <div className="container mx-auto p-4 md:p-8 max-w-6xl">
        
        {/* Başlık Alanı */}
        <header className={`${colors.bg} p-8 rounded-xl shadow-lg mb-12 border-b-4 ${colors.border}`}>
          <h1 className={`text-5xl font-serif font-extrabold ${colors.text} mb-3`}>
            {dersAdi} Konu Testleri
          </h1>
          <p className="text-gray-600 text-xl font-sans">
            Aşağıdan bir konu başlığı seçerek rastgele 10 soruluk testi çözmeye başlayın.
          </p>
        </header>

        {/* Tüm Konuları Listeleme Alanı */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {konuQuizleri.map((konu) => (
            <Link 
              // KONUYA TIKLAYINCA QUIZ OYNATICISINA GİDER (pages/quiz/[slug].js)
              href={`/quiz/${konu.slug}`} 
              key={konu.slug}
              className={`group block p-5 ${colors.bg} border-l-4 ${colors.border} rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
            >
              <h3 className={`text-xl font-serif font-bold text-gray-800 group-hover:${colors.text} transition-colors duration-300`}>
                 {konu.quizBasligi}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed mt-2">
                 {konu.metaDesc?.slice(0, 80) || ''}{konu.metaDesc?.length > 80 ? '...' : ''}
              </p>
              
              <p className={`text-right text-xs ${colors.text} mt-3 font-semibold`}>
                Teste Başla →
              </p>
            </Link>
          ))}
        </div>
        
        {konuQuizleri.length === 0 && (
            <p className="text-gray-500 text-center text-lg py-10">
                Bu ders için henüz konu testi bulunmuyor.
            </p>
        )}

        {/* Gizli div Tailwind'i renklere zorlamak için */}
        <div className={dynamicClasses} style={{display: 'none'}}></div> 
      </div>
    </>
  );
}


// --- Sayfa Oluşturma Fonksiyonları ---

// URL'deki dersSlug'ı kategori ID'sine çevirmek için yardımcı fonksiyon
const slugToCategory = (slug) => {
    // Örnek: 'tyt-turkce' -> 'TYT' (Kategori kodu)
    const parts = slug.split('-');
    const mainPart = parts[0].toUpperCase();
    
    if (mainPart === 'KPSS' && parts.length > 1) {
        // KPSS'yi özel işle: kpss-genel -> KPSS_GENEL, kpss-alan -> KPSS_ALAN
        const nextPart = parts[1].toUpperCase();
        if (nextPart === 'GENEL' || nextPart === 'ALAN' || nextPart === 'ONLISANS') {
             return 'KPSS_' + nextPart;
        }
    }
    return mainPart;
}

// 1. Next.js'e hangi ders sayfalarını oluşturacağını söyleriz (Build sırasında)
export async function getStaticPaths() {
  const allQuizData = require('../../sorular.json'); 
  
  // JSON'dan tüm tekil dersSlug'larını çek
  const paths = allQuizData
    .filter(quiz => quiz.dersSlug) // dersSlug olanları seç
    .map(quiz => quiz.dersSlug.toLowerCase().replace(/_/g, '-')) // URL'ye uygun format
    .filter((value, index, self) => self.indexOf(value) === index) // Tekrarları kaldır
    .map(dersSlug => ({ params: { dersSlug } })); // Path formatına çevir

  return {
    paths, 
    fallback: false, // Tanımlanmayan ders gelirse 404 göster
  };
}

// 2. URL'deki dersSlug'a göre quizleri filtreler ve sayfaya gönderir
export async function getStaticProps({ params }) {
  const allQuizData = require('../../sorular.json'); 
  const { dersSlug } = params;
  
  // Filtreleme: Yalnızca doğru dersSlug'a ait quizleri seç
  const konuQuizleri = allQuizData.filter(quiz => 
    quiz.dersSlug?.toLowerCase().replace(/_/g, '-') === dersSlug.toLowerCase()
  );

  if (konuQuizleri.length === 0) {
      return { notFound: true }; // Quiz yoksa 404
  }

  // Kategoriyi ve Ders Adını ilk quiz'den çek
  const kategoriKodu = slugToCategory(konuQuizleri[0].dersSlug);
  const dersAdi = konuQuizleri[0].ders;

  return {
    props: {
      konuQuizleri, // Listelenecek konular (quizler)
      dersAdi: dersAdi || "Ders Testleri",
      dersSlug,
      kategoriKodu: kategoriKodu || 'TYT',
    },
    revalidate: 60, // Siteni güncel tutmak için 60 saniyede bir yeniden oluşturulabilir
  };
}
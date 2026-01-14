// pages/kategori/[categorySlug].js
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import quizData from '../../sorular.json'; 

// --- İHTİYAÇ DUYULAN YARDIMCI SABİTLER ---

// 1. Ana Sınav Kategorileri (Başlıkları doğru bulmak için)
// 1. ANA SINAV KATEGORİLERİ (Genişletilmiş ve Final Liste)
const MAIN_EXAMS = [
  { id: 'TYT', title: 'Temel Yeterlilik Testi (TYT)', desc: 'Üniversiteye girişin ilk adımı. Türkçe, Matematik ve Fen Bilimleri testleri.', color: 'red', icon: 'fa-pencil-ruler', link: '/kategori/tyt' },
  { id: 'AYT', title: 'Alan Yeterlilik Testleri (AYT)', desc: 'Lisans bölümleri için gerekli alan bilgisi testleri (Matematik, Fen, Edebiyat).', color: 'purple', icon: 'fa-brain', link: '/kategori/ayt' },
  { id: 'LGS', title: 'Liselere Geçiş Sınavı (LGS)', desc: 'Lise yerleştirmesi için Fen ve Matematik ağırlıklı konular.', color: 'green', icon: 'fa-school', link: '/kategori/lgs' },
  
  // KPSS Genel ve Alan Ayrıldı
  { id: 'KPSS_GENEL', title: 'KPSS Genel Yetenek & Genel Kültür', desc: 'Tarih, Coğrafya, Türkçe ve Matematik dersleri (Önlisans/Ortaöğretim).', color: 'blue', icon: 'fa-briefcase', link: '/kategori/kpss-genel' },
  { id: 'KPSS_ALAN', title: 'KPSS Alan Bilgisi (ÖABT)', desc: 'ÖABT ve Alan Bilgisi konularına özel testler.', color: 'yellow', icon: 'fa-book-open', link: '/kategori/kpss-alan' },
  
  // Yeni Eklenen Sınavlar
  { id: 'DGS', title: 'Dikey Geçiş Sınavı (DGS)', desc: 'Önlisans mezunları için sayısal ve sözel yetenek testleri.', color: 'cyan', icon: 'fa-graduation-cap', link: '/kategori/dgs' },
  { id: 'YDT', title: 'Yabancı Dil Testi (YDT)', desc: 'İngilizce ve diğer diller için Yükseköğretim Kurumları Sınavı dil testi.', color: 'orange', icon: 'fa-language', link: '/kategori/ydt' },
];

// 2. Ders Renk Eşleştiricisi (YENİ RENKLER EKLENDİ)
const COLOR_MAP = {
  TYT: { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-500', linkBg: 'bg-red-600 hover:bg-red-700' },
  AYT: { text: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-500', linkBg: 'bg-purple-600 hover:bg-purple-700' },
  LGS: { text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-500', linkBg: 'bg-green-600 hover:bg-green-700' },
  KPSS_GENEL: { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-500', linkBg: 'bg-blue-600 hover:bg-blue-700' },
  KPSS_ALAN: { text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-500', linkBg: 'bg-yellow-600 hover:bg-yellow-700' },
  DGS: { text: 'text-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-500', linkBg: 'bg-cyan-600 hover:bg-cyan-700' }, // Yeni
  YDT: { text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-500', linkBg: 'bg-orange-600 hover:bg-orange-700' }, // Yeni
};

// ... (FEAURED_COURSES listesi de bu yeni ID'lerle güncellenmeli) ...
// 3. Slug'ı Kategori ID'sine Çevir
const slugToCategory = (slug) => {
    return slug.toUpperCase().replace(/-/g, '_');
}


export default function KategoriSayfasi({ categoryData, dersler, categorySlug }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div className="container mx-auto p-8 max-w-6xl text-center text-gray-500">Kategori yükleniyor...</div>;
  }
  
  if (!categoryData || !dersler || dersler.length === 0) {
    return (
      <div className="container mx-auto p-8 max-w-6xl text-center">
        <h1 className="text-4xl font-extrabold text-red-600">Ders Bulunamadı!</h1>
        <p className="text-gray-500 mt-2">Bu kategori için (`/{categorySlug}`) henüz bir ders bulunamadı.</p>
        <Link href="/" className="mt-4 inline-block text-blue-500 hover:text-blue-700">Ana Sayfaya Geri Dön</Link>
      </div>
    );
  }

  // Renkleri kategori ID'sinden çek
  const colors = COLOR_MAP[categoryData.id] || { text: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-500' };

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
        <title>{categoryData.title} Konu Testleri | xDers</title>
        <meta name="description" content={`${categoryData.title} sınavına ait tüm derslerin listesi. Başarını artırmak için test çözmeye hemen başla!`} />
      </Head>

      <div className="container mx-auto p-4 md:p-8 max-w-6xl">
        
        {/* Başlık Alanı */}
        <header className={`${colors.bg} p-8 rounded-xl shadow-lg mb-12 border-b-4 ${colors.border}`}>
          <h1 className={`text-5xl font-serif font-extrabold ${colors.text} mb-3`}>
            {categoryData.title} Dersleri
          </h1>
          <p className="text-gray-600 text-xl font-sans">
            {categoryData.desc} Aşağıdan bir ders seçerek konulara ve testlere ulaşabilirsiniz.
          </p>
        </header>

        {/* Ders Kartlarını Listeleme Alanı */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dersler.map((subject) => (
            <Link 
              // DİKKAT: Artık doğrudan ders listesi sayfasına yönlendiriyoruz
              href={`/ders/${subject.dersSlug}`}
              key={subject.dersSlug}
              className={`group block p-5 ${colors.bg} border-l-4 ${colors.border} rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
            >
              <h3 className={`text-xl font-serif font-bold text-gray-800 group-hover:${colors.text} transition-colors duration-300`}>
                 {subject.title}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed mt-2">
                 {subject.desc}
              </p>
              
              <p className={`text-right text-xs ${colors.text} mt-3 font-semibold`}>
                Tüm Konuları Gör →
              </p>
            </Link>
          ))}
        </div>
        
        {/* Gizli div Tailwind'i renklere zorlamak için */}
        <div className={`${dynamicClasses} text-yellow-700 bg-yellow-50 border-yellow-500 text-cyan-700 bg-cyan-50 border-cyan-500 text-orange-700 bg-orange-50 border-orange-500`} style={{display: 'none'}}></div> 
      </div>
    </>
  );
}


// --- Sayfa Oluşturma Fonksiyonları ---

// 1. Next.js'e hangi kategori sayfalarını oluşturacağını söyleriz (Build sırasında)
export async function getStaticPaths() {
  const allQuizData = require('../../sorular.json'); 
  
  // JSON'dan tüm tekil kategori slug'larını çek
  const paths = allQuizData
    .filter(quiz => quiz.kategori) 
    .map(quiz => ({ 
        params: { 
            categorySlug: quiz.kategori.toLowerCase().replace(/ /g, '-') // URL'ye uygun slug formatı (ör: tyt, kpss-genel)
        } 
    }))
    .filter((value, index, self) => self.findIndex(item => item.params.categorySlug === value.params.categorySlug) === index); // Tekrarları kaldır

  return {
    paths, 
    fallback: false, // Tanımlanmayan kategori gelirse 404 göster
  };
}

// 2. URL'deki categorySlug'a göre dersleri filtreler ve sayfaya gönderir
export async function getStaticProps({ params }) {
  const allQuizData = require('../../sorular.json'); 
  const { categorySlug } = params;
  
  // URL slug'ını Kategori ID'sine çevir (ör: tyt -> TYT, kpss-genel -> KPSS_GENEL)
  const categoryId = slugToCategory(categorySlug); 
  
  // Kategoriye ait tüm quizleri filtrele
  const quizzesInThisCategory = allQuizData.filter(quiz => 
    slugToCategory(quiz.kategori) === categoryId
  );

  if (quizzesInThisCategory.length === 0) {
      return { notFound: true }; // Quiz yoksa 404
  }

  // Quizleri dersSlug'a göre grupla (Her dersSlug'dan sadece bir tane al)
  const subjectsMap = quizzesInThisCategory.reduce((acc, quiz) => {
    const dersSlug = quiz.dersSlug;
    
    if (dersSlug && !acc[dersSlug]) {
        // Dersleri slug'a göre grupla ve gerekli bilgileri al
        acc[dersSlug] = {
            title: quiz.ders,
            dersSlug: dersSlug,
            // Dersin meta açıklamasını kullan (Quiz'in metaDesc'ini dersin açıklaması olarak kullanabiliriz)
            desc: quiz.metaDesc, 
        };
    }
    return acc;
  }, {});
  
  // Dersler array'ini oluştur
  const dersler = Object.values(subjectsMap);

  // Kategori başlık bilgisini bul
  const categoryData = MAIN_EXAMS.find(e => e.id === categoryId);

  return {
    props: {
      categoryData,
      dersler,
      categorySlug,
    },
    revalidate: 60, // 60 saniyede bir yeniden oluştur
  };
}
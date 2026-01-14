// pages/index.js

import Head from 'next/head';
import Link from 'next/link';

export const runtime = 'edge';

// 1. ANA SINAV KATEGORİLERİ (Final Liste)
const MAIN_EXAMS = [
  { id: 'TYT', title: 'Temel Yeterlilik Testi (TYT)', desc: 'Üniversiteye girişin ilk adımı. Türkçe, Matematik ve Fen Bilimleri testleri.', color: 'red', icon: 'fa-pencil-ruler', link: '/kategori/tyt' },
  { id: 'AYT', title: 'Alan Yeterlilik Testleri (AYT)', desc: 'Lisans bölümleri için gerekli alan bilgisi testleri (Matematik, Fen, Edebiyat).', color: 'purple', icon: 'fa-brain', link: '/kategori/ayt' },
  { id: 'LGS', title: 'Liselere Geçiş Sınavı (LGS)', desc: 'Lise yerleştirmesi için Fen ve Matematik ağırlıklı konular.', color: 'green', icon: 'fa-school', link: '/kategori/lgs' },
  { id: 'DGS', title: 'Dikey Geçiş Sınavı (DGS)', desc: 'Önlisans mezunları için sayısal ve sözel yetenek testleri.', color: 'cyan', icon: 'fa-graduation-cap', link: '/kategori/dgs' },
  { id: 'YDT', title: 'Yabancı Dil Testi (YDT)', desc: 'İngilizce ve diğer diller için Yükseköğretim Kurumları Sınavı dil testi.', color: 'orange', icon: 'fa-language', link: '/kategori/ydt' },
];

// 2. Renk Eşleştirmeleri
const COLOR_MAP = {
  TYT: { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-500', linkBg: 'bg-red-600 hover:bg-red-700' },
  AYT: { text: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-500', linkBg: 'bg-purple-600 hover:bg-purple-700' },
  LGS: { text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-500', linkBg: 'bg-green-600 hover:bg-green-700' },
  DGS: { text: 'text-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-500', linkBg: 'bg-cyan-600 hover:bg-cyan-700' },
  YDT: { text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-500', linkBg: 'bg-orange-600 hover:bg-orange-700' },
};

// 3. Her Bir Sınav İçin Öne Çıkan Ana Dersler (STATİK VERİ)
const FEATURED_COURSES = {
  TYT: [
    { title: 'TYT Türkçe', slug: 'tyt-turkce', desc: 'Dil bilgisi ve Anlam Bilgisi. Ses bilgisi, sözcükte yapı.' },
    { title: 'TYT Matematik', slug: 'tyt-matematik', desc: 'Temel kavramlar, problemler ve geometri başlangıcı.' },
    { title: 'TYT Fizik', slug: 'tyt-fizik', desc: 'Kuvvet, hareket ve enerji konuları.' },
  ],
  AYT: [
    { title: 'AYT Edebiyat', slug: 'ayt-edebiyat', desc: 'Divan ve Halk edebiyatı, edebi akımlar.' },
    { title: 'AYT Matematik', slug: 'ayt-matematik', desc: 'Trigonometri, limit ve türev.' },
    { title: 'AYT Kimya', slug: 'ayt-kimya', desc: 'Kimyasal tepkimeler ve organik kimya.' },
  ],
  LGS: [
    { title: 'LGS Matematik', slug: 'lgs-matematik', desc: 'Üslü sayılar, köklü sayılar ve olasılık.' },
    { title: 'LGS Fen', slug: 'lgs-fen', desc: 'Kalıtım ve basınç konuları.' },
    { title: 'LGS İnkılap', slug: 'lgs-inkilap', desc: 'Atatürkçülük ve Milli Mücadele dönemi.' },
  ],
  DGS: [
    { title: 'DGS Sayısal', slug: 'dgs-sayisal-dersleri', desc: 'Sayısal mantık ve temel matematik.' },
    { title: 'DGS Sözel', slug: 'dgs-sozel-dersleri', desc: 'Sözel mantık ve paragrafta anlam.' },
  ],
  YDT: [
    { title: 'YDT İngilizce', slug: 'ydt-ingilizce', desc: 'Kelime, okuma ve dilbilgisi testleri.' },
    { title: 'YDT Almanca', slug: 'ydt-almanca', desc: 'Almanca kelime ve dilbilgisi testleri.' },
    { title: 'YDT Fransızca', slug: 'ydt-fransizca', desc: 'Fransızca dilbilgisi ve okuma testleri.' },
  ],
};


const ExamSection = ({ exam }) => {
  const coursesToShow = FEATURED_COURSES[exam.id] || [];
  const colors = COLOR_MAP[exam.id];

  if (!colors) return null;

  const dynamicClasses = `text-red-700 bg-red-50 border-red-500 bg-red-600 hover:bg-red-700 
                          text-purple-700 bg-purple-50 border-purple-500 bg-purple-600 hover:bg-purple-700
                          text-green-700 bg-green-50 border-green-500 bg-green-600 hover:bg-green-700
                          text-blue-700 bg-blue-50 border-blue-500 bg-blue-600 hover:bg-blue-700
                          text-yellow-700 bg-yellow-50 border-yellow-500 bg-yellow-600 hover:bg-yellow-700
                          text-cyan-700 bg-cyan-50 border-cyan-500 bg-cyan-600 hover:bg-cyan-700
                          text-orange-700 bg-orange-50 border-orange-500 bg-orange-600 hover:bg-orange-700`;


  return (
    <section className="mb-8 md:mb-12">
      <h2 className={`text-2xl md:text-4xl font-serif font-extrabold ${colors.text} mb-3 md:mb-4 flex items-center flex-wrap`}>
        <i className={`fa-solid ${exam.icon} mr-2 md:mr-4 text-xl md:text-2xl`}></i>
        <span className="break-words">{exam.title} Öne Çıkan Dersleri</span>
      </h2>
      <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 border-b pb-3 md:pb-4 px-2 md:px-0">
        {exam.desc} En popüler dersleri aşağıdan seçerek quiz çözmeye başlayın.
      </p>

      {/* Ders Kartları Grid Düzeni */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {coursesToShow.map((course) => (
          <Link
            href={`/ders/${course.slug}`}
            key={course.slug || course.title}
            className={`group block p-4 md:p-5 ${colors.bg} border-l-4 ${colors.border} rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95`}
          >
            <div className="flex items-center mb-2">
              <h3 className={`text-lg md:text-xl font-serif font-bold text-gray-800 group-hover:${colors.text} transition-colors duration-300 break-words`}>
                {course.title}
              </h3>
            </div>

            <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
              {course.desc}
            </p>

            <p className={`text-right text-xs ${colors.text} mt-2 md:mt-3 font-semibold`}>
              Tüm Konuları Gör →
            </p>
          </Link>
        ))}
      </div>

      {/* Tüm Dersleri Gör Butonu (Kategoriye Link Verir) */}
      <div className="text-center mt-6 md:mt-8">
        <Link
          href={exam.link}
          className={`inline-flex items-center px-4 md:px-6 py-2 md:py-3 border border-transparent text-sm md:text-base font-medium rounded-md shadow-sm text-white ${colors.linkBg} transition-colors duration-300 active:scale-95 min-h-[44px] justify-center`}
        >
          <span className="break-words">Tüm {exam.title} Derslerine Git</span>
          <i className="fa-solid fa-arrow-right ml-2"></i>
        </Link>
      </div>

      {/* Gizli div Tailwind'i renklere zorlamak için */}
      <div className={dynamicClasses} style={{ display: 'none' }}></div>
    </section>
  );
};


export default function HomePage() {
  const blueBg = "bg-blue-50";
  const blueBorder = "border-blue-500";

  return (
    <>
      <Head>
        <title>xDers - TYT, AYT, LGS Quizleri</title>
        <meta name="description" content="Türkiye'nin en kapsamlı sınav hazırlık quiz sitesi. TYT, AYT ve LGS için binlerce soru çözün." />
      </Head>

      {/* 💥 DÜZELTME BURADA: `mx-auto` sınıfı kaldırıldı. 
          Bu, içeriğin Sidebar'dan sonra düzgün hizalanmasını sağlar. */}
      <div className="p-3 md:p-4 lg:p-8 max-w-6xl mx-auto">

        {/* 1. Hoş Geldiniz Başlığı ve Tanıtım Alanı */}
        <header className="relative overflow-hidden rounded-2xl shadow-lg mb-8 md:mb-12 border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-indigo-50">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-br from-blue-200/60 to-indigo-200/40 blur-2xl"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-br from-cyan-200/40 to-blue-200/30 blur-2xl"></div>

          <div className="relative p-5 md:p-10 text-center">
            <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border border-blue-200/70 bg-white/70 text-blue-800 text-xs font-semibold mb-4">
              <i className="fa-solid fa-bolt"></i>
              Hızlı quiz • 10 soru
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-extrabold text-gray-900 leading-tight">
              <span className="text-gray-900">x</span>
              <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 bg-clip-text text-transparent">Ders</span>
              <span className="block">Portalına Hoş Geldiniz</span>
            </h1>

            <p className="mt-4 text-base md:text-xl text-gray-600 font-sans max-w-2xl mx-auto">
              Merkezi sınavlara hazırlıkta en güncel ve rastgele TYT, AYT, LGS, DGS ve YDT testleri.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/kategori/tyt" className="inline-flex items-center justify-center min-h-[44px] px-5 py-3 rounded-xl bg-blue-700 text-white font-semibold shadow-md hover:bg-blue-800 transition">
                TYT ile Başla
                <i className="fa-solid fa-arrow-right ml-2"></i>
              </Link>
              <Link href="/kategori/ayt" className="inline-flex items-center justify-center min-h-[44px] px-5 py-3 rounded-xl bg-white/80 text-gray-900 font-semibold border border-gray-200 hover:bg-white transition">
                AYT Dersleri
              </Link>
            </div>
          </div>
        </header>

        {/* 2. Tüm Sınav Kategorilerini Listeleyen Bölüm */}
        {MAIN_EXAMS.map(exam => (
          <ExamSection
            key={exam.id}
            exam={exam}
          />
        ))}

        {/* Genel bilgilendirme */}
        <div className="text-center text-gray-500 py-6 md:py-10 text-sm md:text-base px-2">
          Tüm quizler, sınav türlerine göre yukarıda listelenmiştir. Başarılar dileriz!
        </div>

      </div>
    </>
  );
}
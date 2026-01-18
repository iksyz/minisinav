// pages/quiz/[slug].js

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import quizData from '../../sorular.json';

function AdsterraBanner300x250() {
    const hostRef = useRef(null);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;

        host.innerHTML = '';

        const inline = document.createElement('script');
        inline.type = 'text/javascript';
        inline.text = `atOptions = {\n  'key' : '23d2deabf9bcc9b24c625b789f02b6a7',\n  'format' : 'iframe',\n  'height' : 250,\n  'width' : 300,\n  'params' : {}\n};`;

        const invoke = document.createElement('script');
        invoke.type = 'text/javascript';
        invoke.src = 'https://www.highperformanceformat.com/23d2deabf9bcc9b24c625b789f02b6a7/invoke.js';
        invoke.async = false;

        host.appendChild(inline);
        host.appendChild(invoke);
    }, []);

    return <div ref={hostRef} className="adsterra-300x250" />;
}

// --- Şık Karıştırma Fonksiyonu (Fisher-Yates Shuffle) ---
// Her defasında şıkların sırasını da karıştırmak iyi bir fikirdir.
function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

// --- AKADEMİK/EĞİTİM TEMALI Quiz Oynatıcısı (10 Soru Seçme Özellikli) ---
function QuizPlayer({ quiz }) {
    const router = useRouter();
    const questionTopRef = useRef(null);
    // Bu state, quiz'in tüm sorularından rastgele seçtiğimiz 10 soruyu tutacak
    const [aktifSorular, setAktifSorular] = useState([]);

    const [soruIndex, setSoruIndex] = useState(0);
    const [skor, setSkor] = useState(0);
    const [testBitti, setTestBitti] = useState(false);
    const [secimYapildi, setSecimYapildi] = useState(false);
    const [secilenSik, setSecilenSik] = useState(null);
    const [personalityScores, setPersonalityScores] = useState({});
    const [ilerleme, setIlerleme] = useState(0);

    const toplamSoru = aktifSorular.length; // Artık 10 (veya daha azsa o kadar)
    const mevcutSoru = aktifSorular[soruIndex]; // Aktif olan 10 sorudan çekiyoruz

    // --- QUIZ'İ BAŞLATMA VE SORULARI SEÇME FONKSİYONU ---
    const quizBaslat = () => {
        setSoruIndex(0);
        setSkor(0);
        setTestBitti(false);
        setSecimYapildi(false);
        setSecilenSik(null);
        setPersonalityScores({});
        setIlerleme(0);

        // 1. Tüm soruları al
        const tumSorular = [...quiz.sorular];

        // 2. Soruları karıştır (Fisher-Yates)
        const karisikSorular = shuffleArray(tumSorular);

        // 3. İlk 10 tanesini al (veya 10'dan azsa hepsini)
        // AYNI ZAMANDA ŞIKLARI DA KARIŞTIR
        const secilen10Soru = karisikSorular.slice(0, 10).map(soru => ({
            ...soru,
            siklar: shuffleArray([...soru.siklar]) // Her sorunun şıklarını da karıştır
        }));

        setAktifSorular(secilen10Soru);

        // İlk ilerlemeyi ayarla
        if (secilen10Soru.length > 0) {
            setTimeout(() => setIlerleme((1 / secilen10Soru.length) * 100), 100);
        }
    };

    // --- Component ilk yüklendiğinde quiz'i başlat ---
    useEffect(() => {
        quizBaslat();
    }, [quiz]); // 'quiz' prop'u yüklendiğinde bir kez çalışır

    useEffect(() => {
        if (!router.isReady) return;
        const slug = router.query.slug;
        if (!slug) return;
        if (toplamSoru <= 0) return;

        router.replace(
            {
                pathname: `/quiz/${slug}`,
                query: { q: String(soruIndex + 1) },
            },
            undefined,
            { shallow: true, scroll: false }
        );
    }, [router.isReady, router.query.slug, soruIndex, toplamSoru]);

    // --- Soru ilerlemesini yönet ---
    useEffect(() => {
        if (toplamSoru > 0) {
            // İlerlemeyi bir önceki biten soruya göre ayarla
            setIlerleme(((soruIndex) / toplamSoru) * 100);
            // Cevap seçildiğinde, barın dolmasını sağla
            if (secimYapildi) {
                setTimeout(() => {
                    setIlerleme(((soruIndex + 1) / toplamSoru) * 100);
                }, 300); // 300ms sonra bar dolsun
            }
        }
    }, [soruIndex, secimYapildi, toplamSoru]);

    useEffect(() => {
        const el = questionTopRef.current;
        if (!el) return;

        const headerOffset = 84;
        const top = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, [soruIndex]);


    const handleOptionClick = (sik) => {
        if (secimYapildi) return;
        setSecimYapildi(true);
        setSecilenSik(sik.metin);

        if (quiz.quizTipi === 'knowledge') {
            if (sik.dogru) {
                setSkor(skor + 1);
            }
        } else if (quiz.quizTipi === 'personality') {
            const sonucId = sik.sonucId;
            setPersonalityScores(prev => ({ ...prev, [sonucId]: (prev[sonucId] || 0) + 1 }));
        }
    };

    const handleNextQuestion = () => {
        setSecimYapildi(false);
        setSecilenSik(null);
        if (soruIndex < toplamSoru - 1) {
            setSoruIndex(soruIndex + 1);
        } else {
            setTestBitti(true);
        }
    };

    const handleTryAgain = () => {
        quizBaslat(); // Testi yeniden başlatırken soruları TEKRAR karıştırır
    };

    // --- YÜKLENİYOR EKRANI ---
    if (!mevcutSoru) {
        return (
            <div className="text-center text-gray-700 p-8">
                Quiz yükleniyor, sorular hazırlanıyor...
            </div>
        );
    }

    // --- SONUÇ EKRANI ---
    if (testBitti) {
        let sonucElementi;
        if (quiz.quizTipi === 'knowledge') {
            sonucElementi = (
                <>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 mb-4">
                        <i className="fa-solid fa-award text-blue-700 text-2xl"></i>
                    </div>
                    <h2 className="text-2xl font-serif font-semibold mb-2 text-gray-900">Test Bitti</h2>
                    <p className="text-sm text-gray-600">{quiz.quizBasligi}</p>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                            <div className="text-xs text-gray-500">Skor</div>
                            <div className="text-3xl font-extrabold text-blue-800">{skor}/{toplamSoru}</div>
                        </div>
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                            <div className="text-xs text-gray-500">Doğru</div>
                            <div className="text-3xl font-extrabold text-green-700">{skor}</div>
                        </div>
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                            <div className="text-xs text-gray-500">Yanlış</div>
                            <div className="text-3xl font-extrabold text-red-700">{Math.max(0, toplamSoru - skor)}</div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">Toplam {quiz.sorular.length} sorudan bu turda {toplamSoru} soru soruldu.</p>
                </>
            );
        } else {
            // Kişilik testi sonucu
            let enYuksekSonucId = null;
            let enYuksekPuan = 0;
            for (const sonucId in personalityScores) {
                if (personalityScores[sonucId] > enYuksekPuan) {
                    enYuksekPuan = personalityScores[sonucId];
                    enYuksekSonucId = sonucId;
                }
            }
            const sonucDetayi = quiz.sonuclar.find(s => s.id === enYuksekSonucId);

            sonucElementi = (
                <>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 mb-4">
                        <i className="fa-solid fa-wand-magic-sparkles text-indigo-700 text-2xl"></i>
                    </div>
                    <h2 className="text-2xl font-serif font-semibold mb-2 text-gray-900">Test Bitti</h2>
                    <p className="text-sm text-gray-600">{quiz.quizBasligi}</p>
                    <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-left">
                        <div className="text-xs text-gray-500 mb-1">Sonucun</div>
                        <h3 className="text-2xl md:text-3xl font-serif font-extrabold text-blue-800">{sonucDetayi ? sonucDetayi.baslik : 'Sonuç Bulunamadı'}</h3>
                        <p className="text-base text-gray-700 leading-relaxed mt-3">{sonucDetayi ? sonucDetayi.aciklama : ''}</p>
                    </div>
                </>
            );
        }

        const categorySlug = (quiz.kategori || '').toLowerCase().replace(/ /g, '-');
        const dersSlug = quiz.dersSlug;
        const sameCourseQuizzes = quizData
            .filter(q => q.dersSlug === dersSlug && q.slug !== quiz.slug)
            .slice(0, 6);
        const otherCoursesInCategory = quizData
            .filter(q => q.kategori === quiz.kategori && q.dersSlug && q.dersSlug !== dersSlug)
            .reduce((acc, q) => {
                if (!acc.find(x => x.dersSlug === q.dersSlug)) {
                    acc.push({ ders: q.ders, dersSlug: q.dersSlug });
                }
                return acc;
            }, [])
            .slice(0, 6);

        return (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    {sonucElementi}
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        onClick={handleTryAgain}
                        className="w-full bg-blue-700 text-white p-4 rounded-xl font-bold text-base hover:bg-blue-800 shadow-md transition-all duration-300"
                    >
                        Tekrar Dene (Yeni Sorularla)
                    </button>
                    {dersSlug ? (
                        <Link
                            href={`/ders/${dersSlug}`}
                            className="w-full inline-flex items-center justify-center bg-white text-gray-900 p-4 rounded-xl font-bold text-base border border-gray-200 hover:bg-gray-50 transition-all duration-300"
                        >
                            Bu Dersin Konuları
                        </Link>
                    ) : (
                        <Link
                            href="/"
                            className="w-full inline-flex items-center justify-center bg-white text-gray-900 p-4 rounded-xl font-bold text-base border border-gray-200 hover:bg-gray-50 transition-all duration-300"
                        >
                            Ana Sayfa
                        </Link>
                    )}
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6">
                    {sameCourseQuizzes.length > 0 && (
                        <div className="text-left">
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">Bu dersten devam et</h3>
                                {dersSlug && (
                                    <Link href={`/ders/${dersSlug}`} className="text-sm font-semibold text-blue-700 hover:text-blue-800">
                                        Tüm konular →
                                    </Link>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {sameCourseQuizzes.map((q) => (
                                    <Link
                                        key={q.slug}
                                        href={`/quiz/${q.slug}`}
                                        className="group rounded-xl border border-gray-100 bg-gray-50 p-4 hover:bg-white hover:shadow-sm transition"
                                    >
                                        <div className="text-sm font-bold text-gray-900 group-hover:text-blue-800">{q.quizBasligi}</div>
                                        <div className="text-xs text-gray-600 mt-1">
                                            {(q.metaDesc || '').slice(0, 90)}{q.metaDesc && q.metaDesc.length > 90 ? '...' : ''}
                                        </div>
                                        <div className="text-xs font-semibold text-blue-700 mt-3">Teste Başla →</div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {otherCoursesInCategory.length > 0 && (
                        <div className="text-left">
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">Benzer dersler</h3>
                                {categorySlug && (
                                    <Link href={`/kategori/${categorySlug}`} className="text-sm font-semibold text-blue-700 hover:text-blue-800">
                                        Kategoriye git →
                                    </Link>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {otherCoursesInCategory.map((c) => (
                                    <Link
                                        key={c.dersSlug}
                                        href={`/ders/${c.dersSlug}`}
                                        className="group rounded-xl border border-gray-100 bg-gray-50 p-4 hover:bg-white hover:shadow-sm transition"
                                    >
                                        <div className="text-sm font-bold text-gray-900 group-hover:text-blue-800">{c.ders}</div>
                                        <div className="text-xs font-semibold text-blue-700 mt-3">Konuları gör →</div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- SORU GÖSTERME EKRANI ---
    return (
        <div ref={questionTopRef} className="bg-white p-5 md:p-8 rounded-lg shadow-xl border border-gray-200">
            {/* İlerleme Çubuğu */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                    className="bg-blue-700 h-2.5 rounded-full"
                    style={{ width: `${ilerleme}%`, transition: 'width 0.5s ease-in-out' }}
                ></div>
            </div>
            <p className="text-right text-sm text-gray-500 mb-4">Soru {soruIndex + 1} / {toplamSoru}</p>

            {/* Soru Başlığı */}
            <h2
                className="text-2xl md:text-3xl font-serif font-semibold mb-6 text-gray-900"
                // JSON'daki *italik* gibi basit markdown'ları HTML'e çevir
                // Hem "soru" hem de "question" formatını destekle
                dangerouslySetInnerHTML={{ __html: (mevcutSoru.soru || mevcutSoru.question || '').replace(/\*(.*?)\*/g, '<i>$1</i>') }}
            >
            </h2>

            {/* Şıklar */}
            <ul className="space-y-4">
                {mevcutSoru.siklar.map((sik, index) => {
                    const isSelected = secilenSik === sik.metin;
                    let sikRengi = 'bg-white text-gray-800 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50'; // Normal
                    let icon = '';

                    if (secimYapildi) {
                        sikRengi = 'bg-gray-100 text-gray-500 border-2 border-gray-200 cursor-not-allowed'; // Cevaplandıktan sonra diğerleri
                        if (quiz.quizTipi === 'knowledge') {
                            if (sik.dogru) {
                                sikRengi = 'bg-green-100 text-green-800 border-2 border-green-500'; // Doğru
                                icon = '✓';
                            } else if (isSelected) {
                                sikRengi = 'bg-red-100 text-red-800 border-2 border-red-500'; // Seçilen yanlış
                                icon = '✗';
                            }
                        } else if (quiz.quizTipi === 'personality') {
                            if (isSelected) {
                                sikRengi = 'bg-blue-100 text-blue-800 border-2 border-blue-500'; // Kişilik testinde seçilen
                                icon = '✓';
                            }
                        }
                    }

                    return (
                        <li
                            key={index} // Şıklar karıştığı için index key olarak daha güvenli
                            onClick={() => handleOptionClick(sik)}
                            className={`flex justify-between items-center p-4 rounded-md cursor-pointer transition-all duration-200 ${sikRengi} ${!secimYapildi ? 'hover:scale-[1.02]' : ''}`}
                        >
                            <span
                                className="font-medium"
                                // JSON'daki *italik* gibi basit markdown'ları HTML'e çevir
                                dangerouslySetInnerHTML={{ __html: sik.metin.replace(/\*(.*?)\*/g, '<i>$1</i>') }}
                            >
                            </span>
                            {icon && <span className={`text-xl font-bold ml-4 ${sik.dogru ? 'text-green-700' : 'text-red-700'}`}>{icon}</span>}
                        </li>
                    );
                })}
            </ul>

            <div className="mt-6">
                <div id="ad-banner-question-bottom" className="w-full flex justify-center">
                    <AdsterraBanner300x250 key={`q-${soruIndex}`} />
                </div>
            </div>

            {/* Fun Fact ve Sonraki Buton */}
            {secimYapildi && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    {mevcutSoru.funFact && (
                        <div className="bg-gray-100 border-l-4 border-gray-400 text-gray-700 p-4 rounded-md mb-6">
                            <h4 className="font-bold text-gray-800">İlginç Bilgi!</h4>
                            <p className="text-sm mt-1">{mevcutSoru.funFact}</p>
                        </div>
                    )}
                    <button
                        onClick={handleNextQuestion}
                        className="w-full mt-4 bg-blue-700 text-white p-4 rounded-md font-bold text-lg hover:bg-blue-800 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
                    >
                        {soruIndex < toplamSoru - 1 ? 'Sonraki Soru →' : 'Sonuçları Göster'}
                    </button>
                </div>
            )}
        </div>
    );
}

// --- Sayfanın Ana Componenti (Arka plan stilleri _app.js'e taşındı) ---
export default function QuizPage({ quiz }) {
    const router = useRouter();
    const hasQuestionParam = Boolean(router?.query?.q);

    if (!quiz) {
        return <p>Quiz yüklenirken bir sorun oluştu.</p>;
    }
    return (
        <>
            <Head>
                <title>{quiz.metaTitle}</title>
                <meta name="description" content={quiz.metaDesc} />
                <meta name="robots" content={hasQuestionParam ? 'noindex,follow' : 'index,follow'} />
                <meta property="og:title" content={quiz.metaTitle} />
                <meta property="og:description" content={quiz.metaDesc} />
                <meta property="og:image" content={quiz.ogImage} />
                {/* Fontlar artık _document.js dosyasından yükleniyor */}
            </Head>

            {/* Global stiller (arka plan rengi, fontlar) artık pages/_app.js dosyasından geliyor.
              Buradaki style bloğunu sildik.
            */}

            <div className="container mx-auto p-4 max-w-2xl min-h-screen">
                <div className="text-center mb-4">
                    <Link href="/" className="text-gray-600 hover:text-blue-700 transition-colors">
                        ← Anasayfaya Dön
                    </Link>
                </div>

                <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-gray-900 mb-4">
                    {quiz.quizBasligi}
                </h1>

                <QuizPlayer quiz={quiz} />
            </div>
        </>
    );
}

// --- getStaticPaths (Değişmedi) ---
export async function getStaticPaths() {
    if (!Array.isArray(quizData)) {
        console.error("HATA: sorular.json bir dizi değil!");
        return { paths: [], fallback: false };
    }
    const paths = quizData.map((quiz) => ({
        params: { slug: quiz.slug },
    }));
    return { paths, fallback: false };
}

// --- getStaticProps (Değişmedi) ---
export async function getStaticProps({ params }) {
    const { slug } = params;
    if (!Array.isArray(quizData)) {
        console.error("HATA: sorular.json bir dizi değil!");
        return { props: { quiz: null } };
    }
    const quiz = quizData.find((q) => q.slug === slug);
    return {
        props: {
            quiz: quiz || null,
        },
    };
}
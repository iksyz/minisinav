import Head from 'next/head';

export const runtime = 'edge';

export default function GizlilikPage() {
    return (
        <>
            <Head>
                <title>Gizlilik Politikası | xDers</title>
                <meta name="description" content="xDers gizlilik politikası" />
            </Head>

            <div className="p-4 md:p-8 max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-gray-900 mb-4">Gizlilik Politikası</h1>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-7 space-y-4 text-gray-700 leading-relaxed">
                    <p>
                        Bu sayfa bilgilendirme amaçlı bir taslaktır. Üretim ortamında; çerezler, analiz araçları,
                        kayıt/loglama süreçleri ve üçüncü taraf hizmetler için güncellenmelidir.
                    </p>
                    <h2 className="text-xl font-semibold text-gray-900 pt-2">Toplanan Veriler</h2>
                    <p>
                        xDers; hizmeti sunmak ve iyileştirmek için sınırlı teknik veriler (ör. tarayıcı türü, hata kayıtları)
                        toplayabilir.
                    </p>
                    <h2 className="text-xl font-semibold text-gray-900 pt-2">Çerezler</h2>
                    <p>
                        Çerezler, oturum yönetimi ve kullanıcı deneyimini geliştirmek için kullanılabilir.
                    </p>
                    <h2 className="text-xl font-semibold text-gray-900 pt-2">İletişim</h2>
                    <p>
                        Gizlilikle ilgili soruların için İletişim sayfasından bize ulaşabilirsin.
                    </p>
                </div>
            </div>
        </>
    );
}

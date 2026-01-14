import Head from 'next/head';

export default function HakkindaPage() {
    return (
        <>
            <Head>
                <title>Hakkında | xDers</title>
                <meta name="description" content="xDers hakkında" />
            </Head>

            <div className="p-4 md:p-8 max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-gray-900 mb-4">Hakkında</h1>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-7 space-y-4 text-gray-700 leading-relaxed">
                    <p>
                        xDers, TYT, AYT, LGS ve diğer sınavlara hazırlanan öğrenciler için pratik yapmayı kolaylaştıran
                        bir quiz platformudur.
                    </p>
                    <p>
                        Amacımız; anlaşılır bir arayüz, hızlı erişim ve rastgele soru deneyimiyle düzenli tekrar yapmanı
                        desteklemektir.
                    </p>
                    <p>
                        Geri bildirimlerin bizim için çok değerli. İletişim sayfasından bize ulaşabilirsin.
                    </p>
                </div>
            </div>
        </>
    );
}

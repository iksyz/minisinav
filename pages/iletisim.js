import Head from 'next/head';

export const runtime = 'experimental-edge';

export default function IletisimPage() {
    return (
        <>
            <Head>
                <title>İletişim | xDers</title>
                <meta name="description" content="xDers iletişim" />
            </Head>

            <div className="p-4 md:p-8 max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-gray-900 mb-4">İletişim</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-7 space-y-3 text-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900">Bize Ulaş</h2>
                        <p>
                            Öneri, hata bildirimi veya iş birliği taleplerin için aşağıdaki kanalları kullanabilirsin.
                        </p>
                        <div className="space-y-2">
                            <p><span className="font-semibold">E-posta:</span> ipekyuzemre65@gmail.com</p>
                            <p><span className="font-semibold">Instagram:</span> @xders</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5 md:p-7">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Hızlı Geri Bildirim</h2>
                        <p className="text-gray-700 mb-4">
                            En hızlı dönüş için mesajına ekran görüntüsü ve cihaz bilgisi (telefon modeli / tarayıcı) ekleyebilirsin.
                        </p>
                        <div className="rounded-lg bg-white/70 border border-white p-4 text-gray-700">
                            <p className="font-semibold">Örnek konu:</p>
                            <p className="text-sm">“Mobilde quiz sayfasında butonlar taşmış görünüyor”</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

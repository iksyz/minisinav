// pages/_error.js

function Error({ statusCode }) {
    return (
        <div className="p-6 md:p-10 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-serif font-extrabold text-gray-900">Bir hata oluştu</h1>
                <p className="mt-2 text-gray-600">
                    {statusCode ? `Hata Kodu: ${statusCode}` : 'Beklenmeyen bir hata oluştu.'}
                </p>
            </div>
        </div>
    );
}

export default Error;

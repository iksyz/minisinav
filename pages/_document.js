// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  const shouldLoadAdsterraSocialBar = process.env.NODE_ENV === 'production';

  return (
    <Html lang="tr">
      <Head>
        {/* sidebar.css ve Font Awesome gibi tüm dış linkler burada */}
        <link rel="stylesheet" href="/navbar.css" />
        <link rel="icon" href="/xders-logo.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0B1220" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </Head>

      <body>
        <Main />
        <NextScript />
        {/* script.js (toggle ve submenu'leri çalıştıran JS) */}
        <script src="/script.js" defer></script>
        {shouldLoadAdsterraSocialBar && (
          <script
            src="https://pl28480860.effectivegatecpm.com/2d/e4/ba/2de4ba6139514fa6025c8052add1e666.js"
            defer
          ></script>
        )}
      </body>
    </Html>
  )
}
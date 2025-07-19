import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <script src="https://cdn.tailwindcss.com"></script>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Simple scrollbar styling for better aesthetics */
              ::-webkit-scrollbar { width: 8px; height: 8px; }
              ::-webkit-scrollbar-track { background: #f1f1f1; }
              .dark ::-webkit-scrollbar-track { background: #1e293b; }
              ::-webkit-scrollbar-thumb { background: #a8b0b9; border-radius: 4px; }
              ::-webkit-scrollbar-thumb:hover { background: #88929c; }
            `,
          }}
        />
      </Head>
      <body className="bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head/>
      <body className="antialiased select-none transition-all duration-500 bg-gradient-to-t from-blue-200 via-blue-500 to-blue-800 bg-size-200 dark:bg-pos-0 bg-pos-100 overflow-hidden">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// bg-gradient-to-tr from-gray-300 to-white dark:from-slate-900 dark:to-blue-950
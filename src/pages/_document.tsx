import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head/>
      <body className="antialiased select-none transition-colors duration-500 bg-blue-300 dark:bg-slate-900 overflow-hidden">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
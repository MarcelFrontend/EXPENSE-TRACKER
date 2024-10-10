import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head/>
      <body className="antialiased select-none bg-white dark:bg-slate-900 transition-colors duration-700 overflow-hidden">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

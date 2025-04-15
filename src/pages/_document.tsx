import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {

  return (
    <Html lang="en" className="dark">
      <Head>
        <title>Expense Tracker</title>
      </Head>
      <body className="antialiased select-none transition-colors duration-500 bg-blue-100 dark:bg-black overflow-hidden">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
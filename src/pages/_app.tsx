import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { DataProvider } from '@/context/DataProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <DataProvider>
        <Component {...pageProps} />
      </DataProvider>
    </ThemeProvider>
  )
}

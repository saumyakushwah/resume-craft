import "@/styles/globals.scss";
import { MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider>
      <Notifications position="top-center" />
      <Component {...pageProps} />
    </MantineProvider>
  );
}

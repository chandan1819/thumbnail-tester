import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../app/theme-provider";
import DeviceInfo from './components/DeviceInfo';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Thumbnail Tester",
  description: "A/B test your YouTube thumbnails",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <DeviceInfo />
        </ThemeProvider>
      </body>
    </html>
  );
}

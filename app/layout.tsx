import type { Metadata } from "next";
import { Afacad } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const afacadSans = Afacad({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "WeatherPup",
  description: "Weather app for dog lovers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={afacadSans.variable}>
      <body
        className={`${afacadSans.variable} ${afacadSans.variable} antialiased`}
      >
        <ThemeProvider
          attribute={"class"}
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Toaster} from "@/components/ui/sonner";
import {auth} from "@/lib/auth";
import {NavBar} from "@/components/ui/navBar";
import {ThemeProvider} from "@/components/theme-provider";
import {strings} from "@/constans/strings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${strings.appName}`,
    default: `${strings.appName}`
  },
  description: `${strings.pages.home} | ${strings.appName}`
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();

  //console.log('session::', session);

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NavBar session={session} />
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster position={"top-center"}/>
        </ThemeProvider>
      </body>
    </html>
  );
}

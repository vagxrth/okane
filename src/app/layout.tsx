import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OKANE",
  description: "OKANE is a platform for transferring money between users.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(35, 35, 60, 0.98)',
                border: '1px solid rgba(155, 135, 245, 0.3)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                fontSize: '1rem',
                color: 'white',
                fontWeight: '500'
              },
              classNames: {
                toast: 'group',
                title: 'text-white font-medium text-[15px]'
              }
            }}
            closeButton
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

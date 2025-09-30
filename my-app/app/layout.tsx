import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from '@/app/(user)/cart/CartContext';
import ErrorMonitor from '@/app/components/ErrorMonitor';

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Online Shop",
  description: "Online Shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className} suppressHydrationWarning>
        <CartProvider>
          <ErrorMonitor />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unique Tasty Meals",
  description: "Modern African Cuisine Pre-Order System",
};

import { AuthProvider } from "@/components/auth/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} font-sans antialiased text-[#1e1414] bg-[#f8f6f6]`}
      >
        <AuthProvider>
          <Navbar />
          <Toaster position="bottom-right" />
          <div className="pt-16 md:pt-20">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}

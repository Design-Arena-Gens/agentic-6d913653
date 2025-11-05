import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sign Language Interpreter - Real-time Speech to Sign",
  description: "Live speech-to-sign-language animation with anime-style avatar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-900 text-white">
        {children}
      </body>
    </html>
  );
}

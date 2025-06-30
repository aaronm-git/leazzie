import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leazzie",
  description: "Leazzie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <main className="container mx-auto">{children}</main>
        <Toaster position="top-right" richColors duration={3000} />
      </body>
    </html>
  );
}

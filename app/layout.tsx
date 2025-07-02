import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

import LeazzyLogo from "@/public/favicon_io/favicon-32x32.png";
import LeazzyLogo2 from "@/public/favicon_io/favicon-16x16.png";
import LeazzyLogo3 from "@/public/favicon_io/android-chrome-192x192.png";
import LeazzyLogo4 from "@/public/favicon_io/android-chrome-512x512.png";

const favicons = [LeazzyLogo, LeazzyLogo2, LeazzyLogo3, LeazzyLogo4];

export const metadata: Metadata = {
  title: "Leazzie",
  description: "Leazzie",
  icons: favicons.map((favicon) => ({
    url: favicon.src,
    sizes: "any",
    type: "image/png",
  })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="container mx-auto">{children}</main>
        <Toaster position="top-right" richColors duration={3000} />
      </body>
    </html>
  );
}

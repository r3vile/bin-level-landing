import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bin Level — AutoStore Füllstandserkennung | Bis zu 40% mehr Kapazität",
  description:
    "Automatische Füllstandsmessung für AutoStore-Bins. Mehr Kapazität aus Ihrem bestehenden System — ohne Erweiterung, ohne Downtime. Made in Germany.",
  openGraph: {
    title: "Bin Level — AutoStore Füllstandserkennung",
    description:
      "Automatische Füllstandsmessung für AutoStore-Bins. Bis zu 40% mehr Kapazität aus Ihrem bestehenden System.",
    locale: "de_DE",
    type: "website",
    url: "https://binlevel.de",
    siteName: "Bin Level",
  },
  metadataBase: new URL("https://binlevel.de"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Bin Level",
              url: "https://binlevel.de",
              description:
                "Automatische Füllstandsmessung für AutoStore-Bins. Made in Germany.",
              contactPoint: {
                "@type": "ContactPoint",
                email: "info@binlevel.de",
                contactType: "sales",
                availableLanguage: ["German", "English"],
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

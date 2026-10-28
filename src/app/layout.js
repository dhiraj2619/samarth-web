import { Noto_Sans, Roboto } from "next/font/google";
import { preconnect } from "react-dom";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import { API_URL, SITE_NAME, SITE_URL } from "@/config";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  display: "swap",
});
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

const DESCRIPTION =
  "Samarth Enterprises offers a wide range of quality products for your business needs. Explore our collections and connect with us for bulk requirements.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Samarth Enterprises | Reliable Products for a Healthier Tomorrow",
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ["Samarth Enterprises", "wellness products", "bulk purchase", "distributors", "healthy products"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    url: "/",
    title: "Samarth Enterprises | Reliable Products for a Healthier Tomorrow",
    description: DESCRIPTION,
    images: [{ url: "/logo/samarthlogo.png", width: 2048, height: 768, alt: SITE_NAME }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo/samarthlogo.png`,
};

export default function RootLayout({ children }) {
  // Open the connections to the API and the image CDN while the page is still loading.
  preconnect(new URL(API_URL).origin);
  preconnect("https://res.cloudinary.com");

  return (
    // The preloader script sets data-preloader-seen on <html> before React hydrates.
    <html lang="en" suppressHydrationWarning className={`${notoSans.variable} ${roboto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Preloader />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <StoreProvider>
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}

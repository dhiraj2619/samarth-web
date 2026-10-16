import { Noto_Sans, Roboto } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";

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

export const metadata = {
  title: "Samarth Enterprises | Reliable Products for a Healthier Tomorrow",
  description:
    "Samarth Enterprises offers a wide range of quality products for your business needs. Explore our collections and connect with us for bulk requirements.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${notoSans.variable} ${roboto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}

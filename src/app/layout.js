import { Poppins } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Samarth Enterprises | Reliable Products for a Healthier Tomorrow",
  description:
    "Samarth Enterprises offers a wide range of quality products for your business needs. Explore our collections and connect with us for bulk requirements.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}

// app/layout.js
import { Inter } from "next/font/google";
import Header from "../components/Header";
import Footer from "../components/Footer";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lalitpur Queens - Women's Volleyball Team",
  description: "Official website of Lalitpur Queens women's volleyball team",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-queens-white text-queens-black`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

// app/admin/layout.js

export const metadata = {
  title: "Admin Panel",
  description: "Admin panel for managing website content",
  icons: {
    icon: "/images/Lalitpur-queens-logo.png", // Same icon path as main layout
  },
};

import "@/app/globals.css";
import "@/utils/iconConfig";

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-primary">
        <header className="bg-text-primary p-4 text-center">
          <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
        </header>
        <main className="p-8">{children}</main>
      </body>
    </html>
  );
}

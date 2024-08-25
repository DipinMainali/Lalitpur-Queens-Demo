// components/Header.js
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-queens-midnight text-queens-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Lalitpur Queens Logo"
            width={50}
            height={50}
          />
          <span className="ml-2 text-2xl font-bold">Lalitpur Queens</span>
        </Link>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/"
                className="hover:text-queens-emerald transition duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/About"
                className="hover:text-queens-emerald transition duration-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/Team"
                className="hover:text-queens-emerald transition duration-300"
              >
                Team
              </Link>
            </li>
            <li>
              <Link
                href="/Schedule"
                className="hover:text-queens-emerald transition duration-300"
              >
                Schedule
              </Link>
            </li>
            <li>
              <Link
                href="/News"
                className="hover:text-queens-emerald transition duration-300"
              >
                News
              </Link>
            </li>
            <li>
              <Link
                href="/Contact"
                className="hover:text-queens-emerald transition duration-300"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <button
          className="md:hidden text-queens-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-queens-midnight">
          <ul className="px-4 py-2">
            <li>
              <Link
                href="/"
                className="block py-2 hover:text-queens-emerald transition duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="block py-2 hover:text-queens-emerald transition duration-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/team"
                className="block py-2 hover:text-queens-emerald transition duration-300"
              >
                Team
              </Link>
            </li>
            <li>
              <Link
                href="/schedule"
                className="block py-2 hover:text-queens-emerald transition duration-300"
              >
                Schedule
              </Link>
            </li>
            <li>
              <Link
                href="/news"
                className="block py-2 hover:text-queens-emerald transition duration-300"
              >
                News
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="block py-2 hover:text-queens-emerald transition duration-300"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

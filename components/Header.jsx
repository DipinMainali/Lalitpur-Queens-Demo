// components/Header.js
"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-queens-white text-queens-midnight shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="flex items-center group">
          <div className="relative">
            <Image
              src="/images/Lalitpur-queens-logo.png"
              alt="Lalitpur Queens Logo"
              width={60}
              height={0}
              className="transform transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg rounded-full"
            />
          </div>
          <span className="ml-3 text-xl font-extrabold tracking-wide transform transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:text-queens-emerald">
            Lalitpur Queens
          </span>
        </Link>

        {/* Hamburger Button for Mobile */}
        <button className="md:hidden text-queens-midnight" onClick={toggleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Desktop Navbar (Hidden on Mobile) */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {["Home", "About", "Team", "Matches", "News", "Contact"].map(
              (item) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item}`}
                    className="relative text-lg font-semibold uppercase transition duration-300"
                  >
                    <span className="px-4 py-2 rounded-full hover:bg-queens-blue hover:text-queens-white transition-all duration-300">
                      {item}
                    </span>
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-queens-midnight">
          <ul className="px-4 py-4 space-y-4">
            {["Home", "About", "Team", "Matches", "News", "Contact"].map(
              (item) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item}`}
                    className="block py-2 text-lg font-semibold text-queens-white hover:bg-queens-emerald hover:text-queens-white rounded-full transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)} // Close the menu on item click
                  >
                    {item}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

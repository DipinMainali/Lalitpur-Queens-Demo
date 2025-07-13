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
    <header className="bg-white text-text-primary shadow-lg sticky top-0 z-50">
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
          <span className="ml-3 text-xl font-extrabold tracking-wide transform transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:text-brand-secondary">
            Lalitpur Queens
          </span>
        </Link>

        {/* Hamburger Button for Mobile */}
        <button className="md:hidden text-text-primary" onClick={toggleMenu}>
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
                    <span className="px-4 py-2 rounded-full hover:bg-brand-primary hover:text-white transition-all duration-300">
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
        <div className="md:hidden bg-brand-primary">
          <ul className="px-4 py-4 space-y-4">
            {["Home", "About", "Team", "Matches", "News", "Contact"].map(
              (item) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item}`}
                    className="block py-2 text-lg font-semibold text-white hover:bg-brand-secondary hover:text-white rounded-full transition-all duration-300"
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

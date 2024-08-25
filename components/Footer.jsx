// components/Footer.js
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-queens-midnight text-queens-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Lalitpur Queens</h3>
            <p>Empowering women through volleyball</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="hover:text-queens-emerald transition duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="hover:text-queens-emerald transition duration-300"
                >
                  Our Team
                </Link>
              </li>
              <li>
                <Link
                  href="/schedule"
                  className="hover:text-queens-emerald transition duration-300"
                >
                  Match Schedule
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-queens-emerald transition duration-300"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-queens-emerald transition duration-300"
              >
                Facebook
              </a>
              <a
                href="#"
                className="hover:text-queens-emerald transition duration-300"
              >
                Twitter
              </a>
              <a
                href="#"
                className="hover:text-queens-emerald transition duration-300"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2024 Lalitpur Queens. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

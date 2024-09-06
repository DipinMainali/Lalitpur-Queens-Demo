import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      {/* Fade Section with Horizontal Image and Large Logo */}
      <div className="relative h-[400px]">
        {" "}
        {/* Adjust the height as needed */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-queens-midnight opacity-70"></div>
        <div className="flex justify-center h-full w-full sm:h-[250px]">
          <Image
            src="/images/footer-top-landscape-bg.png" // Replace with the actual image path
            alt="Lalitpur Queens"
            layout="fill"
            objectFit="cover"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="absolute inset-0 flex justify-center items-center ">
          <Image
            src="/images/Lalitpur-queens-logo.png" // Replace with the actual logo path
            alt="Lalitpur Queens Logo"
            width={500} // Increase size for a larger logo
            height={500}
            className="opacity-100"
          />
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-queens-midnight text-queens-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Lalitpur Queens Description */}
            <div>
              <h3 className="text-xl font-bold mb-4">Lalitpur Queens</h3>
              <p>Empowering women through volleyball</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
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
                    href="/about"
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
                    href="/Matches"
                    className="hover:text-queens-emerald transition duration-300"
                  >
                    Matches
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
            </div>

            {/* Social Media Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/lalitpurqueens?mibextid=LQQJ4d"
                  className="hover:text-queens-emerald transition duration-300"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22.675 0h-21.35C.593 0 0 .593 0 1.325v21.351c0 .732.593 1.324 1.325 1.324h11.494v-9.294H9.69v-3.622h3.129V8.413c0-3.1 1.893-4.789 4.659-4.789 1.325 0 2.463.099 2.795.144v3.24l-1.917.001c-1.503 0-1.794.715-1.794 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.324-.592 1.324-1.324V1.324C24 .592 23.405 0 22.675 0z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="hover:text-queens-emerald transition duration-300"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M24 4.557a9.94 9.94 0 01-2.828.775A4.993 4.993 0 0023.337 3.1a9.93 9.93 0 01-3.127 1.197 4.92 4.92 0 00-8.384 4.482c-4.088-.2-7.71-2.166-10.141-5.144A4.822 4.822 0 001.671 6.1c0 1.722.88 3.239 2.219 4.129A4.928 4.928 0 01.964 9.7v.06a4.927 4.927 0 003.95 4.828 4.928 4.928 0 01-2.224.085A4.936 4.936 0 004.8 18.413a9.865 9.865 0 01-7.263 2.008 13.896 13.896 0 007.548 2.212c9.142 0 14.307-7.721 14.307-14.417 0-.22-.005-.437-.014-.652A10.124 10.124 0 0024 4.557z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="hover:text-queens-emerald transition duration-300"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.259.057 2.13.254 2.615.54a5.46 5.46 0 011.902 1.902c.286.486.483 1.357.54 2.615.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.057 1.259-.254 2.13-.54 2.615a5.46 5.46 0 01-1.902 1.902c-.486.286-1.357.483-2.615.54-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.259-.057-2.13-.254-2.615-.54a5.46 5.46 0 01-1.902-1.902c-.286-.486-.483-1.357-.54-2.615-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.057-1.259.254-2.13.54-2.615a5.46 5.46 0 011.902-1.902c.486-.286 1.357-.483 2.615-.54 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.052.072 5.77.131 4.718.341 3.875.77a7.378 7.378 0 00-2.685 1.672A7.378 7.378 0 00.77 5.875c-.429.843-.639 1.895-.698 3.177C.014 8.333 0 8.741 0 12c0 3.259.014 3.667.072 4.948.059 1.282.269 2.334.698 3.177a7.378 7.378 0 001.672 2.685 7.378 7.378 0 002.685 1.672c.843.429 1.895.639 3.177.698 1.281.058 1.689.072 4.948.072 3.259 0 3.667-.014 4.948-.072 1.282-.059 2.334-.269 3.177-.698a7.378 7.378 0 002.685-1.672 7.378 7.378 0 001.672-2.685c.429-.843.639-1.895.698-3.177.058-1.281.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.948-.059-1.282-.269-2.334-.698-3.177a7.378 7.378 0 00-1.672-2.685 7.378 7.378 0 00-2.685-1.672c-.843-.429-1.895-.639-3.177-.698C15.667.014 15.259 0 12 0zm0 5.838A6.162 6.162 0 105.838 12 6.17 6.17 0 0012 5.838zm0 10.162A4 4 0 1116 12a4.006 4.006 0 01-4 4zm6.406-10.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2024 Lalitpur Queens. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

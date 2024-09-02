// app/AdminDashboard/page.js
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faVolleyball,
  faHandshake,
  faNewspaper,
  faUsers,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

const navItems = [
  {
    name: "Matches",
    href: "/AdminDashboard/matches",
    icon: faVolleyball,
  },
  { name: "Sponsors", href: "/AdminDashboard/sponsors", icon: faHandshake },
  { name: "News", href: "/AdminDashboard/news", icon: faNewspaper },
  { name: "Players", href: "/AdminDashboard/players", icon: faUsers },
  { name: "Standings", href: "/AdminDashboard/standings", icon: faTrophy },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-queens-white text-center">
        DASHBOARD
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="bg-queens-white hover:opacity-90 transition-opacity duration-200 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center"
          >
            <FontAwesomeIcon
              icon={item.icon}
              size="3x"
              className="text-queens-green p-4"
            />
            <span className="text-sm font-semibold text-queens-black">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

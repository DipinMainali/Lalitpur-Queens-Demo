// components/MatchCard.js
import Image from "next/image";

export default function MatchCard({
  date,
  opponent,
  location,
  time,
  result,
  opponentLogo,
}) {
  const lalitpurQueensLogo = "/images/lalitpur-queens-logo.png"; // Path to Lalitpur Queens logo
  const lalitpurQueensName = "Lalitpur Queens";
  return (
    <div
      className="bg-cover bg-center bg-no-repeat shadow-md rounded-lg mt-4 relative overflow-hidden"
      style={{
        backgroundImage: `url('/images/match-card-bg.png')`,
      }}
    >
      <div className="bg-white bg-opacity-70 p-4 rounded-lg">
        {result ? (
          result === "Win" ? (
            <div className="mt-4 text-lg font-bold text-green-500 text-center">
              {result}
            </div>
          ) : result === "Draw" ? (
            <div className="mt-4 text-lg font-bold text-yellow-500 text-center">
              {result}
            </div>
          ) : result === "Loss" ? (
            <div className="mt-4 text-lg font-bold text-red-500 text-center">
              {result}
            </div>
          ) : null
        ) : (
          <div className="mt-4 text-lg font-bold text-queens-midnight text-center">
            Pending
          </div>
        )}

        <div className="text-lg font-semibold mb-2">{date}</div>
        <div className="flex justify-between items-center">
          {/* Lalitpur Queens */}
          <div className="relative">
            <img
              src={lalitpurQueensLogo}
              alt={lalitpurQueensName}
              className="w-12 h-12 transform transition-transform duration-300 hover:scale-110"
            />
            <div className="text-xl font-bold mt-2">{lalitpurQueensName}</div>
          </div>
          <div className="text-sm font-medium">vs</div>
          {/* Opponent Team */}
          <div className="relative">
            <img
              src={opponentLogo} // Assuming opponent team logo is provided
              alt={opponent}
              className="w-12 h-12 transform transition-transform duration-300 hover:scale-110"
            />
            <div className="text-xl font-bold mt-2">{opponent}</div>
          </div>
        </div>
        <div className="text-center mt-2 text-gray-600">Time: {time}</div>
      </div>
    </div>
  );
}

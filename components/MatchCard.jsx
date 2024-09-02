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
  return (
    <div
      className="bg-white bg-imagerounded-lg shadow-md p-6"
      style={{
        backgroundImage: `url('/images/match-card-bg.png')`,
        opacity: 0.5,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-bold">{date}</div>
        {opponentLogo && (
          <img
            src={opponentLogo}
            alt={`${opponent} logo`}
            className="w-12 h-12 object-cover rounded-full"
          />
        )}
      </div>
      <div className="text-xl mb-2">Lalitpur Queens vs {opponent}</div>
      <div className="text-gray-600">{location}</div>
      <div className="text-gray-600">{time}</div>
      {result && (
        <div className="mt-4 text-lg font-bold text-queens-midnight">
          {result}
        </div>
      )}
    </div>
  );
}

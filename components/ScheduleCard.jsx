import React from "react";

const ScheduleCard = ({ match }) => {
  const lalitpurQueensLogo = "/images/Lalitpur-queens-logo"; // Path to Lalitpur Queens logo
  const lalitpurQueensName = "Lalitpur Queens";

  return (
    <div
      className="bg-cover bg-center bg-no-repeat shadow-md rounded-lg p-4 relative overflow-hidden"
      style={{ backgroundImage: `url('/images/schedule-card-bg-img')` }}
    >
      {/* Content Overlay */}
      <div className="bg-white bg-opacity-70 p-4 rounded-lg">
        <div className="text-lg font-semibold mb-2">{match.date}</div>
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
              src={match.opponentLogo} // Assuming opponent team logo is provided
              alt={match.opponentTeam}
              className="w-12 h-12 transform transition-transform duration-300 hover:scale-110"
            />
            <div className="text-xl font-bold mt-2">{match.opponentTeam}</div>
          </div>
        </div>
        <div className="text-center mt-2 text-gray-600">Time: {match.time}</div>
      </div>
    </div>
  );
};

export default ScheduleCard;

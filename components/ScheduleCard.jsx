// components/ScheduleCard.js
import React from "react";

const ScheduleCard = ({ match }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="text-lg font-semibold mb-2">{match.date}</div>
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">{match.team1}</div>
        <div className="text-sm font-medium">vs</div>
        <div className="text-xl font-bold">{match.team2}</div>
      </div>
      <div className="text-center mt-2 text-gray-600">Time: {match.time}</div>
    </div>
  );
};

export default ScheduleCard;

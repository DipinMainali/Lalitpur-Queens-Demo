// components/PointsTable.js
import React from "react";

const PointsTable = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Team</th>
            <th className="py-3 px-6 text-center">Played</th>
            <th className="py-3 px-6 text-center">Won</th>
            <th className="py-3 px-6 text-center">Lost</th>
            <th className="py-3 px-6 text-center">Points</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {data.map((team, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                <span className="font-medium">{team.team}</span>
              </td>
              <td className="py-3 px-6 text-center">{team.played}</td>
              <td className="py-3 px-6 text-center">{team.won}</td>
              <td className="py-3 px-6 text-center">{team.lost}</td>
              <td className="py-3 px-6 text-center">{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PointsTable;

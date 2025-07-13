// components/PointsTable.js
import React from "react";
import Image from "next/image";

const PointsTable = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-background text-text-secondary uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Team</th>
            <th className="py-3 px-6 text-center">Played</th>
            <th className="py-3 px-6 text-center">Won</th>
            <th className="py-3 px-6 text-center">Drawn</th>
            <th className="py-3 px-6 text-center">Lost</th>
            <th className="py-3 px-6 text-center">Points</th>
            <th className="py-3 px-6 text-center">Sets Won</th>
            <th className="py-3 px-6 text-center">Sets Lost</th>
          </tr>
        </thead>
        <tbody className="text-text-secondary text-sm font-light">
          {data.map((team, index) => (
            <tr
              key={index}
              className="border-b border-background hover:bg-background hover:bg-opacity-50"
            >
              <td className="flex flex-row gap-2 py-3 px-6 text-left whitespace-nowrap">
                <Image
                  src={team.team.logo}
                  alt={team.team.name}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <span className="font-medium">{team.team.name}</span>
              </td>
              <td className="py-3 px-6 text-center">{team.played}</td>
              <td className="py-3 px-6 text-center">{team.won}</td>
              <td className="py-3 px-6 text-center">{team.drawn}</td>
              <td className="py-3 px-6 text-center">{team.lost}</td>
              <td className="py-3 px-6 text-center">{team.points}</td>
              <td className="py-3 px-6 text-center">{team.setWon}</td>
              <td className="py-3 px-6 text-center">{team.setLost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PointsTable;

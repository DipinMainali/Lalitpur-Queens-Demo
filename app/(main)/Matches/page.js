"use client";
import React, { useState, useEffect } from "react";
import MatchCard from "@/components/MatchCard";
import PointsTable from "@/components/PointsTable";

export default function MatchPage() {
  const [scheduleData, setScheduleData] = useState([]);
  const [pointsTableData, setPointsTableData] = useState([]);
  const [activeTab, setActiveTab] = useState("schedule");

  useEffect(() => {
    fetch("/api/standings/")
      .then((response) => response.json())
      .then((res) => setPointsTableData(res.data));
  }, []);

  useEffect(() => {
    fetch("/api/matches/")
      .then((response) => response.json())
      .then((res) => setScheduleData(res.data));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-queens-midnight">
        Lalitpur Queens - Match Info
      </h1>

      {/* Tab Buttons */}
      <div className="flex justify-center mb-8">
        <div className="w-1/2 flex">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`w-full px-8 py-3 font-semibold shadow-lg transform transition-all duration-300 ${
              activeTab === "schedule"
                ? " text-queens-black border-b-2 border-queens-emerald  "
                : "bg-queens-emerald bg-opacity-5 text-queens-black hover:bg-queens-midnight hover:bg-opacity-20   "
            }`}
          >
            Schedule
          </button>
        </div>
        <div className="w-1/2 flex">
          <button
            onClick={() => setActiveTab("standings")}
            className={`w-full px-8 py-3 font-semibold shadow-lg transform transition-all duration-300 ${
              activeTab === "standings"
                ? " text-queens-black border-b-2 border-queens-emerald  "
                : "bg-queens-emerald bg-opacity-5 text-queens-black hover:bg-queens-midnight hover:bg-opacity-20 "
            }`}
          >
            Standings
          </button>
        </div>
      </div>

      {/* Content Rendering Based on Active Tab */}
      {activeTab === "schedule" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scheduleData.map((match, index) => (
            <MatchCard
              key={index}
              date={match.date}
              opponent={match.opponent.name}
              location={match.venue}
              time={match.time}
              result={match.result}
              opponentLogo={match.opponent.logo}
            />
          ))}
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-queens-midnight">
            Points Table
          </h2>
          <PointsTable data={pointsTableData} />
        </div>
      )}
    </div>
  );
}

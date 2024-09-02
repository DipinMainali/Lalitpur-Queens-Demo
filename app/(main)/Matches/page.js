"use client";
import React, { useState, useEffect } from "react";
import ScheduleCard from "@/components/ScheduleCard";
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
        <button
          onClick={() => setActiveTab("schedule")}
          className={`px-8 py-3 font-semibold rounded-l-lg shadow-lg transform transition-transform duration-300 ${
            activeTab === "schedule"
              ? "bg-queens-emerald text-queens-white scale-105"
              : "bg-queens-blue text-queens-white hover:bg-queens-midnight hover:scale-105"
          }`}
        >
          Schedule
        </button>
        <div className="w-2"></div> {/* Gap between buttons */}
        <button
          onClick={() => setActiveTab("standings")}
          className={`px-8 py-3 font-semibold rounded-r-lg shadow-lg transform transition-transform duration-300 ${
            activeTab === "standings"
              ? "bg-queens-emerald text-queens-white scale-105"
              : "bg-queens-blue text-queens-white hover:bg-queens-midnight hover:scale-105"
          }`}
        >
          Standings
        </button>
      </div>

      {/* Content Rendering Based on Active Tab */}
      {activeTab === "schedule" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scheduleData.map((match, index) => (
            <ScheduleCard key={index} match={match} />
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

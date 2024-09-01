"use client";
import React from "react";
import ScheduleCard from "@/components/ScheduleCard";
import PointsTable from "@/components/PointsTable";
import { useState, useEffect } from "react";

const scheduleData = [
  {
    date: "2024-09-01",
    team1: "Lalitpur Queens",
    team2: "Kathmandu Royals",
    time: "18:00",
  },
  {
    date: "2024-09-08",
    team1: "Pokhara Panthers",
    team2: "Lalitpur Queens",
    time: "17:30",
  },
  // Add more matches as needed
];

export default function SchedulePage() {
  const [pointsTableData, setPointsTableData] = useState([]);

  useEffect(() => {
    fetch("/api/standings/")
      .then((response) => response.json())
      .then((res) => setPointsTableData(res.data));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Lalitpur Queens - Match Schedule
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {scheduleData.map((match, index) => (
          <ScheduleCard key={index} match={match} />
        ))}
      </div>
      <h2 className="text-2xl font-bold mb-4">Points Table</h2>
      <PointsTable data={pointsTableData} />
    </div>
  );
}

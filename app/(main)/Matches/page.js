"use client";
import React, { useState, useEffect } from "react";
import MatchCard from "@/components/MatchCard";
import PointsTable from "@/components/PointsTable";

export default function MatchPage() {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [pointsTableData, setPointsTableData] = useState([]);
  const [activeTab, setActiveTab] = useState("schedule");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch standings data
  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await fetch("/api/standings/");
        const res = await response.json();
        if (res.success) {
          setPointsTableData(res.data);
        } else {
          console.error("Failed to load standings:", res.message);
        }
      } catch (error) {
        console.error("Error fetching standings:", error);
      }
    };

    fetchStandings();
  }, []);

  // Fetch matches data
  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/matches/");
        const res = await response.json();

        if (res.success) {
          // Sort matches by date (most recent first for past matches, earliest first for upcoming)
          const sortedMatches = res.data.sort((a, b) => {
            const dateA = new Date(a.matchDateTime);
            const dateB = new Date(b.matchDateTime);

            // If both are completed matches, show most recent first
            if (
              a.matchStatus === "Completed" &&
              b.matchStatus === "Completed"
            ) {
              return dateB - dateA;
            }

            // If both are upcoming, show earliest first
            if (
              a.matchStatus !== "Completed" &&
              b.matchStatus !== "Completed"
            ) {
              return dateA - dateB;
            }

            // If one is completed and one is upcoming, show upcoming first
            return a.matchStatus === "Completed" ? 1 : -1;
          });

          setMatches(sortedMatches);
          setFilteredMatches(sortedMatches);
        } else {
          console.error("Failed to load matches:", res.message);
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // Filter matches based on status
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredMatches(matches);
    } else if (statusFilter === "upcoming") {
      setFilteredMatches(
        matches.filter(
          (match) =>
            match.matchStatus === "Scheduled" ||
            match.matchStatus === "Postponed"
        )
      );
    } else if (statusFilter === "completed") {
      setFilteredMatches(
        matches.filter((match) => match.matchStatus === "Completed")
      );
    } else if (statusFilter === "live") {
      setFilteredMatches(
        matches.filter((match) => match.matchStatus === "In Progress")
      );
    }
  }, [statusFilter, matches]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-text-primary">
        Lalitpur Queens - Match Info
      </h1>

      {/* Tab Buttons */}
      <div className="flex justify-center mb-8">
        <div className="w-1/2 flex">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`w-full px-8 py-3 font-semibold shadow-lg transform transition-all duration-300 ${
              activeTab === "schedule"
                ? "text-text-primary border-b-2 border-brand-secondary"
                : "bg-brand-secondary bg-opacity-5 text-text-primary hover:bg-brand-primary hover:bg-opacity-20"
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
                ? "text-text-primary border-b-2 border-brand-secondary"
                : "bg-brand-secondary bg-opacity-5 text-text-primary hover:bg-brand-primary hover:bg-opacity-20"
            }`}
          >
            Standings
          </button>
        </div>
      </div>

      {/* Content Rendering Based on Active Tab */}
      {activeTab === "schedule" ? (
        <>
          {/* Match status filter */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-brand-secondary text-white"
                  : "bg-background hover:bg-brand-secondary/20 text-text-secondary"
              }`}
            >
              All Matches
            </button>
            <button
              onClick={() => setStatusFilter("upcoming")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === "upcoming"
                  ? "bg-info text-white"
                  : "bg-background hover:bg-info/20 text-text-secondary"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setStatusFilter("live")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === "live"
                  ? "bg-accent text-white"
                  : "bg-background hover:bg-accent/20 text-text-secondary"
              }`}
            >
              Live
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === "completed"
                  ? "bg-brand-primary text-white"
                  : "bg-background hover:bg-brand-primary/20 text-text-secondary"
              }`}
            >
              Completed
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-secondary"></div>
            </div>
          ) : filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMatches.map((match) => (
                <MatchCard key={match._id} match={match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 mx-auto mb-3 text-background"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 12H6"
                />
              </svg>
              <p className="text-xl">
                No matches found for the selected filter
              </p>
            </div>
          )}
        </>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-text-primary">
            Points Table
          </h2>
          <PointsTable data={pointsTableData} />
        </div>
      )}
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import MatchCard from "@/components/MatchCard";
import PointsTable from "@/components/PointsTable";

export default function MatchPage() {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [displayedMatches, setDisplayedMatches] = useState([]);
  const [pointsTableData, setPointsTableData] = useState([]);
  const [activeTab, setActiveTab] = useState("schedule");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Season state
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);

  // Pagination state
  const [matchesPerPage, setMatchesPerPage] = useState(6);
  const [hasMoreMatches, setHasMoreMatches] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch seasons data
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch("/api/seasons");
        const res = await response.json();

        if (res.success) {
          setSeasons(res.data);

          // Set active season as default
          const activeSeason = res.data.find((season) => season.isActive);
          if (activeSeason) {
            setSelectedSeason(activeSeason._id);
          } else if (res.data.length > 0) {
            setSelectedSeason(res.data[0]._id);
          }
        } else {
          console.error("Failed to load seasons:", res.message);
        }
      } catch (error) {
        console.error("Error fetching seasons:", error);
      }
    };

    fetchSeasons();
  }, []);

  // Fetch standings data
  useEffect(() => {
    const fetchStandings = async () => {
      try {
        // If we have a selected season, fetch standings for that season
        const url = selectedSeason
          ? `/api/standings?season=${selectedSeason}`
          : "/api/standings";

        const response = await fetch(url);
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

    if (activeTab === "standings") {
      fetchStandings();
    }
  }, [selectedSeason, activeTab]);

  // Fetch matches data when season changes
  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        // Add season filter if season is selected
        const url = selectedSeason
          ? `/api/matches?season=${selectedSeason}`
          : "/api/matches";

        const response = await fetch(url);
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

    if (selectedSeason !== undefined && activeTab === "schedule") {
      fetchMatches();
    }
  }, [selectedSeason, activeTab]);

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

  // Set displayed matches with pagination
  useEffect(() => {
    setDisplayedMatches(filteredMatches.slice(0, matchesPerPage));
    setHasMoreMatches(filteredMatches.length > matchesPerPage);
  }, [filteredMatches, matchesPerPage]);

  // Load more matches handler
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      const newMatchesPerPage = matchesPerPage + 6;
      setMatchesPerPage(newMatchesPerPage);
      setDisplayedMatches(filteredMatches.slice(0, newMatchesPerPage));
      setHasMoreMatches(filteredMatches.length > newMatchesPerPage);
      setIsLoadingMore(false);
    }, 500); // Small delay for better UX
  };

  // Reset pagination when filters change
  useEffect(() => {
    setMatchesPerPage(6);
  }, [statusFilter, selectedSeason]);

  // Get current season name
  const getCurrentSeasonName = () => {
    if (!selectedSeason) return "All Seasons";
    const season = seasons.find((s) => s._id === selectedSeason);
    return season
      ? `${season.name} ${season.year}${season.isActive ? " (Active)" : ""}`
      : "Select Season";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-text-primary text-center">
        Lalitpur Queens - Match Schedule
      </h1>

      {/* Tab Buttons */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-lg shadow-md p-1 flex w-full max-w-md">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`w-1/2 px-8 py-3 font-semibold rounded-md transition-all duration-300 ${
              activeTab === "schedule"
                ? "bg-gradient-to-r from-brand-secondary to-brand-primary text-white shadow-lg"
                : "text-text-primary hover:bg-background/20"
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab("standings")}
            className={`w-1/2 px-8 py-3 font-semibold rounded-md transition-all duration-300 ${
              activeTab === "standings"
                ? "bg-gradient-to-r from-brand-secondary to-brand-primary text-white shadow-lg"
                : "text-text-primary hover:bg-background/20"
            }`}
          >
            Standings
          </button>
        </div>
      </div>

      {/* Content Rendering Based on Active Tab */}
      {activeTab === "schedule" ? (
        <>
          {/* Season Selector - Only shown in schedule tab */}
          <div className="flex justify-center mb-6">
            <div className="relative inline-block w-64">
              <button
                type="button"
                className="inline-flex w-full justify-between items-center rounded-md border border-brand-secondary bg-white px-4 py-2.5 text-sm font-medium text-brand-primary shadow-sm hover:bg-brand-secondary/5 focus:ring-2 focus:ring-brand-secondary/30 focus:outline-none transition-all duration-300"
                onClick={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
                aria-expanded={seasonDropdownOpen}
                aria-haspopup="true"
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-brand-secondary mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {getCurrentSeasonName()}
                </div>
                <svg
                  className={`h-5 w-5 text-brand-secondary transform transition-transform duration-300 ${
                    seasonDropdownOpen ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {seasonDropdownOpen && (
                <div
                  className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-background/80"
                  role="menu"
                  aria-orientation="vertical"
                  tabIndex="-1"
                >
                  <div className="py-1" role="none">
                    {seasons.map((season) => (
                      <button
                        key={season._id}
                        onClick={() => {
                          setSelectedSeason(season._id);
                          setSeasonDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${
                          selectedSeason === season._id
                            ? "bg-brand-secondary/10 text-brand-primary font-medium"
                            : "text-text-primary hover:bg-background/20"
                        }`}
                        role="menuitem"
                      >
                        <div className="flex items-center">
                          {selectedSeason === season._id && (
                            <svg
                              className="h-4 w-4 mr-2 text-brand-secondary"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          <span
                            className={
                              selectedSeason === season._id ? "ml-0" : "ml-6"
                            }
                          >
                            {season.name} {season.year}
                            {season.isActive && (
                              <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-accent/20 text-accent rounded-full">
                                Active
                              </span>
                            )}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Match status filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                statusFilter === "all"
                  ? "bg-brand-secondary text-white shadow-md transform scale-105"
                  : "bg-white hover:bg-brand-secondary/10 text-text-secondary border border-background"
              }`}
            >
              All Matches
            </button>
            <button
              onClick={() => setStatusFilter("upcoming")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                statusFilter === "upcoming"
                  ? "bg-info text-white shadow-md transform scale-105"
                  : "bg-white hover:bg-info/10 text-text-secondary border border-background"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setStatusFilter("live")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                statusFilter === "live"
                  ? "bg-accent text-white shadow-md transform scale-105"
                  : "bg-white hover:bg-accent/10 text-text-secondary border border-background"
              }`}
            >
              Live
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                statusFilter === "completed"
                  ? "bg-brand-primary text-white shadow-md transform scale-105"
                  : "bg-white hover:bg-brand-primary/10 text-text-secondary border border-background"
              }`}
            >
              Completed
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-secondary"></div>
            </div>
          ) : displayedMatches.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedMatches.map((match) => (
                  <MatchCard key={match._id} match={match} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMoreMatches && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="px-6 py-3 bg-white border border-brand-secondary text-brand-primary hover:bg-brand-secondary hover:text-white font-medium rounded-full shadow-sm hover:shadow-md transform transition-all duration-300 hover:translate-y-[-2px] flex items-center"
                  >
                    {isLoadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-brand-secondary mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        Load More
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 mx-auto mb-4 text-background"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5"
                />
              </svg>
              <p className="text-2xl font-semibold text-text-secondary mb-2">
                No matches found
              </p>
              <p className="text-text-secondary">
                No matches available for the selected filter in{" "}
                {getCurrentSeasonName()}
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-text-primary">
            {getCurrentSeasonName()} - Points Table
          </h2>
          {pointsTableData.length > 0 ? (
            <PointsTable data={pointsTableData} />
          ) : (
            <div className="text-center py-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 mx-auto mb-4 text-background"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                />
              </svg>
              <p className="text-2xl font-semibold text-text-secondary mb-2">
                No standings available
              </p>
              <p className="text-text-secondary">
                Standings data for {getCurrentSeasonName()} is not available yet
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

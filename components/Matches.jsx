import React, { useState, useEffect } from "react";

// MatchesSection component
function MatchesSection({ seasons }) {
  const [filteredUpcomingMatches, setFilteredUpcomingMatches] = useState([]);
  const [filteredLatestResults, setFilteredLatestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);

  // Initialize with active season if available
  useEffect(() => {
    if (seasons && seasons.length > 0) {
      // Find active season or use first one
      const activeSeason = seasons.find((season) => season.isActive);
      setSelectedSeason(activeSeason ? activeSeason._id : seasons[0]._id);
    }
  }, [seasons]);

  // Fetch matches when season changes
  useEffect(() => {
    const fetchMatches = async () => {
      if (!selectedSeason) return;

      setIsLoading(true);
      try {
        const res = await fetch(`/api/matches?season=${selectedSeason}`);
        const jsonRes = await res.json();

        if (jsonRes.success) {
          // Filter and set matches
          const upMatches = jsonRes.data.filter(
            (match) =>
              match.matchStatus === "Scheduled" ||
              match.matchStatus === "Postponed" ||
              match.matchStatus === "In Progress"
          );

          const results = jsonRes.data.filter(
            (match) => match.matchStatus === "Completed"
          );

          // Sort matches
          upMatches.sort(
            (a, b) => new Date(a.matchDateTime) - new Date(b.matchDateTime)
          );
          results.sort(
            (a, b) => new Date(b.matchDateTime) - new Date(a.matchDateTime)
          );

          setFilteredUpcomingMatches(upMatches);
          setFilteredLatestResults(results);
        }
      } catch (error) {
        console.error("Error fetching matches by season:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [selectedSeason]);

  // Get current season name
  const getCurrentSeasonName = () => {
    if (!selectedSeason) return "All Seasons";
    const season = seasons.find((s) => s._id === selectedSeason);
    return season
      ? `${season.name} ${season.year}${season.isActive ? " (Active)" : ""}`
      : "Select Season";
  };

  return (
    <section className="w-full bg-brand-secondary bg-opacity-10 py-16">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-2">
            Matches
          </h2>
          <p className="text-text-primary text-lg">
            Stay updated with Lalitpur Queens fixtures and results.
          </p>
        </div>

        {/* Season Selector - Dropdown style */}
        {seasons && seasons.length > 0 && (
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
        )}

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <button
            className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeTab === "upcoming"
                ? "bg-brand-primary text-white shadow-lg"
                : "bg-white text-text-primary hover:bg-background"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Matches
          </button>
          <button
            className={`ml-4 px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeTab === "latest"
                ? "bg-brand-primary text-white shadow-lg"
                : "bg-white text-text-primary hover:bg-background"
            }`}
            onClick={() => setActiveTab("latest")}
          >
            Latest Results
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-secondary"></div>
          </div>
        ) : (
          /* Match List */
          <div className="space-y-6">
            {activeTab === "upcoming" ? (
              filteredUpcomingMatches && filteredUpcomingMatches.length > 0 ? (
                filteredUpcomingMatches
                  .slice(0, 3)
                  .map((match) => (
                    <UpcomingMatchCard key={match._id} match={match} />
                  ))
              ) : (
                <div className="text-center py-10 bg-white rounded-lg shadow-md">
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
                    No upcoming matches
                  </p>
                  <p className="text-text-secondary">
                    No upcoming matches scheduled for {getCurrentSeasonName()}
                  </p>
                </div>
              )
            ) : filteredLatestResults && filteredLatestResults.length > 0 ? (
              filteredLatestResults
                .slice(0, 3)
                .map((match) => (
                  <CompletedMatchCard key={match._id} match={match} />
                ))
            ) : (
              <div className="text-center py-10 bg-white rounded-lg shadow-md">
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
                    d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5"
                  />
                </svg>
                <p className="text-2xl font-semibold text-text-secondary mb-2">
                  No match results
                </p>
                <p className="text-text-secondary">
                  No completed matches for {getCurrentSeasonName()}
                </p>
              </div>
            )}
          </div>
        )}

        {/* View All Button */}
        <div className="flex justify-center mt-8">
          <a
            href="/Matches"
            className="px-6 py-3 bg-white border border-brand-secondary text-brand-primary hover:bg-brand-secondary hover:text-white font-medium rounded-full shadow-sm hover:shadow-md transform transition-all duration-300 hover:translate-y-[-2px] flex items-center"
          >
            View All Matches
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
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// UpcomingMatchCard component
function UpcomingMatchCard({ match }) {
  // Handle potentially invalid date values
  const formatDate = (dateTime) => {
    if (!dateTime) return "Date TBA";
    const date = new Date(dateTime);
    return isNaN(date.getTime())
      ? "Date TBA"
      : date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
  };

  const formatTime = (dateTime) => {
    if (!dateTime) return "Time TBA";
    const date = new Date(dateTime);
    return isNaN(date.getTime())
      ? "Time TBA"
      : date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  // Safely access home team data
  const homeTeam = match.homeTeam || {
    name: "Lalitpur Queens",
    logo: "/images/Lalitpur-queens-logo.png",
  };

  // Safely access away team data
  const awayTeam = match.awayTeam || {
    name: "TBA",
    logo: "",
  };

  // Get status display class
  const getStatusClass = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-info/20 text-info";
      case "In Progress":
        return "bg-brand-secondary/20 text-brand-secondary";
      case "Postponed":
        return "bg-accent/20 text-accent";
      case "Cancelled":
        return "bg-error/20 text-error";
      default:
        return "bg-background text-text-secondary";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-background max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-brand-primary">
            {match.tournament || "N/A"}
          </p>
          <p className="text-xs text-text-secondary">
            {match.stage || "N/A"} - Game Day {match.gameDay || "N/A"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-text-primary">
            {formatDate(match.matchDateTime)}
          </p>
          <p className="text-xs text-text-secondary">
            {formatTime(match.matchDateTime)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="flex flex-col items-center w-2/5 text-center">
          <img
            src={homeTeam.logo}
            alt={`${homeTeam.name} logo`}
            className="w-12 h-12 rounded-full object-contain border border-background"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/60x60/DEE1EC/666666?text=${homeTeam.name
                .charAt(0)
                .toUpperCase()}`;
            }}
          />
          <p className="mt-2 text-text-primary font-semibold">
            {homeTeam.name}
          </p>
        </div>

        <div className="w-1/5 text-center text-text-secondary text-xl font-bold">
          VS
        </div>

        <div className="flex flex-col items-center w-2/5 text-center">
          <img
            src={awayTeam.logo}
            alt={`${awayTeam.name} logo`}
            className="w-12 h-12 rounded-full object-contain border border-background"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/60x60/DEE1EC/666666?text=${awayTeam.name
                .charAt(0)
                .toUpperCase()}`;
            }}
          />
          <p className="mt-2 text-text-primary font-semibold">
            {awayTeam.name}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-text-secondary text-sm mt-4">
        <div className="flex items-center">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          <span>{match.location || "Venue TBA"}</span>
        </div>

        <div
          className={`py-1 px-3 rounded-full ${getStatusClass(
            match.matchStatus
          )}`}
        >
          {match.matchStatus || "Scheduled"}
        </div>
      </div>

      <div className="text-right mt-4">
        <button className="bg-brand-secondary hover:bg-opacity-80 text-white font-semibold py-2 px-5 rounded-full shadow-md transition-colors duration-300">
          Set Reminder
        </button>
      </div>
    </div>
  );
}

// CompletedMatchCard component
function CompletedMatchCard({ match }) {
  const formatDate = (dateTime) => {
    if (!dateTime) return "Date unavailable";
    const date = new Date(dateTime);
    return isNaN(date.getTime())
      ? "Date unavailable"
      : date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
  };

  // Safely access home team data
  const homeTeam = match.homeTeam || {
    name: "Lalitpur Queens",
    logo: "/images/Lalitpur-queens-logo.png",
  };

  // Safely access away team data
  const awayTeam = match.awayTeam || {
    name: "Unknown Team",
    logo: "",
  };

  // Safely access scores
  const scores = match.scores || {
    totalSets: { home: 0, away: 0 },
    sets: [],
  };

  const getResultClasses = (winnerTeam) => {
    const queensIsHome = homeTeam.name === "Lalitpur Queens";

    if (winnerTeam === "home" && queensIsHome) {
      return "bg-brand-secondary bg-opacity-20 border-brand-secondary text-brand-secondary";
    }
    if (winnerTeam === "away" && !queensIsHome) {
      return "bg-brand-secondary bg-opacity-20 border-brand-secondary text-brand-secondary";
    }
    if (winnerTeam === "home" && !queensIsHome) {
      return "bg-error bg-opacity-20 border-error text-error";
    }
    if (winnerTeam === "away" && queensIsHome) {
      return "bg-error bg-opacity-20 border-error text-error";
    }
    return "bg-background border-text-secondary text-text-secondary";
  };

  const getResultText = () => {
    if (match.winnerTeam === "draw") return "Draw";

    const queensIsHome = homeTeam.name === "Lalitpur Queens";
    const queensWon =
      (queensIsHome && match.winnerTeam === "home") ||
      (!queensIsHome && match.winnerTeam === "away");

    return queensWon ? "Win" : "Loss";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-background max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-brand-primary">
            {match.tournament || "N/A"}
          </p>
          <p className="text-xs text-text-secondary">
            {match.stage || "N/A"} - Game Day {match.gameDay || "N/A"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-text-primary">
            {formatDate(match.matchDateTime)}
          </p>
          <p
            className={`text-xs font-bold p-1 rounded mt-1 inline-block ${getResultClasses(
              match.winnerTeam
            )}`}
          >
            {getResultText()}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between py-4">
        {/* Home Team */}
        <div className="flex flex-col items-center w-2/5 text-center">
          <img
            src={homeTeam.logo}
            alt={`${homeTeam.name} logo`}
            className="w-12 h-12 rounded-full object-contain border border-background"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/60x60/DEE1EC/666666?text=${homeTeam.name
                .charAt(0)
                .toUpperCase()}`;
            }}
          />
          <p className="mt-2 text-text-primary font-semibold">
            {homeTeam.name}
          </p>
          {homeTeam.name === "Lalitpur Queens" && (
            <span className="text-xs mt-1 text-brand-secondary">Home Team</span>
          )}
        </div>

        {/* Scores */}
        <div className="w-1/5 text-center">
          <p className="text-3xl font-bold text-text-primary mb-1">
            {scores.totalSets?.home || 0} - {scores.totalSets?.away || 0}
          </p>
          <p className="text-sm text-text-secondary">Sets</p>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center w-2/5 text-center">
          <img
            src={awayTeam.logo}
            alt={`${awayTeam.name} logo`}
            className="w-12 h-12 rounded-full object-contain border border-background"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/60x60/DEE1EC/666666?text=${awayTeam.name
                .charAt(0)
                .toUpperCase()}`;
            }}
          />
          <p className="mt-2 text-text-primary font-semibold">
            {awayTeam.name}
          </p>
          {awayTeam.name === "Lalitpur Queens" && (
            <span className="text-xs mt-1 text-brand-secondary">Home Team</span>
          )}
        </div>
      </div>

      {/* Set scores */}
      {scores.sets && scores.sets.length > 0 && (
        <div className="mt-4 pt-4 border-t border-background">
          <p className="text-sm font-semibold text-text-primary mb-2">
            Set Scores:
          </p>
          <div className="flex flex-wrap gap-2">
            {scores.sets.map((set, index) => (
              <div
                key={index}
                className="bg-background rounded-md px-2 py-1 text-sm"
              >
                Set {index + 1}: {set.homeScore || 0} - {set.awayScore || 0}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-text-secondary text-sm mt-4 pt-4 border-t border-background">
        <div className="flex items-center">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          <span>{match.location || "Venue unavailable"}</span>
        </div>
      </div>
    </div>
  );
}

export { MatchesSection };

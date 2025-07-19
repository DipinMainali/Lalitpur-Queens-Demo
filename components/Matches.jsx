import React, { useState, useEffect } from "react";

// MatchesSection component
function MatchesSection({ upcomingMatches, latestResults, seasons }) {
  const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' or 'latest'
  const [selectedSeason, setSelectedSeason] = useState(""); // Track selected season ID
  const [filteredUpcomingMatches, setFilteredUpcomingMatches] = useState([]);
  const [filteredLatestResults, setFilteredLatestResults] = useState([]);

  // Filter matches when season changes
  useEffect(() => {
    if (selectedSeason) {
      // Filter upcoming matches by season
      setFilteredUpcomingMatches(
        upcomingMatches?.filter(
          (match) => match.season?._id === selectedSeason
        ) || []
      );

      // Filter latest results by season
      setFilteredLatestResults(
        latestResults?.filter(
          (match) => match.season?._id === selectedSeason
        ) || []
      );
    } else {
      // If no season selected, show all
      setFilteredUpcomingMatches(upcomingMatches || []);
      setFilteredLatestResults(latestResults || []);
    }
  }, [selectedSeason, upcomingMatches, latestResults]);

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

        {/* Season Selector */}
        {seasons && seasons.length > 0 && (
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-white rounded-full p-1 shadow-sm">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  !selectedSeason
                    ? "bg-brand-primary text-white"
                    : "hover:bg-background"
                }`}
                onClick={() => setSelectedSeason("")}
              >
                All Seasons
              </button>
              {seasons.map((season) => (
                <button
                  key={season._id}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                    selectedSeason === season._id
                      ? "bg-brand-primary text-white"
                      : "hover:bg-background"
                  }`}
                  onClick={() => setSelectedSeason(season._id)}
                >
                  {season.name} {season.year}
                  {season.isActive && " (Active)"}
                </button>
              ))}
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

        {/* Match List */}
        <div className="space-y-6">
          {activeTab === "upcoming" ? (
            filteredUpcomingMatches && filteredUpcomingMatches.length > 0 ? (
              filteredUpcomingMatches
                .slice(0, 3)
                .map((match) => (
                  <UpcomingMatchCard key={match._id} match={match} />
                ))
            ) : (
              <p className="text-center text-text-secondary text-lg">
                No upcoming matches scheduled at the moment.
              </p>
            )
          ) : filteredLatestResults && filteredLatestResults.length > 0 ? (
            filteredLatestResults
              .slice(0, 3)
              .map((match) => (
                <CompletedMatchCard key={match._id} match={match} />
              ))
          ) : (
            <p className="text-center text-text-secondary text-lg">
              No latest results available.
            </p>
          )}
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

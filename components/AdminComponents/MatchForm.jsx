// app/admin/matches/form.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MatchForm({ initialData = null }) {
  const isEditing = !!initialData;
  const router = useRouter();

  // Tournament information
  const [tournament, setTournament] = useState(
    initialData?.tournament || "Vatsalya Everest Women's Volleyball League"
  );
  const [stage, setStage] = useState(initialData?.stage || "Group Stage");
  const [gameDay, setGameDay] = useState(initialData?.gameDay || 1);

  // Season information - add this
  const [seasonId, setSeasonId] = useState(initialData?.season || "");
  const [seasons, setSeasons] = useState([]);

  // Match date and location
  const [matchDate, setMatchDate] = useState(
    initialData?.matchDateTime
      ? new Date(initialData.matchDateTime).toISOString().split("T")[0]
      : ""
  );
  const [matchTime, setMatchTime] = useState(
    initialData?.matchDateTime
      ? new Date(initialData.matchDateTime).toTimeString().slice(0, 5)
      : ""
  );
  const [location, setLocation] = useState(
    initialData?.location || "NSC Covered Hall, Kathmandu"
  );

  // Teams information - Home team is always Lalitpur Queens by default
  const [homeTeam] = useState({
    name: "Lalitpur Queens",
    logo: "/images/Lalitpur-queens-logo.png",
  });

  // Away team (opponent team)
  const [awayTeamId, setAwayTeamId] = useState(
    initialData?.awayTeam?._id || ""
  );
  const [teams, setTeams] = useState([]);

  // Match status
  const [matchStatus, setMatchStatus] = useState(
    initialData?.matchStatus || "Scheduled"
  );

  // Score information (only shown when match is In Progress or Completed)
  const [scores, setScores] = useState(
    initialData?.scores || {
      sets: [{ homeScore: 0, awayScore: 0 }],
      totalSets: { home: 0, away: 0 },
    }
  );

  // Fetch all seasons on component mount
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const res = await fetch("/api/seasons");
        const jsonRes = await res.json();

        if (jsonRes.success) {
          setSeasons(jsonRes.data);

          // If not editing and there's at least one active season, select it by default
          if (!isEditing && !seasonId) {
            const activeSeason = jsonRes.data.find((season) => season.isActive);
            if (activeSeason) {
              setSeasonId(activeSeason._id);
            }
          }
        } else {
          console.error("Error fetching seasons:", jsonRes.message);
        }
      } catch (err) {
        console.error("Error fetching seasons:", err);
      }
    };

    fetchSeasons();
  }, []);

  // Fetch all opponent teams on component mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("/api/teams");
        const jsonRes = await res.json();
        if (jsonRes.success) {
          // Filter out Lalitpur Queens if it exists in the teams list
          const opponentTeams = jsonRes.data.filter(
            (team) => team.name !== "Lalitpur Queens"
          );
          setTeams(opponentTeams);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    };

    fetchTeams();
  }, []);

  // Add a new set to the scores
  const addSet = () => {
    setScores((prev) => ({
      ...prev,
      sets: [...prev.sets, { homeScore: 0, awayScore: 0 }],
    }));
  };

  // Remove a set from the scores
  const removeSet = (index) => {
    if (scores.sets.length <= 1) return;

    setScores((prev) => {
      const updatedSets = prev.sets.filter((_, i) => i !== index);

      // Recalculate total sets
      let homeSets = 0;
      let awaySets = 0;

      updatedSets.forEach((set) => {
        if (set.homeScore > set.awayScore) homeSets++;
        else if (set.awayScore > set.homeScore) awaySets++;
      });

      return {
        sets: updatedSets,
        totalSets: { home: homeSets, away: awaySets },
      };
    });
  };

  // Update score for a specific set
  const updateSetScore = (index, team, value) => {
    const updatedSets = [...scores.sets];
    updatedSets[index][`${team}Score`] = parseInt(value) || 0;

    // Calculate total sets won
    let homeSets = 0;
    let awaySets = 0;

    updatedSets.forEach((set) => {
      if (set.homeScore > set.awayScore) homeSets++;
      else if (set.awayScore > set.homeScore) awaySets++;
    });

    setScores({
      sets: updatedSets,
      totalSets: { home: homeSets, away: awaySets },
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate season selection
    if (!seasonId) {
      alert("Please select a season");
      return;
    }

    // Find selected away team
    const selectedAwayTeam = teams.find((team) => team._id === awayTeamId);
    if (!selectedAwayTeam) {
      alert("Please select a valid opponent team");
      return;
    }

    // Create combined datetime from date and time inputs
    const matchDateTime = new Date(`${matchDate}T${matchTime}`);
    if (isNaN(matchDateTime.getTime())) {
      alert("Please enter a valid date and time");
      return;
    }

    // Calculate winner based on scores
    let winnerTeam = null;
    if (matchStatus === "Completed") {
      if (scores.totalSets.home > scores.totalSets.away) {
        winnerTeam = "home";
      } else if (scores.totalSets.home < scores.totalSets.away) {
        winnerTeam = "away";
      } else {
        winnerTeam = "draw";
      }
    }

    // Create match data object matching the exact schema field names
    const matchData = {
      season: seasonId, // Add the season ID
      tournament: tournament,
      stage,
      gameDay: parseInt(gameDay),
      matchDateTime,
      location,
      homeTeam,
      awayTeam: selectedAwayTeam,
      matchStatus,

      // Only include scores and winner for In Progress or Completed matches
      scores:
        matchStatus === "In Progress" || matchStatus === "Completed"
          ? scores
          : undefined,
      winnerTeam: matchStatus === "Completed" ? winnerTeam : undefined,
    };

    try {
      const url = isEditing
        ? `/api/matches/${initialData._id}`
        : "/api/matches";

      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(matchData),
      });

      const jsonRes = await res.json();

      if (jsonRes.success) {
        alert(
          isEditing
            ? "Match updated successfully"
            : "Match created successfully"
        );
        router.push("/AdminDashboard/matches");
      } else {
        alert(jsonRes.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred: " + (error.message || "Unknown error"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-background"
    >
      <h2 className="text-2xl font-bold text-text-primary mb-6 pb-2 border-b border-background">
        {isEditing ? "Edit Match" : "Add New Match"}
      </h2>

      {/* Season Selection - Add this section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-brand-primary mb-4">
          Season
        </h3>

        <div>
          <label
            htmlFor="season"
            className="block text-text-primary font-medium mb-2"
          >
            Select Season <span className="text-red-500">*</span>
          </label>
          <select
            id="season"
            value={seasonId}
            onChange={(e) => setSeasonId(e.target.value)}
            className="w-full px-3 py-2 border border-text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            required
          >
            <option value="">Select a Season</option>
            {seasons.map((season) => (
              <option key={season._id} value={season._id}>
                {season.name} {season.year} {season.isActive ? "(Active)" : ""}
              </option>
            ))}
          </select>
          {seasons.length === 0 && (
            <p className="mt-2 text-sm text-red-500">
              No seasons found. Please create a season first.
            </p>
          )}
        </div>
      </div>

      {/* Tournament Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-brand-primary mb-4">
          Tournament Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="tournament"
              className="block text-text-primary font-medium mb-2"
            >
              Tournament
            </label>
            <input
              type="text"
              id="tournament"
              value={tournament}
              onChange={(e) => setTournament(e.target.value)}
              className="w-full px-3 py-2 border border-text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>

          <div>
            <label
              htmlFor="stage"
              className="block text-text-primary font-medium mb-2"
            >
              Stage
            </label>
            <select
              id="stage"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full px-3 py-2 border border-text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            >
              <option value="Group Stage">Group Stage</option>
              <option value="Quarter Finals">Quarter Finals</option>
              <option value="Semi Finals">Semi Finals</option>
              <option value="Final">Final</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="gameDay"
              className="block text-text-primary font-medium mb-2"
            >
              Game Day
            </label>
            <input
              type="number"
              id="gameDay"
              min="1"
              value={gameDay}
              onChange={(e) => setGameDay(e.target.value)}
              className="w-full px-3 py-2 border border-text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>
        </div>
      </div>

      {/* Match Details Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-brand-primary mb-4">
          Match Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="matchDate"
              className="block text-text-primary font-medium mb-2"
            >
              Match Date
            </label>
            <input
              type="date"
              id="matchDate"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              className="w-full px-3 py-2 border border-text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>

          <div>
            <label
              htmlFor="matchTime"
              className="block text-text-primary font-medium mb-2"
            >
              Match Time
            </label>
            <input
              type="time"
              id="matchTime"
              value={matchTime}
              onChange={(e) => setMatchTime(e.target.value)}
              className="w-full px-3 py-2 border border-text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="location"
              className="block text-text-primary font-medium mb-2"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>
        </div>
      </div>

      {/* Teams Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-brand-primary mb-4">Teams</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label
              htmlFor="homeTeam"
              className="block text-text-primary font-medium mb-2"
            >
              Home Team
            </label>
            <div className="flex items-center border border-text-secondary bg-background/10 rounded-lg px-3 py-2">
              <img
                src={homeTeam.logo}
                alt="Lalitpur Queens Logo"
                className="w-8 h-8 mr-3 rounded-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/32x32/DEE1EC/666666?text=LQ";
                }}
              />
              <span className="text-text-primary">{homeTeam.name}</span>
            </div>
            <p className="text-xs text-text-secondary mt-1 italic">
              Lalitpur Queens is always set as the home team
            </p>
          </div>

          <div>
            <label
              htmlFor="awayTeam"
              className="block text-text-primary font-medium mb-2"
            >
              Opponent Team
            </label>
            <select
              id="awayTeam"
              value={awayTeamId}
              onChange={(e) => setAwayTeamId(e.target.value)}
              className="w-full px-3 py-2 border border-text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            >
              <option value="">Select Opponent Team</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Match Status Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-brand-primary mb-4">
          Match Status
        </h3>

        <div>
          <label
            htmlFor="matchStatus"
            className="block text-text-primary font-medium mb-2"
          >
            Status
          </label>
          <select
            id="matchStatus"
            value={matchStatus}
            onChange={(e) => setMatchStatus(e.target.value)}
            className="w-full px-3 py-2 border border-text-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            required
          >
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Postponed">Postponed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Score Section - Only visible for In Progress or Completed matches */}
      {(matchStatus === "In Progress" || matchStatus === "Completed") && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-brand-primary">
              Set Scores
            </h3>
            <button
              type="button"
              onClick={addSet}
              className="text-brand-secondary hover:text-brand-primary transition-colors"
            >
              + Add Set
            </button>
          </div>

          {scores.sets.map((set, index) => (
            <div key={index} className="flex items-center gap-2 mb-3">
              <div className="font-medium w-16 text-text-primary">
                Set {index + 1}:
              </div>

              <div className="flex-1 flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-text-secondary mb-1">
                    Lalitpur Queens
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={set.homeScore}
                    onChange={(e) =>
                      updateSetScore(index, "home", e.target.value)
                    }
                    className="w-16 px-2 py-1 border border-text-secondary rounded-lg text-center"
                    required
                  />
                </div>
                <span className="font-medium text-text-secondary">-</span>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-text-secondary mb-1">
                    Opponent
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={set.awayScore}
                    onChange={(e) =>
                      updateSetScore(index, "away", e.target.value)
                    }
                    className="w-16 px-2 py-1 border border-text-secondary rounded-lg text-center"
                    required
                  />
                </div>
              </div>

              {scores.sets.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSet(index)}
                  className="text-error hover:text-red-700 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <div className="mt-4 pt-4 border-t border-background">
            <div className="flex justify-between font-semibold text-text-primary">
              <span>Total Sets Won:</span>
              <span>
                {scores.totalSets.home} - {scores.totalSets.away}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-background text-text-primary py-2 px-6 rounded-lg hover:bg-gray-200 transition duration-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-brand-secondary text-white py-2 px-6 rounded-lg hover:bg-brand-primary transition duration-300"
        >
          {isEditing ? "Update Match" : "Save Match"}
        </button>
      </div>
    </form>
  );
}

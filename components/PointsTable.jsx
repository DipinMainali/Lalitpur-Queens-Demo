// components/PointsTable.js
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy, ArrowUp } from "lucide-react";

const PointsTable = ({
  data: initialData,
  seasonData,
  currentSeasonId,
  showOnlyActive = false,
}) => {
  const [data, setData] = useState(initialData || []);
  const [seasons, setSeasons] = useState(seasonData || []);
  const [selectedSeason, setSelectedSeason] = useState(currentSeasonId || "");
  const [loading, setLoading] = useState(false);
  const [activeSeason, setActiveSeason] = useState(null);

  useEffect(() => {
    if (initialData) {
      // Sort data when it's received
      const sortedData = sortStandingData(initialData);
      setData(sortedData);
    }
    if (seasonData) {
      setSeasons(seasonData);
    }
    if (currentSeasonId) {
      setSelectedSeason(currentSeasonId);
    }

    // If showOnlyActive is true, fetch active season info
    if (showOnlyActive) {
      fetchActiveSeasonInfo();
    }
  }, [initialData, seasonData, currentSeasonId, showOnlyActive]);

  // Function to sort standings data by points and then set difference
  const sortStandingData = (standingData) => {
    return [...standingData].sort((a, b) => {
      // First sort by points (descending)
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      // If points are equal, sort by set difference (descending)
      const aSetDiff = a.setWon - a.setLost;
      const bSetDiff = b.setWon - b.setLost;

      if (bSetDiff !== aSetDiff) {
        return bSetDiff - aSetDiff;
      }

      // If set difference is also equal, sort by most sets won
      if (b.setWon !== a.setWon) {
        return b.setWon - a.setWon;
      }

      // Further tiebreaker: most matches won
      return b.won - a.won;
    });
  };

  const fetchActiveSeasonInfo = async () => {
    try {
      const res = await fetch("/api/seasons?active=true");
      const response = await res.json();

      if (response.success && response.data.length > 0) {
        setActiveSeason(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching active season:", error);
    }
  };

  const fetchStandings = async (seasonId) => {
    if (!seasonId) return;

    setLoading(true);
    try {
      const url = `/api/standings?seasonId=${seasonId}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Failed to fetch standings");
      }

      const response = await res.json();

      if (response.success) {
        // Sort data before setting state
        const sortedData = sortStandingData(response.data || []);
        setData(sortedData);
      }
    } catch (error) {
      console.error("Error fetching standings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeasonChange = (seasonId) => {
    setSelectedSeason(seasonId);
    fetchStandings(seasonId);
  };

  // Calculate set difference for display
  const calculateSetDiff = (setWon, setLost) => {
    const diff = setWon - setLost;
    return diff > 0 ? `+${diff}` : diff;
  };

  // Find selected season name
  const currentActiveSeason =
    seasons.find((s) => s._id === selectedSeason) || activeSeason;
  const seasonName = currentActiveSeason
    ? `${currentActiveSeason.name} ${currentActiveSeason.year}`
    : "Current Season";

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      {/* Header with Season Title */}
      <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-2 rounded-lg mr-3 shadow-sm">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              League Standings
            </h3>
            <p className="text-gray-500 text-sm">{seasonName}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center text-xs text-gray-500">
          <span className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
            <ArrowUp className="h-3 w-3 mr-1" />
            Sorted by points, then set difference
          </span>
        </div>
      </div>

      {/* Season selector tabs - only show if not in showOnlyActive mode */}
      {!showOnlyActive && seasons.length > 1 && (
        <div className="bg-white px-6 py-3 border-b border-gray-200 overflow-x-auto">
          <div className="flex flex-wrap gap-2">
            {seasons.map((season) => (
              <button
                key={season._id}
                onClick={() => handleSeasonChange(season._id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow ${
                  selectedSeason === season._id
                    ? "bg-brand-primary text-white shadow-brand-primary/30"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow-md"
                }`}
              >
                {season.name} {season.year}{" "}
                {season.isActive && (
                  <span className="ml-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-brand-primary"></div>
            <p className="mt-4 text-gray-600">Loading standings...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Trophy className="text-gray-400 w-8 h-8" />
            </div>
            <p className="text-xl font-medium text-gray-800">
              No standings available
            </p>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Check back later for updated standings for this season.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rank
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Team
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  P
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  W
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  D
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  L
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-brand-primary/5"
                >
                  Points
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sets W/L
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-brand-primary/5"
                >
                  Set Diff
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((team, index) => {
                // Highlight Lalitpur Queens team
                const isQueens =
                  team.team.name.toLowerCase().includes("queens") ||
                  team.team.name.toLowerCase().includes("lalitpur");

                // Calculate set difference
                const setDiff = team.setWon - team.setLost;

                return (
                  <tr
                    key={team._id || index}
                    className={`hover:bg-gray-50 transition-colors ${
                      isQueens ? "bg-brand-primary/5" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center">
                        <span
                          className={`flex items-center justify-center h-6 w-6 rounded-full ${
                            index === 0
                              ? "bg-yellow-100 text-yellow-800"
                              : index === 1
                              ? "bg-gray-100 text-gray-800"
                              : index === 2
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-50 text-gray-500"
                          } font-bold text-xs`}
                        >
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                          <Image
                            src={
                              team.team.logo ||
                              "https://placehold.co/100x100/DEE1EC/666666?text=Team"
                            }
                            alt={team.team.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://placehold.co/100x100/DEE1EC/666666?text=Team";
                            }}
                          />
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            isQueens
                              ? "text-brand-primary font-bold"
                              : "text-gray-900"
                          }`}
                        >
                          {team.team.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {team.played}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {team.won}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {team.drawn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {team.lost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-base font-semibold text-gray-900 bg-brand-primary/5">
                      {team.points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {team.setWon} / {team.setLost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium bg-brand-primary/5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          setDiff > 0
                            ? "bg-green-100 text-green-800"
                            : setDiff < 0
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {calculateSetDiff(team.setWon, team.setLost)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PointsTable;

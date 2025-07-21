// components/PointsTable.js
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy, ArrowUp, ChevronDown } from "lucide-react";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

    // If no specific season is set, fetch active season info
    if (!currentSeasonId || showOnlyActive) {
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

        // If no season is selected yet, select the active season
        if (!selectedSeason) {
          setSelectedSeason(response.data[0]._id);
          fetchStandings(response.data[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching active season:", error);
    }
  };

  const fetchAllSeasons = async () => {
    try {
      const res = await fetch("/api/seasons");
      const response = await res.json();

      if (response.success) {
        setSeasons(response.data);
      }
    } catch (error) {
      console.error("Error fetching all seasons:", error);
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
    setDropdownOpen(false);
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

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest("#season-dropdown")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      {/* Header with Season Title and Season Selector */}
      <div className="bg-gray-50 px-6 py-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-2 rounded-lg mr-3 shadow-sm">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              League Standings
            </h3>
          </div>
        </div>

        {/* Modern Enhanced Season Dropdown */}
        <div className="relative w-full sm:w-auto" id="season-dropdown">
          <button
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              if (seasons.length <= 1) fetchAllSeasons();
            }}
            className="flex items-center justify-between w-full sm:w-64 px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <div className="flex items-center">
              <div className="mr-3 bg-gray-100 rounded-md p-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700">
                  {seasonName}
                </span>
                <span className="block text-xs text-gray-500">
                  Select season
                </span>
              </div>
              {currentActiveSeason?.isActive && (
                <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                dropdownOpen ? "transform rotate-180" : ""
              }`}
            />
          </button>

          {/* Enhanced Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto transition-all duration-200 animate-fadeIn">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-2">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  All Seasons
                </p>
              </div>

              {seasons.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-t-brand-primary border-r-brand-primary border-b-transparent border-l-transparent mb-3"></div>
                  <p className="text-sm">Loading seasons...</p>
                </div>
              ) : (
                <div className="py-1">
                  {seasons.map((season) => (
                    <button
                      key={season._id}
                      onClick={() => handleSeasonChange(season._id)}
                      className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150 ${
                        selectedSeason === season._id
                          ? "bg-brand-primary/10"
                          : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <span
                          className={`block w-2 h-2 rounded-full mr-2 ${
                            season.isActive ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></span>
                        <span className="text-sm font-medium">
                          {season.name} {season.year}
                        </span>
                      </div>
                      {season.isActive && (
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                      {selectedSeason === season._id && (
                        <svg
                          className="w-4 h-4 text-brand-primary"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Legend for sorting */}
      <div className="bg-gray-50 px-6 py-2 border-b border-gray-200">
        <div className="flex justify-center md:justify-end text-xs text-gray-500">
          <span className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
            <ArrowUp className="h-3 w-3 mr-1" />
            Sorted by points, then set difference
          </span>
        </div>
      </div>

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

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { Trophy, ArrowUp } from "lucide-react";

export default function StandingsPage() {
  const [standings, setStandings] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStandings = async (seasonId = null) => {
    setLoading(true);
    setError(null);

    try {
      const url = seasonId
        ? `/api/standings?seasonId=${seasonId}`
        : "/api/standings";
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Failed to fetch standings");
      }

      const data = await res.json();

      if (data.success) {
        // Sort standings by points (descending), then by set difference (descending)
        const sortedStandings = (data.data || []).sort((a, b) => {
          // First sort by points (highest to lowest)
          if (b.points !== a.points) {
            return b.points - a.points;
          }

          // If points are equal, sort by set difference (highest to lowest)
          const aSetDiff = a.setWon - a.setLost;
          const bSetDiff = b.setWon - b.setLost;
          return bSetDiff - aSetDiff;
        });

        setStandings(sortedStandings);
        setSeasons(data.seasons || []);
        setSelectedSeason(data.currentSeason || "");
      } else {
        setError(data.message || "Failed to fetch standings");
      }
    } catch (error) {
      setError(error.message || "An error occurred");
      console.error("Error fetching standings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, []);

  const handleSeasonChange = (e) => {
    const seasonId = e.target.value;
    setSelectedSeason(seasonId);
    fetchStandings(seasonId);
  };

  const handleDeleteStanding = async (id) => {
    if (confirm("Are you sure you want to delete this standing?")) {
      try {
        const res = await fetch(`/api/standings/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Failed to delete standing");
        }

        const data = await res.json();

        if (data.success) {
          // Refresh standings after successful deletion
          fetchStandings(selectedSeason);
        } else {
          alert(`Failed to delete: ${data.message}`);
        }
      } catch (error) {
        console.error("Error deleting standing:", error);
        alert(`An error occurred: ${error.message}`);
      }
    }
  };

  // Calculate set difference for display
  const calculateSetDiff = (setWon, setLost) => {
    const diff = setWon - setLost;
    return diff > 0 ? `+${diff}` : diff;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-2.5 rounded-lg mr-4 shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Team Standings</h1>
        </div>

        <Link
          href="/AdminDashboard/standings/add"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-secondary hover:bg-brand-primary text-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-brand-secondary/30"
        >
          <AiOutlinePlus className="text-lg" />
          <span>Add Standing</span>
        </Link>
      </div>

      {/* Season selector tabs */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3 text-gray-300">
          Select Season:
        </label>
        <div className="flex flex-wrap gap-2">
          {seasons.map((season) => (
            <button
              key={season._id}
              onClick={() => {
                setSelectedSeason(season._id);
                fetchStandings(season._id);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow ${
                selectedSeason === season._id
                  ? "bg-brand-primary text-white shadow-brand-primary/30"
                  : "bg-white hover:bg-gray-100 text-gray-800 hover:shadow-md"
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

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-md">
          <div className="flex">
            <div className="py-1">
              <svg
                className="h-6 w-6 text-red-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              League Standings
            </h2>
            <div className="flex items-center text-xs text-gray-500">
              <span className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                <ArrowUp className="h-3 w-3 mr-1" />
                Sorted by points, then by set difference
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-brand-primary"></div>
            <p className="mt-4 text-gray-600">Loading standings...</p>
          </div>
        ) : standings.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <AiOutlinePlus className="text-gray-400 text-xl" />
            </div>
            <p className="text-xl font-medium text-gray-800">
              No standings found
            </p>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              No standings have been added for this season yet. Add your first
              team standing now.
            </p>
            <Link
              href="/AdminDashboard/standings/add"
              className="mt-6 inline-flex items-center px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white rounded-lg shadow-lg transition-all duration-300"
            >
              <AiOutlinePlus className="mr-2" /> Add Standing
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                  <th
                    scope="col"
                    className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {standings.map((standing, index) => (
                  <tr
                    key={standing._id}
                    className="hover:bg-gray-50 transition-colors"
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
                        {standing.team.logo && (
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                            <img
                              src={standing.team.logo}
                              alt={standing.team.name}
                              className="h-10 w-10 object-contain"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://placehold.co/100x100/DEE1EC/666666?text=Team";
                              }}
                            />
                          </div>
                        )}
                        <div className="text-sm font-medium text-gray-900">
                          {standing.team.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {standing.played}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {standing.won}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {standing.drawn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {standing.lost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-base font-semibold text-gray-900 bg-brand-primary/5">
                      {standing.points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {standing.setWon} / {standing.setLost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium bg-brand-primary/5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          standing.setWon - standing.setLost > 0
                            ? "bg-green-100 text-green-800"
                            : standing.setWon - standing.setLost < 0
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {calculateSetDiff(standing.setWon, standing.setLost)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/AdminDashboard/standings/edit/${standing._id}`}
                        className="text-brand-primary hover:text-brand-secondary mr-4 inline-flex items-center gap-1 transition-colors"
                      >
                        <AiOutlineEdit className="text-lg" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteStanding(standing._id)}
                        className="text-red-500 hover:text-red-700 inline-flex items-center gap-1 transition-colors"
                      >
                        <AiOutlineDelete className="text-lg" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

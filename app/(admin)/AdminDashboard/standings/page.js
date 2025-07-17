"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";

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
        setStandings(data.data || []);
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

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 text-white">
        <h1 className="text-2xl font-bold">Team Standings</h1>
        <Link
          href="/AdminDashboard/standings/add"
          className="bg-brand-secondary hover:bg-brand-primary text-white py-2 px-4 rounded-md transition duration-300 flex items-center gap-2"
        >
          <AiOutlinePlus />
          <span>Add Standing</span>
        </Link>
      </div>

      {/* Season selector tabs */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-white">
          Season:
        </label>
        <div className="flex flex-wrap gap-2">
          {seasons.map((season) => (
            <button
              key={season._id}
              onClick={() => {
                setSelectedSeason(season._id);
                fetchStandings(season._id);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedSeason === season._id
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {season.name} {season.year} {season.isActive ? "(Active)" : ""}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-secondary"></div>
            <p className="mt-2 text-text-secondary">Loading standings...</p>
          </div>
        ) : standings.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-background/30 rounded-full flex items-center justify-center mb-4">
              <AiOutlinePlus className="text-text-secondary text-xl" />
            </div>
            <p className="text-lg text-text-secondary">No standings found</p>
            <p className="text-sm text-text-secondary/70 mt-1">
              No standings found for this season.
            </p>
            <Link
              href="/AdminDashboard/standings/add"
              className="mt-4 inline-block bg-brand-secondary hover:bg-brand-primary text-white py-2 px-4 rounded-md transition duration-300"
            >
              Add Standing
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-background">
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                    P
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                    W
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                    D
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                    L
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Pts
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Sets Won
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Sets Lost
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-background">
                {standings.map((standing) => (
                  <tr key={standing._id} className="hover:bg-background/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {standing.team.logo && (
                          <div className="h-10 w-10 rounded bg-background/50 overflow-hidden flex items-center justify-center">
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
                        <div className="text-sm font-medium text-text-primary">
                          {standing.team.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                      {standing.played}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                      {standing.won}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                      {standing.drawn}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                      {standing.lost}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-sm">
                      {standing.points}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                      {standing.setWon}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                      {standing.setLost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/AdminDashboard/standings/edit/${standing._id}`}
                        className="text-brand-primary hover:text-brand-secondary mr-3 inline-flex items-center gap-1"
                      >
                        <AiOutlineEdit /> Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteStanding(standing._id)}
                        className="text-error hover:text-red-700 inline-flex items-center gap-1"
                      >
                        <AiOutlineDelete /> Delete
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

"use client";
import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faSort, faSync } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function StandingsPage() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  // Define fetchStandings as a memoized function
  const fetchStandings = useCallback(async () => {
    if (!isMounted) return;

    setLoading(true);
    try {
      const response = await fetch("/api/standings", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const result = await response.json();

      if (result.success && isMounted) {
        // Sort standings by points (highest first), then by set difference
        const sortedStandings = result.data.sort((a, b) => {
          if (b.points !== a.points) {
            return b.points - a.points; // Sort by points
          }
          return b.setWon - b.setLost - (a.setWon - a.setLost); // Then by set difference
        });

        setStandings(sortedStandings);
      } else if (isMounted) {
        setError(result.message || "Failed to fetch standings");
      }
    } catch (err) {
      if (isMounted) {
        setError("Error loading standings: " + err.message);
        console.error(err);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }, [isMounted]);

  // Set up mounting state
  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  // Fetch standings when mounted
  useEffect(() => {
    if (isMounted) {
      fetchStandings();
    }
  }, [fetchStandings, isMounted]);

  const recalculateStandings = async () => {
    if (
      !confirm(
        "Are you sure you want to recalculate all standings? This will update standings based on completed matches."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/standings/recalculate", {
        method: "POST",
      });

      const result = await response.json();

      if (result.success) {
        alert("Standings recalculated successfully");
        fetchStandings();
      } else {
        alert(result.message || "Failed to recalculate standings");
      }
    } catch (error) {
      console.error("Error recalculating standings:", error);
      alert("An error occurred while recalculating standings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Team Standings</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={recalculateStandings}
            className="bg-brand-primary hover:bg-brand-secondary text-white py-2 px-4 rounded-md transition duration-300 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faSync} />
            Recalculate Standings
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-secondary"></div>
            <p className="mt-2 text-text-secondary">Loading standings...</p>
          </div>
        ) : error ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : standings.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-background/30 rounded-full flex items-center justify-center mb-4">
              <FontAwesomeIcon
                icon={faTrophy}
                className="text-text-secondary text-xl"
              />
            </div>
            <p className="text-lg text-text-secondary">No standings found</p>
            <p className="text-sm text-text-secondary/70 mt-1">
              Standings are automatically calculated based on match results
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-background">
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider flex items-center gap-1">
                    <FontAwesomeIcon icon={faSort} className="text-gray-400" />
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    P
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    W
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    D
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    L
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Sets Won
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Sets Lost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Set Diff
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-background">
                {standings.map((standing, index) => (
                  <tr
                    key={standing._id || index}
                    className="hover:bg-background/20"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`
                          inline-flex items-center justify-center rounded-full w-6 h-6 text-xs font-medium
                          ${
                            index < 3
                              ? "bg-brand-secondary text-white"
                              : "bg-background text-text-secondary"
                          }
                        `}
                        >
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {standing.team?.logo && (
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <img
                              src={standing.team.logo}
                              alt={`${standing.team?.name || "Team"} logo`}
                              className="h-8 object-contain"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://placehold.co/40x40/DEE1EC/666666?text=${
                                  standing.team?.name?.charAt(0) || "T"
                                }`;
                              }}
                            />
                          </div>
                        )}
                        <div className="text-sm font-medium text-text-primary">
                          {standing.team?.name || "Unknown Team"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {standing.played}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {standing.won}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {standing.drawn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {standing.lost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {standing.setWon}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {standing.setLost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full 
                        ${
                          standing.setWon - standing.setLost > 0
                            ? "bg-green-100 text-green-800"
                            : standing.setWon - standing.setLost < 0
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {standing.setWon - standing.setLost}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-text-primary">
                        {standing.points}
                      </span>
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

// components/PointsTable.js
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

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
      setData(initialData);
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
        setData(response.data || []);
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

  // Find selected season name
  const currentActiveSeason =
    seasons.find((s) => s._id === selectedSeason) || activeSeason;
  const seasonName = currentActiveSeason
    ? `${currentActiveSeason.name} ${currentActiveSeason.year}`
    : "Current Season";

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header with Season Title */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          League Standings
        </h3>
        <p className="text-white/80 text-sm mt-1">{seasonName}</p>
      </div>

      {/* Season selector tabs - only show if not in showOnlyActive mode */}
      {!showOnlyActive && seasons.length > 1 && (
        <div className="bg-gray-50 px-4 py-3 border-b border-background overflow-x-auto">
          <div className="flex flex-nowrap gap-2 items-center">
            {seasons.map((season) => (
              <button
                key={season._id}
                onClick={() => handleSeasonChange(season._id)}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                  selectedSeason === season._id
                    ? "bg-brand-secondary text-white shadow-sm"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {season.name} {season.year} {season.isActive && "(Active)"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-brand-secondary"></div>
            <p className="mt-2 text-text-secondary text-sm">
              Loading standings...
            </p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-text-secondary">
              No standings available
            </p>
            <p className="text-sm text-text-secondary/70 mt-1">
              Check back later for updated standings
            </p>
          </div>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-brand-primary/5 text-text-primary uppercase text-xs leading-normal">
                <th className="py-3 px-4 sm:px-6 text-left">#</th>
                <th className="py-3 px-4 sm:px-6 text-left">Team</th>
                <th className="py-3 px-2 sm:px-4 text-center">P</th>
                <th className="py-3 px-2 sm:px-4 text-center">W</th>
                <th className="py-3 px-2 sm:px-4 text-center">D</th>
                <th className="py-3 px-2 sm:px-4 text-center">L</th>
                <th className="py-3 px-3 sm:px-6 text-center font-semibold">
                  PTS
                </th>
                <th className="hidden sm:table-cell py-3 px-2 sm:px-4 text-center">
                  Sets +/-
                </th>
              </tr>
            </thead>
            <tbody className="text-text-secondary text-sm font-light">
              {data.map((team, index) => {
                // Highlight Lalitpur Queens team
                const isQueens =
                  team.team.name.toLowerCase().includes("queens") ||
                  team.team.name.toLowerCase().includes("lalitpur");

                // Determine row styling based on position and if it's Queens
                let rowClass =
                  "border-b border-background hover:bg-background/10 transition-colors";
                if (isQueens) rowClass += " bg-brand-primary/5";
                else if (index === 0) rowClass += " bg-green-50";
                else if (index === data.length - 1) rowClass += " bg-red-50";

                return (
                  <tr key={index} className={rowClass}>
                    <td className="py-3 px-4 sm:px-6 text-center sm:text-left font-semibold">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-background/30 overflow-hidden flex-shrink-0">
                          <Image
                            src={
                              team.team.logo ||
                              "https://placehold.co/100x100/DEE1EC/666666?text=Team"
                            }
                            alt={team.team.name}
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://placehold.co/100x100/DEE1EC/666666?text=Team";
                            }}
                          />
                        </div>
                        <span
                          className={`font-medium line-clamp-1 ${
                            isQueens ? "text-brand-primary font-bold" : ""
                          }`}
                        >
                          {team.team.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-center">
                      {team.played}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-center">
                      {team.won}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-center">
                      {team.drawn}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-center">
                      {team.lost}
                    </td>
                    <td className="py-3 px-3 sm:px-6 text-center font-bold text-brand-primary">
                      {team.points}
                    </td>
                    <td className="hidden sm:table-cell py-3 px-2 sm:px-4 text-center">
                      <span className="inline-flex items-center">
                        <span className="text-green-600">{team.setWon}</span>
                        <span className="mx-1 text-gray-400">/</span>
                        <span className="text-red-600">{team.setLost}</span>
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

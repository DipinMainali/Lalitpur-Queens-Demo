"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faUserGroup,
  faCalendarAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

export default function PlayersAdmin() {
  const [players, setPlayers] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter();

  // Fetch seasons
  useEffect(() => {
    const fetchSeasons = async () => {
      if (!isMounted) return;

      try {
        const res = await fetch("/api/seasons", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        const jsonRes = await res.json();

        if (jsonRes.success && isMounted) {
          setSeasons(jsonRes.data);

          // Set active season as default if available
          const activeSeason = jsonRes.data.find((season) => season.isActive);
          if (activeSeason) {
            setSelectedSeason(activeSeason._id);
          }
        }
      } catch (err) {
        console.error("Error fetching seasons:", err);
      }
    };

    if (isMounted) {
      fetchSeasons();
    }
  }, [isMounted]);

  // Define fetchPlayers as a memoized function
  const fetchPlayers = useCallback(async () => {
    if (!isMounted) return;

    setIsLoading(true);
    try {
      // Add seasonId to query parameters if selected
      const url = selectedSeason
        ? `/api/players?seasonId=${selectedSeason}`
        : "/api/players";

      console.log("Fetching players from:", url); // Debug log

      const res = await fetch(url, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      const jsonRes = await res.json();

      if (jsonRes.success && isMounted) {
        setPlayers(jsonRes.data);
        console.log(`Found ${jsonRes.data.length} players`); // Debug log
      } else if (isMounted) {
        console.error("Failed to fetch players:", jsonRes.message);
        setPlayers([]); // Ensure empty array on error
      }
    } catch (err) {
      if (isMounted) {
        console.error("Error fetching players:", err);
        setPlayers([]); // Ensure empty array on error
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  }, [isMounted, selectedSeason]);

  // Set up mounting state
  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  // Fetch players when mounted or season changes
  useEffect(() => {
    if (isMounted) {
      fetchPlayers();
    }
  }, [fetchPlayers, isMounted, selectedSeason]);

  const handleEdit = (id) => {
    router.push(`/AdminDashboard/players/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this player?")) {
      return;
    }

    try {
      const res = await fetch(`/api/players/${id}`, {
        method: "DELETE",
      });
      const jsonRes = await res.json();

      if (jsonRes.success) {
        setPlayers(players.filter((player) => player._id !== id));
        alert("Player deleted successfully");
      } else {
        alert(jsonRes.message || "Failed to delete player");
      }
    } catch (err) {
      console.error("Error deleting player:", err);
      alert("An error occurred while deleting the player");
    }
  };

  // Get season display name
  const getSeasonName = (seasonId) => {
    if (!seasonId) return "All Seasons";
    const season = seasons.find((s) => s._id === seasonId);
    return season
      ? `${season.name} ${season.year}${season.isActive ? " (Active)" : ""}`
      : "Select Season";
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Players Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => fetchPlayers()}
            className="bg-brand-primary hover:bg-opacity-90 text-white py-2 px-4 rounded-md transition duration-300 flex items-center gap-2"
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isLoading ? "Loading..." : "Refresh"}
          </button>
          <Link
            href="/AdminDashboard/players/add"
            className="bg-brand-secondary hover:bg-brand-primary text-white py-2 px-4 rounded-md transition duration-300 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add New Player
          </Link>
        </div>
      </div>

      {/* Season Selector */}
      {seasons && seasons.length > 0 && (
        <div className="mb-6">
          <div className="relative inline-block text-left w-64">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-white bg-brand-secondary rounded-md hover:bg-opacity-90 focus:outline-none"
            >
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                <span>{getSeasonName(selectedSeason)}</span>
              </div>
              <FontAwesomeIcon icon={faChevronDown} />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute left-0 w-full mt-2 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setSelectedSeason("");
                      setDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      !selectedSeason
                        ? "bg-brand-secondary text-white"
                        : "text-text-primary hover:bg-gray-100"
                    }`}
                  >
                    All Seasons
                  </button>

                  {seasons.map((season) => (
                    <button
                      key={season._id}
                      onClick={() => {
                        setSelectedSeason(season._id);
                        setDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        selectedSeason === season._id
                          ? "bg-brand-secondary text-white"
                          : "text-text-primary hover:bg-gray-100"
                      }`}
                    >
                      {season.name} {season.year}
                      {season.isActive && " (Active)"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-secondary"></div>
            <p className="mt-2 text-text-secondary">Loading players...</p>
          </div>
        ) : players.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-background/30 rounded-full flex items-center justify-center mb-4">
              <FontAwesomeIcon
                icon={faUserGroup}
                className="text-text-secondary text-xl"
              />
            </div>
            <p className="text-lg text-text-secondary">
              {selectedSeason
                ? `No players found for ${getSeasonName(selectedSeason)}`
                : "No players found"}
            </p>
            <p className="text-sm text-text-secondary/70 mt-1">
              Create your first player by clicking &quot;Add New Player&quot;
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-background">
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Jersey Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-background">
                {players.map((player) => (
                  <tr key={player._id} className="hover:bg-background/20">
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-brand-secondary/10 rounded-full text-brand-secondary font-medium">
                        {player.jerseyNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-text-primary">
                        {player.firstName} {player.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          player.featured
                            ? "bg-brand-secondary/20 text-brand-secondary"
                            : "bg-background text-text-secondary"
                        }`}
                      >
                        {player.featured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(player._id)}
                        className="text-brand-primary hover:text-brand-secondary mr-3 inline-flex items-center gap-1"
                      >
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(player._id)}
                        className="text-error hover:text-red-700 inline-flex items-center gap-1"
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete
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

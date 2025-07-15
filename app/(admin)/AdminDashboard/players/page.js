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
} from "@fortawesome/free-solid-svg-icons";

export default function PlayersAdmin() {
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  // Define fetchPlayers as a memoized function
  const fetchPlayers = useCallback(async () => {
    if (!isMounted) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/players", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const jsonRes = await res.json();

      if (jsonRes.success && isMounted) {
        setPlayers(jsonRes.data);
      } else if (isMounted) {
        console.error("Failed to fetch players:", jsonRes.message);
      }
    } catch (err) {
      if (isMounted) {
        console.error("Error fetching players:", err);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
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

  // Fetch players when mounted
  useEffect(() => {
    if (isMounted) {
      fetchPlayers();
    }
  }, [fetchPlayers, isMounted]);

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Players Management</h1>
        <Link
          href="/AdminDashboard/players/add"
          className="bg-brand-secondary hover:bg-brand-primary text-white py-2 px-4 rounded-md transition duration-300 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add New Player
        </Link>
      </div>

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
            <p className="text-lg text-text-secondary">No players found</p>
            <p className="text-sm text-text-secondary/70 mt-1">
              Create your first player by clicking "Add New Player"
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

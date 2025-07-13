"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MatchesAdmin() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    fetchMatches();
  }, [statusFilter]);

  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      const url =
        statusFilter === "all"
          ? "/api/matches"
          : `/api/matches?status=${statusFilter}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setMatches(data.data);
      } else {
        console.error("Failed to fetch matches:", data.message);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this match?")) {
      return;
    }

    try {
      const res = await fetch(`/api/matches/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        // Remove match from state
        setMatches(matches.filter((match) => match._id !== id));
        alert("Match deleted successfully");
      } else {
        alert(data.message || "Failed to delete match");
      }
    } catch (error) {
      console.error("Error deleting match:", error);
      alert("An error occurred while deleting the match");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-info/20 text-info";
      case "In Progress":
        return "bg-brand-secondary/20 text-brand-secondary";
      case "Completed":
        return "bg-green-600/20 text-green-700";
      case "Postponed":
        return "bg-accent/20 text-accent";
      case "Cancelled":
        return "bg-error/20 text-error";
      default:
        return "bg-text-secondary/20 text-text-secondary";
    }
  };

  // Helper function to safely get team name
  const getTeamName = (team) => {
    if (!team) return "Unknown Team";
    return team.name || "Unnamed Team";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">
          Matches Management
        </h1>
        <Link
          href="/AdminDashboard/matches/add"
          className="bg-brand-secondary hover:bg-brand-primary text-white py-2 px-4 rounded-md transition duration-300"
        >
          Add New Match
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Filter controls */}
        <div className="p-4 border-b">
          <label className="font-medium text-text-primary mr-2">
            Filter by Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-2 py-1"
          >
            <option value="all">All Matches</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Postponed">Postponed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Matches table */}
        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading matches...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-8">
            <p>No matches found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-background">
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Teams
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Tournament
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-background">
                {matches.map((match) => (
                  <tr key={match._id} className="hover:bg-background/20">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-text-primary">
                        {formatDate(match.matchDateTime)}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {formatTime(match.matchDateTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-text-primary">
                          {getTeamName(match.homeTeam)} vs{" "}
                          {getTeamName(match.awayTeam)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-text-primary">
                        {match.tournament || "N/A"}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {match.stage || "N/A"} - Game {match.gameDay || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                          match.matchStatus
                        )}`}
                      >
                        {match.matchStatus || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {match.matchStatus === "Completed" && match.scores ? (
                        <div className="text-sm text-text-primary">
                          {match.scores.totalSets?.home || 0} -{" "}
                          {match.scores.totalSets?.away || 0}
                        </div>
                      ) : (
                        <div className="text-sm text-text-secondary">-</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() =>
                          router.push(
                            `/AdminDashboard/matches/edit/${match._id}`
                          )
                        }
                        className="text-brand-primary hover:text-brand-secondary mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(match._id)}
                        className="text-error hover:text-red-700"
                      >
                        Delete
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

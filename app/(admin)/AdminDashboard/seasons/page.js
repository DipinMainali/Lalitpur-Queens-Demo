"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";

export default function SeasonsPage() {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSeasons = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/seasons");

      if (!res.ok) {
        throw new Error("Failed to fetch seasons");
      }

      const data = await res.json();

      if (data.success) {
        setSeasons(data.data || []);
      } else {
        setError(data.message || "Failed to fetch seasons");
      }
    } catch (error) {
      setError(error.message || "An error occurred");
      console.error("Error fetching seasons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  const handleDeleteSeason = async (id) => {
    if (
      confirm(
        "Are you sure you want to delete this season? This may affect standings and matches."
      )
    ) {
      try {
        const res = await fetch(`/api/seasons/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Failed to delete season");
        }

        const data = await res.json();

        if (data.success) {
          fetchSeasons(); // Refresh seasons after successful deletion
        } else {
          alert(`Failed to delete: ${data.message}`);
        }
      } catch (error) {
        console.error("Error deleting season:", error);
        alert(`An error occurred: ${error.message}`);
      }
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/seasons/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update season status");
      }

      const data = await res.json();

      if (data.success) {
        fetchSeasons(); // Refresh seasons after successful update
      } else {
        alert(`Failed to update status: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating season status:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Status badge component
  const StatusBadge = ({ isActive }) => {
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 text-white">
        <h1 className="text-2xl font-bold">Seasons</h1>
        <Link
          href="/AdminDashboard/seasons/add"
          className="bg-brand-secondary hover:bg-brand-primary text-white py-2 px-4 rounded-md transition duration-300 flex items-center gap-2"
        >
          <AiOutlinePlus />
          <span>Add Season</span>
        </Link>
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
            <p className="mt-2 text-text-secondary">Loading seasons...</p>
          </div>
        ) : seasons.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-background/30 rounded-full flex items-center justify-center mb-4">
              <AiOutlinePlus className="text-text-secondary text-xl" />
            </div>
            <p className="text-lg text-text-secondary">No seasons found</p>
            <p className="text-sm text-text-secondary/70 mt-1">
              Create your first season to get started.
            </p>
            <Link
              href="/AdminDashboard/seasons/add"
              className="mt-4 inline-block bg-brand-secondary hover:bg-brand-primary text-white py-2 px-4 rounded-md transition duration-300"
            >
              Add Season
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-background">
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Season
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-background">
                {seasons.map((season) => (
                  <tr key={season._id} className="hover:bg-background/20">
                    <td className="px-6 py-4 text-sm font-medium text-text-primary">
                      {season.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {season.year}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {formatDate(season.startDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {formatDate(season.endDate)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() =>
                          handleToggleActive(season._id, season.isActive)
                        }
                        className="focus:outline-none"
                      >
                        <StatusBadge isActive={season.isActive} />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/AdminDashboard/seasons/edit/${season._id}`}
                        className="text-brand-primary hover:text-brand-secondary mr-3 inline-flex items-center gap-1"
                      >
                        <AiOutlineEdit /> Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteSeason(season._id)}
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

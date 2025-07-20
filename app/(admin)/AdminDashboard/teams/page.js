"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faExclamationTriangle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { Trophy, ArrowUp } from "lucide-react";

export default function TeamsAdmin() {
  const [teams, setTeams] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // Track if component is mounted to prevent state updates after unmount
  const [isMounted, setIsMounted] = useState(false);
  // States for delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  // Define fetchTeams as a memoized function to prevent it from changing on each render
  const fetchTeams = useCallback(
    async (seasonId = null) => {
      if (!isMounted) return;

      setIsLoading(true);
      try {
        // Add season filter to API request if seasonId is provided
        const url = seasonId ? `/api/teams?seasonId=${seasonId}` : "/api/teams";

        const res = await fetch(url, {
          // Add cache control to prevent automatic refetching
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        const jsonRes = await res.json();

        if (jsonRes.success && isMounted) {
          setTeams(jsonRes.data);

          // If seasons data is returned, set it
          if (jsonRes.seasons) {
            setSeasons(jsonRes.seasons);
          }

          // Set current season if provided
          if (jsonRes.currentSeason) {
            setSelectedSeason(jsonRes.currentSeason);
          }
        } else if (isMounted) {
          console.error("Failed to fetch teams:", jsonRes.message);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching teams:", err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    },
    [isMounted]
  );

  // Set up mounting state and initial data fetch
  useEffect(() => {
    setIsMounted(true);

    return () => {
      // Clean up when component unmounts
      setIsMounted(false);
    };
  }, []);

  // Fetch teams only when component is mounted
  useEffect(() => {
    if (isMounted) {
      fetchTeams();
    }
  }, [fetchTeams, isMounted]);

  // Handle season change
  const handleSeasonChange = (seasonId) => {
    setSelectedSeason(seasonId);
    fetchTeams(seasonId);
  };

  // Function to open delete confirmation modal
  const openDeleteModal = (team) => {
    setTeamToDelete(team);
    setDeleteModalOpen(true);
  };

  // Function to close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setTeamToDelete(null);
  };

  // Function to handle the actual deletion
  const handleDelete = async () => {
    if (!teamToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/teams/${teamToDelete._id}`, {
        method: "DELETE",
      });

      const jsonRes = await res.json();

      if (jsonRes.success) {
        // Remove the deleted team from the state
        setTeams((prevTeams) =>
          prevTeams.filter((t) => t._id !== teamToDelete._id)
        );
        closeDeleteModal();
      } else {
        console.error("Failed to delete team:", jsonRes.message);
      }
    } catch (err) {
      console.error("Error deleting team:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (id) => {
    router.push(`/AdminDashboard/teams/edit/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-2.5 rounded-lg mr-4 shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Teams Management</h1>
        </div>

        <Link
          href="/AdminDashboard/teams/add"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-secondary hover:bg-brand-primary text-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-brand-secondary/30"
        >
          <FontAwesomeIcon icon={faPlus} className="text-lg" />
          <span>Add New Team</span>
        </Link>
      </div>

      {/* Season selector tabs */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3 text-gray-300">
          Filter Teams by Season:
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => fetchTeams(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow ${
              !selectedSeason
                ? "bg-brand-primary text-white shadow-brand-primary/30"
                : "bg-white hover:bg-gray-100 text-gray-800 hover:shadow-md"
            }`}
          >
            All Seasons
          </button>

          {seasons.map((season) => (
            <button
              key={season._id}
              onClick={() => handleSeasonChange(season._id)}
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

      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              {selectedSeason
                ? `Teams - ${
                    seasons.find((s) => s._id === selectedSeason)?.name || ""
                  } Season`
                : "All Teams"}
            </h2>
            {selectedSeason && (
              <div className="flex items-center text-xs text-gray-500">
                <span className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  Filtered by season
                </span>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-brand-primary"></div>
            <p className="mt-4 text-gray-600">Loading teams...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FontAwesomeIcon
                icon={faPlus}
                className="text-gray-400 text-xl"
              />
            </div>
            <p className="text-xl font-medium text-gray-800">No teams found</p>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              {selectedSeason
                ? "No teams have been added for this season yet."
                : 'Create your first team by clicking "Add New Team"'}
            </p>
            <Link
              href="/AdminDashboard/teams/add"
              className="mt-6 inline-flex items-center px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white rounded-lg shadow-lg transition-all duration-300"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add New Team
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Team
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Logo
                  </th>
                  {!selectedSeason && (
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Season
                    </th>
                  )}
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teams.map((team) => (
                  <tr
                    key={team._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {team.name || "Unnamed Team"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
                          <img
                            src={team.logo}
                            alt={`${team.name} logo`}
                            className="h-8 w-8 object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://placehold.co/40x40/DEE1EC/666666?text=${
                                team.name?.charAt(0) || "T"
                              }`;
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    {!selectedSeason && team.seasonData && (
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {team.seasonData.name} {team.seasonData.year}
                          {team.seasonData.isActive && (
                            <span className="ml-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full text-[10px]">
                              Active
                            </span>
                          )}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(team._id)}
                        className="text-brand-primary hover:text-brand-secondary mr-4 inline-flex items-center gap-1 transition-colors"
                      >
                        <FontAwesomeIcon icon={faEdit} className="text-lg" />{" "}
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(team)}
                        className="text-red-500 hover:text-red-700 inline-flex items-center gap-1 transition-colors"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-lg" />{" "}
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && teamToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="text-2xl"
                />
              </div>
            </div>

            <h3 className="text-xl font-bold text-center text-text-primary mb-2">
              Confirm Deletion
            </h3>

            <p className="text-center text-text-secondary mb-6">
              Are you sure you want to delete the team{" "}
              <span className="font-semibold">
                {teamToDelete.name || "Unknown Team"}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200 font-medium text-text-primary"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors duration-200 font-medium text-white flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faTrash} className="mr-2" /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

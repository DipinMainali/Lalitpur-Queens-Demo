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
} from "@fortawesome/free-solid-svg-icons";

export default function TeamsAdmin() {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Track if component is mounted to prevent state updates after unmount
  const [isMounted, setIsMounted] = useState(false);
  // States for delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  // Define fetchTeams as a memoized function to prevent it from changing on each render
  const fetchTeams = useCallback(async () => {
    if (!isMounted) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/teams", {
        // Add cache control to prevent automatic refetching
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const jsonRes = await res.json();

      if (jsonRes.success && isMounted) {
        setTeams(jsonRes.data);
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
  }, [isMounted]);

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
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team?")) {
      return;
    }

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
        // You could add error notification here
      }
    } catch (err) {
      console.error("Error deleting team:", err);
      // You could add error notification here
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (id) => {
    router.push(`/AdminDashboard/teams/edit/${id}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Teams Management</h1>
        <Link
          href="/AdminDashboard/teams/add"
          className="bg-brand-secondary hover:bg-brand-primary text-white py-2 px-4 rounded-md transition duration-300 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add New Team
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-secondary"></div>
            <p className="mt-2 text-text-secondary">Loading teams...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-background/30 rounded-full flex items-center justify-center mb-4">
              <FontAwesomeIcon
                icon={faPlus}
                className="text-text-secondary text-xl"
              />
            </div>
            <p className="text-lg text-text-secondary">No teams found</p>
            <p className="text-sm text-text-secondary/70 mt-1">
              Create your first team by clicking &quot;Add New Team&quot;
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-background">
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Logo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-background">
                {teams.map((team) => (
                  <tr key={team._id} className="hover:bg-background/20">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-text-primary">
                        {team.name || "Unnamed Team"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-background/50 overflow-hidden flex items-center justify-center">
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(team._id)}
                        className="text-brand-primary hover:text-brand-secondary mr-3 inline-flex items-center gap-1"
                      >
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(team)}
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

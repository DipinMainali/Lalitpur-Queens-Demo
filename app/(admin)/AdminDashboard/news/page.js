"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faNewspaper,
  faFilter,
  faCheck,
  faArchive,
  faPencilAlt,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

export default function NewsAdmin() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Track if component is mounted to prevent state updates after unmount
  const [isMounted, setIsMounted] = useState(false);
  // Add status filter state
  const [statusFilter, setStatusFilter] = useState("all");

  const router = useRouter();

  // Define fetchNews as a memoized function to prevent it from changing on each render
  const fetchNews = useCallback(async () => {
    if (!isMounted) return;

    setIsLoading(true);
    try {
      // Add status filter to API request
      const res = await fetch(`/api/news?status=${statusFilter}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const jsonRes = await res.json();

      if (jsonRes.success && isMounted) {
        setNewsArticles(jsonRes.data);
      } else if (isMounted) {
        console.error("Failed to fetch news:", jsonRes.message);
      }
    } catch (err) {
      if (isMounted) {
        console.error("Error fetching news:", err);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  }, [isMounted, statusFilter]); // Add statusFilter as dependency

  // Set up mounting state and initial data fetch
  useEffect(() => {
    setIsMounted(true);

    return () => {
      // Clean up when component unmounts
      setIsMounted(false);
    };
  }, []);

  // Fetch news only when component is mounted or status filter changes
  useEffect(() => {
    if (isMounted) {
      fetchNews();
    }
  }, [fetchNews, isMounted]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news article?")) {
      return;
    }

    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      });
      const jsonRes = await res.json();

      if (jsonRes.success) {
        // Remove article from state without refetching
        setNewsArticles(newsArticles.filter((article) => article._id !== id));
        alert("News article deleted successfully");
      } else {
        alert(jsonRes.message || "Failed to delete news article");
      }
    } catch (err) {
      console.error("Error deleting news article:", err);
      alert("An error occurred while deleting the news article");
    }
  };

  const handleEdit = (id) => {
    router.push(`/AdminDashboard/news/edit/${id}`);
  };

  // Add status change handler
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const jsonRes = await res.json();
      if (jsonRes.success) {
        // Update the local state to reflect the change
        setNewsArticles(
          newsArticles.map((article) =>
            article._id === id ? { ...article, status: newStatus } : article
          )
        );
      } else {
        alert(`Failed to update status: ${jsonRes.message}`);
      }
    } catch (err) {
      console.error("Error updating article status:", err);
      alert("An error occurred while updating the article status");
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

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor = "bg-gray-100 text-gray-800";
    let icon = faPencilAlt;

    switch (status) {
      case "published":
        bgColor = "bg-green-100 text-green-800";
        icon = faCheck;
        break;
      case "draft":
        bgColor = "bg-blue-100 text-blue-800";
        icon = faPencilAlt;
        break;
      case "archived":
        bgColor = "bg-gray-100 text-gray-800";
        icon = faArchive;
        break;
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}
      >
        <FontAwesomeIcon icon={icon} className="mr-1 h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Add this to your news item cards/rows in the admin panel
  const getStatusBadge = (status) => {
    switch (status) {
      case "published":
        return (
          <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Published
          </span>
        );
      case "draft":
        return (
          <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Draft
          </span>
        );
      case "archived":
        return (
          <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Archived
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 text-white">
        <h1 className="text-2xl font-bold white">News Management</h1>
        <Link
          href="/AdminDashboard/news/add"
          className="bg-brand-secondary hover:bg-brand-primary text-white py-2 px-4 rounded-md transition duration-300 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add News Article
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            statusFilter === "all"
              ? "bg-gray-800 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          All Articles
        </button>
        <button
          onClick={() => setStatusFilter("published")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            statusFilter === "published"
              ? "bg-green-600 text-white"
              : "bg-green-50 hover:bg-green-100 text-green-700"
          }`}
        >
          Published
        </button>
        <button
          onClick={() => setStatusFilter("draft")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            statusFilter === "draft"
              ? "bg-blue-600 text-white"
              : "bg-blue-50 hover:bg-blue-100 text-blue-700"
          }`}
        >
          Drafts
        </button>
        <button
          onClick={() => setStatusFilter("archived")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            statusFilter === "archived"
              ? "bg-gray-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          }`}
        >
          Archived
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-secondary"></div>
            <p className="mt-2 text-text-secondary">Loading news articles...</p>
          </div>
        ) : newsArticles.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-background/30 rounded-full flex items-center justify-center mb-4">
              <FontAwesomeIcon
                icon={faNewspaper}
                className="text-text-secondary text-xl"
              />
            </div>
            <p className="text-lg text-text-secondary">
              No news articles found
            </p>
            <p className="text-sm text-text-secondary/70 mt-1">
              {statusFilter === "all"
                ? 'Create your first news article by clicking "Add News Article"'
                : `No ${statusFilter} articles found.`}
            </p>
            {statusFilter !== "all" && (
              <button
                onClick={() => setStatusFilter("all")}
                className="mt-4 text-brand-primary hover:text-brand-secondary"
              >
                View all articles
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-background">
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-background">
                {newsArticles.map((article) => (
                  <tr key={article._id} className="hover:bg-background/20">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-text-primary">
                        {article.title || "Untitled Article"}
                      </div>
                      <div className="text-xs text-text-secondary mt-1 line-clamp-1">
                        {article.content
                          ?.replace(/<[^>]*>/g, "")
                          .slice(0, 60) || "No content"}
                        ...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-16 rounded bg-background/50 overflow-hidden flex items-center justify-center">
                          {article.image ? (
                            <img
                              src={article.image}
                              alt={`${article.title} thumbnail`}
                              className="h-10 w-16 object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://placehold.co/160x100/DEE1EC/666666?text=News";
                              }}
                            />
                          ) : (
                            <span className="text-xs text-text-secondary">
                              No image
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={article.status || "draft"} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-text-secondary">
                        {formatDate(article.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {/* Status dropdown */}
                      <div className="inline-block relative mr-3 group">
                        <button className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100">
                          <span className="text-xs">Status</span>
                          <svg
                            className="w-4 h-4 inline-block ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                        </button>
                        <div className="absolute right-0 mt-1 hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40">
                          {article.status !== "published" && (
                            <button
                              onClick={() =>
                                handleStatusChange(article._id, "published")
                              }
                              className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-t-lg"
                            >
                              <FontAwesomeIcon
                                icon={faCheck}
                                className="mr-2"
                              />
                              Publish
                            </button>
                          )}
                          {article.status !== "draft" && (
                            <button
                              onClick={() =>
                                handleStatusChange(article._id, "draft")
                              }
                              className="block w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
                            >
                              <FontAwesomeIcon
                                icon={faPencilAlt}
                                className="mr-2"
                              />
                              Move to Draft
                            </button>
                          )}
                          {article.status !== "archived" && (
                            <button
                              onClick={() =>
                                handleStatusChange(article._id, "archived")
                              }
                              className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-b-lg"
                            >
                              <FontAwesomeIcon
                                icon={faArchive}
                                className="mr-2"
                              />
                              Archive
                            </button>
                          )}
                        </div>
                      </div>

                      {/* View button - fixed */}
                      <button
                        onClick={() =>
                          window.open(`/News/${article._id}`, "_blank")
                        }
                        className="text-blue-600 hover:text-blue-800 mr-3 inline-flex items-center gap-1"
                      >
                        <FontAwesomeIcon icon={faEye} /> View
                      </button>

                      {/* Edit button */}
                      <button
                        onClick={() => handleEdit(article._id)}
                        className="text-brand-primary hover:text-brand-secondary mr-3 inline-flex items-center gap-1"
                      >
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(article._id)}
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

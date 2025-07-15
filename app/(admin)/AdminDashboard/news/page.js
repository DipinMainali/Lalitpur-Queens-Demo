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
} from "@fortawesome/free-solid-svg-icons";

export default function NewsAdmin() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Track if component is mounted to prevent state updates after unmount
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  // Define fetchNews as a memoized function to prevent it from changing on each render
  const fetchNews = useCallback(async () => {
    if (!isMounted) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/news", {
        // Add cache control to prevent automatic refetching
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
  }, [isMounted]);

  // Set up mounting state and initial data fetch
  useEffect(() => {
    setIsMounted(true);

    return () => {
      // Clean up when component unmounts
      setIsMounted(false);
    };
  }, []);

  // Fetch news only when component is mounted
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
      <div className="flex justify-between items-center mb-6 text-white ">
        <h1 className="text-2xl font-bold white">News Management</h1>
        <Link
          href="/AdminDashboard/news/add"
          className="bg-brand-secondary hover:bg-brand-primary text-white py-2 px-4 rounded-md transition duration-300 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add News Article
        </Link>
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
              Create your first news article by clicking &quot;Add News
              Article&quot;
            </p>
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
                      <div className="text-sm text-text-secondary">
                        {formatDate(article.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(article._id)}
                        className="text-brand-primary hover:text-brand-secondary mr-3 inline-flex items-center gap-1"
                      >
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </button>
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

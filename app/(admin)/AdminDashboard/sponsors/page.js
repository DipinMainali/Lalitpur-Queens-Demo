"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";

export default function SponsorsAdmin() {
  const [sponsors, setSponsors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  // Define fetchSponsors as a memoized function
  const fetchSponsors = useCallback(async () => {
    if (!isMounted) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/sponsors", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const jsonRes = await res.json();

      if (jsonRes.success && isMounted) {
        setSponsors(jsonRes.data);
      } else if (isMounted) {
        console.error("Failed to fetch sponsors:", jsonRes.message);
      }
    } catch (err) {
      if (isMounted) {
        console.error("Error fetching sponsors:", err);
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

  // Fetch sponsors when mounted
  useEffect(() => {
    if (isMounted) {
      fetchSponsors();
    }
  }, [fetchSponsors, isMounted]);

  const handleEdit = (id) => {
    router.push(`/AdminDashboard/sponsors/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sponsor?")) {
      return;
    }

    try {
      const res = await fetch(`/api/sponsors/${id}`, {
        method: "DELETE",
      });
      const jsonRes = await res.json();

      if (jsonRes.success) {
        setSponsors(sponsors.filter((sponsor) => sponsor._id !== id));
        alert("Sponsor deleted successfully");
      } else {
        alert(jsonRes.message || "Failed to delete sponsor");
      }
    } catch (err) {
      console.error("Error deleting sponsor:", err);
      alert("An error occurred while deleting the sponsor");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Sponsors Management</h1>
        <Link
          href="/AdminDashboard/sponsors/add"
          className="bg-brand-secondary hover:bg-brand-primary text-white py-2 px-4 rounded-md transition duration-300 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add New Sponsor
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-secondary"></div>
            <p className="mt-2 text-text-secondary">Loading sponsors...</p>
          </div>
        ) : sponsors.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-background/30 rounded-full flex items-center justify-center mb-4">
              <FontAwesomeIcon
                icon={faHandshake}
                className="text-text-secondary text-xl"
              />
            </div>
            <p className="text-lg text-text-secondary">No sponsors found</p>
            <p className="text-sm text-text-secondary/70 mt-1">
              Create your first sponsor by clicking &quot;Add New Sponsor&quot;
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-background">
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Logo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-background">
                {sponsors.map((sponsor) => (
                  <tr key={sponsor._id} className="hover:bg-background/20">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-text-primary">
                        {sponsor.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-10 w-20 flex items-center">
                        <img
                          src={sponsor.logo}
                          alt={`${sponsor.name} logo`}
                          className="h-8 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/80x40/DEE1EC/666666?text=${
                              sponsor.name?.charAt(0) || "S"
                            }`;
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-primary hover:text-brand-secondary underline"
                      >
                        {sponsor.website}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-background text-text-secondary">
                        {sponsor.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(sponsor._id)}
                        className="text-brand-primary hover:text-brand-secondary mr-3 inline-flex items-center gap-1"
                      >
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(sponsor._id)}
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

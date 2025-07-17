"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddSeasonPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    year: new Date().getFullYear(),
    startDate: "",
    endDate: "",
    isActive: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/seasons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create season");
      }

      if (data.success) {
        router.push("/AdminDashboard/seasons");
      } else {
        setError(data.message || "Failed to create season");
      }
    } catch (error) {
      console.error("Error creating season:", error);
      setError(error.message || "An error occurred while creating the season");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Add New Season</h1>
        <Link
          href="/AdminDashboard/seasons"
          className="text-brand-secondary hover:text-brand-primary transition duration-300"
        >
          &larr; Back to Seasons
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Season Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              required
              placeholder="e.g. Premier League"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Year*
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              required
              min="2000"
              max="2100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-brand-secondary focus:ring-brand-secondary border-gray-300 rounded"
              />
              <label
                htmlFor="isActive"
                className="ml-2 block text-sm text-gray-700"
              >
                Set as active season
              </label>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Note: Setting this season as active will deactivate all other
              seasons.
            </p>
          </div>

          <div className="flex justify-end">
            <Link
              href="/AdminDashboard/seasons"
              className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-brand-secondary text-white rounded-md hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-secondary ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating..." : "Create Season"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

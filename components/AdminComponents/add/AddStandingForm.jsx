"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddStandingForm() {
  const [teams, setTeams] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    team: "",
    season: "",
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    points: 0,
    setWon: 0,
    setLost: 0,
  });

  useEffect(() => {
    // Fetch teams and seasons
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/standings`);
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();

        if (data.success) {
          setTeams(data.availableTeams || []);
          setSeasons(data.seasons || []);

          if (data.currentSeason) {
            setFormData((prev) => ({ ...prev, season: data.currentSeason }));
          }
        } else {
          setError(data.message || "Failed to load data");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For numeric fields, ensure values are non-negative
    if (
      [
        "played",
        "won",
        "drawn",
        "lost",
        "points",
        "setWon",
        "setLost",
      ].includes(name)
    ) {
      const numValue = parseInt(value) || 0;
      if (numValue < 0) return;

      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.team || !formData.season) {
      alert("Please select both a team and season");
      return;
    }

    // Find the selected team object
    const selectedTeam = teams.find((team) => team._id === formData.team);
    if (!selectedTeam) {
      alert("Please select a valid team");
      return;
    }

    // Prepare data for API call
    const standingData = {
      team: selectedTeam,
      season: formData.season,
      played: Number(formData.played),
      won: Number(formData.won),
      drawn: Number(formData.drawn),
      lost: Number(formData.lost),
      points: Number(formData.points),
      setWon: Number(formData.setWon),
      setLost: Number(formData.setLost),
    };

    try {
      const response = await fetch("/api/standings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(standingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create standing");
      }

      const result = await response.json();

      if (result.success) {
        alert("Standing created successfully");
        router.push("/AdminDashboard/standings");
      } else {
        alert(`Failed to create standing: ${result.message}`);
      }
    } catch (error) {
      console.error("Error creating standing:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-t-4 border-b-4 border-queens-green animate-spin"></div>
          <div
            className="absolute top-0 left-0 h-20 w-20 rounded-full border-t-4 border-b-4 border-queens-green animate-spin opacity-40"
            style={{ animationDuration: "1.5s" }}
          ></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-700">Error</h3>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
        Add Team Standing
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h2 className="text-lg font-medium mb-4 text-gray-700">
            Team Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">
                Team
              </label>
              <div className="relative">
                <select
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  required
                  className="appearance-none mt-1 p-3 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-queens-green focus:border-queens-green transition pl-4 pr-10"
                >
                  <option value="">Select a team</option>
                  {teams.length === 0 ? (
                    <option disabled>No available teams for this season</option>
                  ) : (
                    teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name}
                      </option>
                    ))
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">
                Season
              </label>
              <div className="relative">
                <select
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  required
                  className="appearance-none mt-1 p-3 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-queens-green focus:border-queens-green transition pl-4 pr-10"
                >
                  <option value="">Select a season</option>
                  {seasons.map((season) => (
                    <option key={season._id} value={season._id}>
                      {season.name} - {season.year}{" "}
                      {season.isActive ? "(Active)" : ""}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h2 className="text-lg font-medium mb-4 text-gray-700">
            Performance Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Played
              </label>
              <input
                type="number"
                name="played"
                value={formData.played}
                onChange={handleChange}
                min="0"
                className="mt-1 p-3 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-queens-green focus:border-queens-green transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Won
              </label>
              <input
                type="number"
                name="won"
                value={formData.won}
                onChange={handleChange}
                min="0"
                className="mt-1 p-3 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-queens-green focus:border-queens-green transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Drawn
              </label>
              <input
                type="number"
                name="drawn"
                value={formData.drawn}
                onChange={handleChange}
                min="0"
                className="mt-1 p-3 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-queens-green focus:border-queens-green transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lost
              </label>
              <input
                type="number"
                name="lost"
                value={formData.lost}
                onChange={handleChange}
                min="0"
                className="mt-1 p-3 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-queens-green focus:border-queens-green transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points
              </label>
              <input
                type="number"
                name="points"
                value={formData.points}
                onChange={handleChange}
                min="0"
                className="mt-1 p-3 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-queens-green focus:border-queens-green transition"
              />
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Set Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Set Won
                </label>
                <input
                  type="number"
                  name="setWon"
                  value={formData.setWon}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 p-3 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-queens-green focus:border-queens-green transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Set Lost
                </label>
                <input
                  type="number"
                  name="setLost"
                  value={formData.setLost}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 p-3 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-queens-green focus:border-queens-green transition"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.push("/AdminDashboard/standings")}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-queens-green text-black font-semibold rounded-lg shadow-lg
              hover:bg-green-700 hover:translate-y-[-2px] active:translate-y-[1px]
              transform transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-queens-green
              flex items-center justify-center gap-2 relative overflow-hidden
              border-2 border-green-600"
          >
            <span className="absolute inset-0 bg-green-600 opacity-20"></span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Create Standing</span>
          </button>
        </div>
      </form>
    </div>
  );
}

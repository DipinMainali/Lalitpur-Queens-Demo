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
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-queens-green mx-auto"></div>
        <p className="mt-2">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div>
        <label className="block text-sm font-semibold mb-2">Team</label>
        <select
          name="team"
          value={formData.team}
          onChange={handleChange}
          required
          className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-queens-green focus:border-queens-green transition"
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
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Season</label>
        <select
          name="season"
          value={formData.season}
          onChange={handleChange}
          required
          className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-queens-green focus:border-queens-green transition"
        >
          <option value="">Select a season</option>
          {seasons.map((season) => (
            <option key={season._id} value={season._id}>
              {season.name} - {season.year} {season.isActive ? "(Active)" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Played</label>
          <input
            type="number"
            name="played"
            value={formData.played}
            onChange={handleChange}
            min="0"
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-queens-green focus:border-queens-green transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Won</label>
          <input
            type="number"
            name="won"
            value={formData.won}
            onChange={handleChange}
            min="0"
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-queens-green focus:border-queens-green transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Drawn</label>
          <input
            type="number"
            name="drawn"
            value={formData.drawn}
            onChange={handleChange}
            min="0"
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-queens-green focus:border-queens-green transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Lost</label>
          <input
            type="number"
            name="lost"
            value={formData.lost}
            onChange={handleChange}
            min="0"
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-queens-green focus:border-queens-green transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Points</label>
          <input
            type="number"
            name="points"
            value={formData.points}
            onChange={handleChange}
            min="0"
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-queens-green focus:border-queens-green transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Set Won</label>
          <input
            type="number"
            name="setWon"
            value={formData.setWon}
            onChange={handleChange}
            min="0"
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-queens-green focus:border-queens-green transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Set Lost</label>
          <input
            type="number"
            name="setLost"
            value={formData.setLost}
            onChange={handleChange}
            min="0"
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-queens-green focus:border-queens-green transition"
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-queens-green text-white py-2 px-6 rounded-md hover:bg-queens-midnight transition duration-300"
        >
          Create Standing
        </button>
        <button
          type="button"
          onClick={() => router.push("/AdminDashboard/standings")}
          className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400 transition duration-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

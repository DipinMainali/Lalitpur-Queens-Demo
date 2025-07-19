"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StandingForm({ standing }) {
  const [formData, setFormData] = useState({
    team: standing?.team.name || "",
    logo: standing?.team.logo || "",
    played: standing?.played || 0,
    won: standing?.won || 0,
    drawn: standing?.drawn || 0,
    lost: standing?.lost || 0,
    points: standing?.points || 0,
    setWon: standing?.setWon || 0,
    setLost: standing?.setLost || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (standing) {
      setFormData({
        team: standing.team.name,
        logo: standing.team.logo,
        played: standing.played,
        won: standing.won,
        drawn: standing.drawn,
        lost: standing.lost,
        points: standing.points,
        setWon: standing.setWon,
        setLost: standing.setLost,
      });
    }
  }, [standing]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For numeric fields, ensure values are non-negative
    if (name !== "team" && name !== "logo") {
      const numValue = parseInt(value) || 0;
      if (numValue < 0) return;

      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const updateData = {
      played: Number(formData.played),
      won: Number(formData.won),
      drawn: Number(formData.drawn),
      lost: Number(formData.lost),
      points: Number(formData.points),
      setWon: Number(formData.setWon),
      setLost: Number(formData.setLost),
    };

    try {
      const res = await fetch(`/api/standings/${standing._id}`, {
        method: "PATCH",
        body: JSON.stringify(updateData),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update standing");
      }

      const jsonRes = await res.json();

      if (jsonRes.success) {
        alert("Standing updated successfully");
        router.push("/AdminDashboard/standings");
      } else {
        setError(jsonRes.message || "Failed to update standing");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error("Error updating standing:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id="standing-form" onSubmit={handleSubmit} className="p-6">
      {/* Team Info Header */}
      <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
        {formData.logo && (
          <img
            src={formData.logo}
            alt={formData.team}
            className="w-16 h-16 object-contain rounded-full bg-white border border-gray-200 p-1"
          />
        )}
        <div>
          <h3 className="text-xl font-bold text-gray-800">{formData.team}</h3>
          <p className="text-gray-500 text-sm">
            Current standings for this team
          </p>
        </div>
      </div>

      {/* Form Fields - now with higher contrast styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Match Statistics */}
        <div className="col-span-2">
          <h3 className="text-sm uppercase font-semibold text-gray-500 mb-4 border-b pb-2">
            Match Statistics
          </h3>
        </div>

        {/* Played */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Matches Played
          </label>
          <input
            type="number"
            name="played"
            value={formData.played}
            onChange={handleChange}
            min="0"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-queens-green focus:border-queens-green bg-white text-gray-900"
          />
        </div>

        {/* Won */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Matches Won
          </label>
          <input
            type="number"
            name="won"
            value={formData.won}
            onChange={handleChange}
            min="0"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-queens-green focus:border-queens-green bg-white text-gray-900"
          />
        </div>

        {/* Drawn */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Matches Drawn
          </label>
          <input
            type="number"
            name="drawn"
            value={formData.drawn}
            onChange={handleChange}
            min="0"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-queens-green focus:border-queens-green bg-white text-gray-900"
          />
        </div>

        {/* Lost */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Matches Lost
          </label>
          <input
            type="number"
            name="lost"
            value={formData.lost}
            onChange={handleChange}
            min="0"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-queens-green focus:border-queens-green bg-white text-gray-900"
          />
        </div>

        {/* Set Statistics */}
        <div className="col-span-2 mt-6">
          <h3 className="text-sm uppercase font-semibold text-gray-500 mb-4 border-b pb-2">
            Set Statistics
          </h3>
        </div>

        {/* Sets Won */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sets Won
          </label>
          <input
            type="number"
            name="setWon"
            value={formData.setWon}
            onChange={handleChange}
            min="0"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-queens-green focus:border-queens-green bg-white text-gray-900"
          />
        </div>

        {/* Sets Lost */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sets Lost
          </label>
          <input
            type="number"
            name="setLost"
            value={formData.setLost}
            onChange={handleChange}
            min="0"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-queens-green focus:border-queens-green bg-white text-gray-900"
          />
        </div>

        {/* Points */}
        <div className="col-span-2 mt-6">
          <h3 className="text-sm uppercase font-semibold text-gray-500 mb-4 border-b pb-2">
            Points
          </h3>
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Points
          </label>
          <input
            type="number"
            name="points"
            value={formData.points}
            onChange={handleChange}
            min="0"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-queens-green focus:border-queens-green bg-white text-gray-900"
          />
          <p className="mt-1 text-sm text-gray-500">
            Points earned in the competition
          </p>
        </div>
      </div>

      {/* Note: The buttons are now added directly in the EditStandingPage component */}
    </form>
  );
}

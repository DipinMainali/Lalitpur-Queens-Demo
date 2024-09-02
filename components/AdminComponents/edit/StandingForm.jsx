"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function StandingForm({ standing }) {
  const [formData, setFormData] = useState({
    team: standing?.team.name || standing.team.name,
    played: standing?.played || 0,
    won: standing?.won || 0,
    drawn: standing?.drawn || 0,
    lost: standing?.lost || 0,
    points: standing?.points || 0,
    setWon: standing?.setWon || 0,
    setLost: standing?.setLost || 0,
  });

  useEffect(() => {
    if (standing) {
      setFormData({
        team: standing.team.name,
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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Team
        </label>
        <input
          type="text"
          name="team"
          value={formData.team}
          onChange={handleChange}
          readOnly
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Played
        </label>
        <input
          type="number"
          name="played"
          value={formData.played}
          onChange={handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">Won</label>
        <input
          type="number"
          name="won"
          value={formData.won}
          onChange={handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Drawn
        </label>
        <input
          type="number"
          name="drawn"
          value={formData.drawn}
          onChange={handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Lost
        </label>
        <input
          type="number"
          name="lost"
          value={formData.lost}
          onChange={handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Points
        </label>
        <input
          type="number"
          name="points"
          value={formData.points}
          onChange={handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Set Won
        </label>
        <input
          type="number"
          name="setWon"
          value={formData.setWon}
          onChange={handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Set Lost
        </label>
        <input
          type="number"
          name="setLost"
          value={formData.setLost}
          onChange={handleChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
      </div>

      <button
        type="submit"
        className="bg-queens-green text-queens-white py-2 px-4 rounded-lg hover:bg-queens-midnight transition duration-300"
      >
        Save
      </button>
    </form>
  );
}

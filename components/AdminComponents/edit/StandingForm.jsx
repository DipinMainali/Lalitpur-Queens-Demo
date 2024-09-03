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

  const Router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Ensure only positive numbers or zero are allowed
    if (name !== "team" && name !== "logo" && value < 0) {
      return;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSave = async (data) => {
    const formData = {
      played: Number(data.played),
      won: Number(data.won),
      drawn: Number(data.drawn),
      lost: Number(data.lost),
      points: Number(data.points),
      setWon: Number(data.setWon),
      setLost: Number(data.setLost),
    };

    try {
      const res = await fetch(`/api/standings/${standing._id}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      const jsonRes = await res.json();
      if (jsonRes.success) {
        alert("Standing updated successfully");
        // Clear the form
        setFormData({
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          points: 0,
          setWon: 0,
          setLost: 0,
        });
        Router.back();
      } else {
        alert("Failed to update standing");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-queens-white">
          Team
        </label>
        <input
          type="text"
          name="team"
          value={formData.team}
          onChange={handleChange}
          readOnly
          className="mt-1 p-3 w-full max-w-lg min-w-[300px] border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-queens-white">
          Played
        </label>
        <input
          type="number"
          name="played"
          value={formData.played}
          onChange={handleChange}
          min="0"
          className="mt-1 p-3 w-full max-w-lg min-w-[300px] border border-gray-300 rounded-md hover:border-queens-blue hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-queens-white">
          Won
        </label>
        <input
          type="number"
          name="won"
          value={formData.won}
          onChange={handleChange}
          min="0"
          className="mt-1 p-3 w-full max-w-lg min-w-[300px] border border-gray-300 rounded-md hover:border-queens-blue hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-queens-white">
          Drawn
        </label>
        <input
          type="number"
          name="drawn"
          value={formData.drawn}
          onChange={handleChange}
          min="0"
          className="mt-1 p-3 w-full max-w-lg min-w-[300px] border border-gray-300 rounded-md hover:border-queens-blue hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-queens-white">
          Lost
        </label>
        <input
          type="number"
          name="lost"
          value={formData.lost}
          onChange={handleChange}
          min="0"
          className="mt-1 p-3 w-full max-w-lg min-w-[300px] border border-gray-300 rounded-md hover:border-queens-blue hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-queens-white">
          Points
        </label>
        <input
          type="number"
          name="points"
          value={formData.points}
          onChange={handleChange}
          min="0"
          className="mt-1 p-3 w-full max-w-lg min-w-[300px] border border-gray-300 rounded-md hover:border-queens-blue hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-queens-white">
          Set Won
        </label>
        <input
          type="number"
          name="setWon"
          value={formData.setWon}
          onChange={handleChange}
          min="0"
          className="mt-1 p-3 w-full max-w-lg min-w-[300px] border border-gray-300 rounded-md hover:border-queens-blue hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-queens-white">
          Set Lost
        </label>
        <input
          type="number"
          name="setLost"
          value={formData.setLost}
          onChange={handleChange}
          min="0"
          className="mt-1 p-3 w-full max-w-lg min-w-[300px] border border-gray-300 rounded-md hover:border-queens-blue hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
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

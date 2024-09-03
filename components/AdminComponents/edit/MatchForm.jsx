"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MatchForm({ match }) {
  const [opponents, setOpponents] = useState([]);
  const [formData, setFormData] = useState({
    opponentId: match?.opponent._id || "",
    venue: match?.venue || "Dasarath Stadium",
    date: match?.date ? new Date(match.date).toISOString().split("T")[0] : "",
    time: match?.time || "",
    status: match?.status || "",
    result: match?.result || "",
  });

  const Router = useRouter();

  useEffect(() => {
    const fetchOpponents = async () => {
      try {
        const res = await fetch("/api/teams");
        const jsonRes = await res.json();
        if (jsonRes.success) {
          setOpponents(jsonRes.data);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchOpponents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "status" && value === "Pending") {
      setFormData({
        ...formData,
        result: "",
        [name]: value,
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSave = async (data) => {
    const opponent = opponents.find((team) => team._id === data.opponentId);
    if (!opponent) {
      alert("Please select a valid opponent");
      return;
    }

    const updatedMatchData = {
      opponent,
      venue: data.venue,
      date: new Date(data.date).toISOString(),
      time: data.time,
      status: data.status,
      result: data.status === "Completed" ? data.result : "",
    };

    try {
      const res = await fetch(`/api/matches/${match._id}`, {
        method: "PATCH",
        body: JSON.stringify(updatedMatchData),
      });
      const jsonRes = await res.json();
      if (jsonRes.success) {
        alert("Match updated successfully");
        Router.back();
      } else {
        alert("Failed to update match");
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
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-queens-white rounded-lg shadow-md space-y-6"
    >
      <div>
        <label
          htmlFor="opponent"
          className="block text-queens-black font-semibold mb-2"
        >
          Opponent
        </label>
        <select
          id="opponent"
          name="opponentId"
          value={formData.opponentId}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          required
        >
          <option value="">Select Opponent</option>
          {opponents.map((team) => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="venue"
          className="block text-queens-black font-semibold mb-2"
        >
          Venue
        </label>
        <input
          type="text"
          id="venue"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
        />
      </div>

      <div>
        <label
          htmlFor="date"
          className="block text-queens-black font-semibold mb-2"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          required
        />
      </div>

      <div>
        <label
          htmlFor="time"
          className="block text-queens-black font-semibold mb-2"
        >
          Time
        </label>
        <input
          type="time"
          id="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          required
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-queens-black font-semibold mb-2"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          required
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {formData.status === "Completed" && (
        <div>
          <label
            htmlFor="result"
            className="block text-queens-black font-semibold mb-2"
          >
            Result
          </label>
          <select
            id="result"
            name="result"
            value={formData.result}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-queens-black rounded-lg"
            required
          >
            <option value="Win">Win</option>
            <option value="Loss">Loss</option>
            <option value="Draw">Draw</option>
          </select>
        </div>
      )}

      <button
        type="submit"
        className="bg-queens-emerald text-queens-white py-2 px-4 rounded-lg hover:bg-queens-green transition duration-300"
      >
        Save
      </button>
    </form>
  );
}

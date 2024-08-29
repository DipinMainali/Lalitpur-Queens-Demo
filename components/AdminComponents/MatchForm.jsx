// app/admin/matches/form.js
"use client";
import { useState } from "react";

export default function MatchForm() {
  const [opponent, setOpponent] = useState("");
  const [venue, setVenue] = useState("Dasarath Stadium");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const matchData = {
      opponent,
      venue,
      date,
      time,
      status,
      result,
    };

    console.log("Form Data:", matchData);

    // TODO: Add code to send the form data to your backend
    // e.g., await fetch('/api/matches', { method: 'POST', body: JSON.stringify(matchData), headers: { 'Content-Type': 'application/json' } });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-queens-white rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label
          htmlFor="opponent"
          className="block text-queens-black font-semibold mb-2"
        >
          Opponent
        </label>
        <input
          type="text"
          id="opponent"
          value={opponent}
          onChange={(e) => setOpponent(e.target.value)}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="venue"
          className="block text-queens-black font-semibold mb-2"
        >
          Venue
        </label>
        <input
          type="text"
          id="venue"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="date"
          className="block text-queens-black font-semibold mb-2"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="time"
          className="block text-queens-black font-semibold mb-2"
        >
          Time
        </label>
        <input
          type="time"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="result"
          className="block text-queens-black font-semibold mb-2"
        >
          Result
        </label>
        <select
          id="result"
          value={result}
          onChange={(e) => setResult(e.target.value)}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          required
        >
          <option value="">Select Result</option>
          <option value="Win">Win</option>
          <option value="Loss">Loss</option>
          <option value="Draw">Draw</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-queens-emerald text-queens-white py-2 px-4 rounded-lg hover:bg-queens-green transition duration-300"
      >
        Submit
      </button>
    </form>
  );
}

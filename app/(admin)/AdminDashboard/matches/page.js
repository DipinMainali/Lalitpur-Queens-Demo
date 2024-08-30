"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function Matches() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("/api/matches");
        const jsonRes = await res.json();
        if (jsonRes.success) {
          setMatches(jsonRes.data);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMatches();
  }, []);

  const handleEdit = (id) => {
    console.log(`Edit match with id: ${id}`);
  };

  const handleDelete = async (id) => {
    console.log(`Delete match with id: ${id}`);
    try {
      const res = await fetch(`/api/matches/${id}`, {
        method: "DELETE",
      });
      const jsonRes = await res.json();
      if (jsonRes.success) {
        alert("Match deleted successfully");
        setMatches(matches.filter((match) => match._id !== id));
      } else {
        alert("Failed to delete match");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-queens-white text-center">
        Matches
      </h1>
      <div className="flex justify-end mb-4">
        <Link
          href="/AdminDashboard/matches/add/"
          className="bg-queens-green text-queens-white py-2 px-4 rounded-lg hover:bg-queens-midnight transition duration-300 flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add New
        </Link>
      </div>

      <div className="overflow-x-auto bg-queens-white p-6 rounded-lg shadow-lg">
        <table className="min-w-full bg-queens-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Opponent
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Venue
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Date
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Time
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Status
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Result
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {matches &&
              matches.map((match) => (
                <tr key={match._id}>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    {match.opponent.name}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    {match.venue}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    {new Date(match.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    {match.time}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    {match.status}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    {match.result}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    <button
                      onClick={() => handleEdit(match._id)}
                      className="text-queens-green hover:text-queens-midnight transition duration-300 mr-4"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(match._id)}
                      className="text-queens-green hover:text-queens-midnight transition duration-300"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

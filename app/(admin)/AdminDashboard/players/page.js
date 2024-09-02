"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function Players() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch("/api/players");
        const jsonres = await res.json();
        if (jsonres.success) {
          setPlayers(jsonres.data);
        } else {
          console.error(jsonres.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPlayers();
  }, []);

  const handleEdit = (jerseyNumber) => {
    console.log(`Edit player with jersey number: ${jerseyNumber}`);
  };

  const handleDelete = async (id) => {
    console.log(`Delete player with id: ${id}`);
    try {
      const res = await fetch(`/api/players/${id}`, {
        method: "DELETE",
      });
      const jsonRes = await res.json();
      if (jsonRes.success) {
        alert("Player deleted successfully");
        setPlayers(players.filter((player) => player._id !== id));
      } else {
        alert("Failed to delete player");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-queens-white text-center">
        Players
      </h1>
      <div className="flex justify-end mb-4">
        <button className="bg-queens-green text-queens-white py-2 px-4 rounded-lg hover:bg-queens-midnight transition duration-300 flex items-center">
          <Link href="/AdminDashboard/players/add">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add New
          </Link>
        </button>
      </div>

      <div className="overflow-x-auto bg-queens-white p-6 rounded-lg shadow-lg">
        <table className="min-w-full bg-queens-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Jersey Number
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Name
              </th>

              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Featured
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {players &&
              players.map((player) => (
                <tr key={player.jerseyNumber}>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    {player.jerseyNumber}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    {player.firstName} {player.lastName}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    {player.featured ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    <button
                      onClick={() => handleEdit(player.jerseyNumber)}
                      className="text-queens-green hover:text-queens-midnight transition duration-300 mr-4"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(player._id)}
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

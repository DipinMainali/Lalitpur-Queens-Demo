"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Standings() {
  const [standings, setStandings] = useState([]);
  const [teams, setTeams] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("/api/teams");
        const jsonRes = await res.json();
        if (jsonRes.success) {
          setTeams(jsonRes.data);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const res = await fetch("/api/standings");
        const jsonRes = await res.json();
        if (jsonRes.success) {
          setStandings(jsonRes.data);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchStandings();
  }, []);

  const handleEdit = (id) => {
    router.push(`/AdminDashboard/standings/edit/${id}`);
  };
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-queens-white text-center">
        Standings Management
      </h1>

      <div className="overflow-x-auto bg-queens-white p-6 rounded-lg shadow-lg">
        <table className="min-w-full bg-queens-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Team
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Played
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Won
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Drawn
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Lost
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Points
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Set Won
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Set Lost
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {standings &&
              standings.map((standing) => (
                <tr key={standing._id}>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    {standing.team.name}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-center text-queens-black">
                    {standing.played}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-center text-queens-black">
                    {standing.won}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-center text-queens-black">
                    {standing.drawn}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-center text-queens-black">
                    {standing.lost}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-center text-queens-black">
                    {standing.points}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-center text-queens-black">
                    {standing.setWon}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-center text-queens-black">
                    {standing.setLost}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-center text-queens-black">
                    <button
                      onClick={() => handleEdit(standing._id)}
                      className="text-brand-secondary hover:text-text-primary transition duration-300 mr-4"
                    >
                      <FontAwesomeIcon icon={faEdit} />
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

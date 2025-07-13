"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Teams() {
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
  }, [teams]);

  const handleDelete = async (id) => {
    console.log(`Delete team with id: ${id}`);
    try {
      const res = await fetch(`/api/teams/${id}`, {
        method: "DELETE",
      });
      const jsonRes = await res.json();
      if (jsonRes.success) {
        alert("Team deleted successfully");
        setTeams(teams.filter((team) => team._id !== id));
      } else {
        alert("Failed to delete team");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-queens-white text-center">
        Teams
      </h1>
      <div className="flex justify-end mb-4">
        <button className="bg-queens-green text-queens-white py-2 px-4 rounded-lg hover:bg-queens-midnight transition duration-300 flex items-center">
          <Link href="/AdminDashboard/teams/add">
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
                Name
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Logo
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {teams &&
              teams.map((team) => (
                <tr key={team._id}>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    {team.name}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    <img
                      src={team.logo}
                      alt={`${team.name} logo`}
                      className="h-10 w-10 object-contain"
                    />
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    <button
                      onClick={() => handleDelete(team._id)}
                      className="text-brand-secondary hover:text-text-primary transition duration-300"
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

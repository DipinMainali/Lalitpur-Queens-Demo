"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await fetch("/api/sponsors");
        const jsonRes = await res.json();
        if (jsonRes.success) {
          setSponsors(jsonRes.data);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchSponsors();
  }, []);

  const handleEdit = (id) => {
    console.log(`Edit sponsor with id: ${id}`);
  };

  const handleDelete = async (id) => {
    console.log(`Delete player with id: ${id}`);
    try {
      const res = await fetch(`/api/sponsors/${id}`, {
        method: "DELETE",
      });
      const jsonRes = await res.json();
      if (jsonRes.success) {
        alert("Player deleted successfully");
        setSponsors(sponsors.filter((sponsor) => sponsor._id !== id));
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
        Sponsors
      </h1>
      <div className="flex justify-end mb-4">
        <Link
          href="/AdminDashboard/sponsors/add"
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
                Name
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Logo
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Website
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Tier
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sponsors &&
              sponsors.map((sponsor) => (
                <tr key={sponsor._id}>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    {sponsor.name}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    <img
                      src={sponsor.logo}
                      alt={`${sponsor.name} logo`}
                      className="h-10"
                    />
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-queens-blue underline"
                    >
                      {sponsor.website}
                    </a>
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    {sponsor.tier}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    <button
                      onClick={() => handleEdit(sponsor._id)}
                      className="text-queens-green hover:text-queens-midnight transition duration-300 mr-4"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(sponsor._id)}
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

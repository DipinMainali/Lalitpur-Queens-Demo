"use client";
import Head from "next/head";
import TeamMember from "@/components/TeamMember";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Team() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch all seasons
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const res = await fetch("/api/seasons");
        const jsonRes = await res.json();
        if (jsonRes.success) {
          setSeasons(jsonRes.data);

          // Set active season as default, or first season if none active
          const activeSeason = jsonRes.data.find((season) => season.isActive);
          if (activeSeason) {
            setSelectedSeason(activeSeason._id);
          } else if (jsonRes.data.length > 0) {
            setSelectedSeason(jsonRes.data[0]._id);
          }
        } else {
          console.error("Failed to fetch seasons:", jsonRes.message);
        }
      } catch (err) {
        console.error("Error fetching seasons:", err);
      }
    };

    fetchSeasons();
  }, []);

  // Fetch team members whenever selected season changes
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);

        // If no season selected yet, wait for season selection
        if (!selectedSeason && seasons.length > 0) return;

        const url = selectedSeason
          ? `/api/players?seasonId=${selectedSeason}`
          : "/api/players";

        const res = await fetch(url);
        const jsonRes = await res.json();

        if (jsonRes.success) {
          setTeamMembers(jsonRes.data);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [selectedSeason, seasons]);

  // Helper to get current season name
  const getCurrentSeasonName = () => {
    if (!selectedSeason) return "Select Season";
    const season = seasons.find((s) => s._id === selectedSeason);
    return season
      ? `${season.name} ${season.year}${season.isActive ? " (Active)" : ""}`
      : "Select Season";
  };

  return (
    <div>
      <Head>
        <title>Lalitpur Queens Team</title>
        <meta
          name="description"
          content="Meet the Lalitpur Queens volleyball team"
        />
      </Head>

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Team</h1>

        {/* Season Selector */}
        {seasons && seasons.length > 0 && (
          <div className="flex justify-center mb-10">
            <div className="relative inline-block text-left w-64">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex justify-between w-full px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-md hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              >
                <span>{getCurrentSeasonName()}</span>
                <svg
                  className="w-5 h-5 ml-2 -mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 w-full mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    {seasons.map((season) => (
                      <button
                        key={season._id}
                        onClick={() => {
                          setSelectedSeason(season._id);
                          setDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          selectedSeason === season._id
                            ? "bg-brand-primary text-white"
                            : "text-text-primary hover:bg-gray-100"
                        }`}
                      >
                        {season.name} {season.year}
                        {season.isActive && " (Active)"}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
          </div>
        ) : teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member._id}
                onClick={() => {
                  router.push(`/Team/${member._id}`);
                }}
                className="cursor-pointer transform transition-transform hover:scale-105"
              >
                <TeamMember
                  firstName={member.firstName}
                  lastName={member.lastName}
                  jerseyNumber={member.jerseyNumber}
                  position={member.position}
                  image={member.image}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            <p className="text-text-secondary text-lg">
              No team members found for {getCurrentSeasonName()}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

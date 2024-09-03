"use client";
import Head from "next/head";
import TeamMember from "@/components/TeamMember";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Team() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const res = await fetch("/api/players");
        const jsonRes = await res.json();
        if (jsonRes.success) {
          setTeamMembers(jsonRes.data);
          setLoading(false);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              onClick={() => {
                router.push(`/Team/${member._id}`);
              }}
              className="cursor-pointer"
            >
              <TeamMember
                key={member._id} // Assuming each player object has a unique _id
                firstName={member.firstName}
                lastName={member.lastName}
                jerseyNumber={member.jerseyNumber}
                position={member.position}
                image={member.image}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

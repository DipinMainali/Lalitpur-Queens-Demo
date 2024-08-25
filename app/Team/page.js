// pages/team.js
import { getPlayers } from "@/actions/player.action"; // Import getPlayers function
import Head from "next/head";
import TeamMember from "@/components/TeamMember";

export default async function Team() {
  // const teamMembers = [
  //   {
  //     name: "Asha Gurung",
  //     position: "Captain / Outside Hitter",
  //     image: "/images/member-1.jpg",
  //   },
  //   { name: "Priya Tamang", position: "Setter", image: "/images/member-2.jpg" },
  //   {
  //     name: "Sita Rai",
  //     position: "Middle Blocker",
  //     image: "/images/member-3.jpg",
  //   },
  //   {
  //     name: "Nisha Sherpa",
  //     position: "Opposite Hitter",
  //     image: "/images/member-4.jpg",
  //   },
  //   { name: "Maya Thapa", position: "Libero", image: "/images/member-4.jpg" },
  //   {
  //     name: "Anjali Chand",
  //     position: "Outside Hitter",
  //     image: "/images/member-3.jpg",
  //   },
  // ];

  const teamMembers = await getPlayers(); // Call getPlayers function to fetch players

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
            <TeamMember
              key={member._id} // Assuming each player object has a unique _id
              firstName={member.firstName}
              lastName={member.lastName}
              position={member.position}
              image="/images/member-1.jpg"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

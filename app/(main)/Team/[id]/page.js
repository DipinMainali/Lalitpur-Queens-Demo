"use client";
import react from "react";
import Head from "next/head";
import { useState, useEffect } from "react";

export default function PlayerDetails({ params }) {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await fetch("/api/players/" + params.id);
        const jsonRes = await res.json();
        if (jsonRes.success) {
          setPlayer(jsonRes.data);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>
          {player.firstName} {player.lastName} - Lalitpur Queens
        </title>
        <meta name="description" content={player.position} />
      </Head>
      <div className="flex justify-center items-center space-x-4">
        <img
          src={player.image}
          alt={player.firstName + " " + player.lastName}
          className="w-48 h-48 object-cover rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold text-queens-white">
            {player.firstName} {player.lastName}
          </h1>
          <p className="text-lg text-queens-white">{player.position}</p>
        </div>
        <div dangerouslySetInnerHTML={{ __html: player.bio }} />
      </div>
    </div>
  );
}

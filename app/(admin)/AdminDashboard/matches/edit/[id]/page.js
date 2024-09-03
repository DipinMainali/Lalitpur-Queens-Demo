"use client";
import { useState, useEffect } from "react";
import MatchForm from "@/components/AdminComponents/edit/MatchForm";
import { useRouter } from "next/navigation";

export default function MatchEditPage({ params }) {
  const router = useRouter();
  const { id } = params;

  const [match, setMatch] = useState();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(`/api/matches/${id}`);
        console.log(res);
        const jsonRes = await res.json();
        console.log(jsonRes.data);
        if (jsonRes.success) {
          setMatch(jsonRes.data);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMatches();
  }, [id]);

  if (!match) {
    return <p>Loading...</p>; // Optional: Display a loading state while fetching
  } else {
    return (
      <div className="p-8 flex items-center justify-center">
        <MatchForm match={match} />
      </div>
    );
  }
}

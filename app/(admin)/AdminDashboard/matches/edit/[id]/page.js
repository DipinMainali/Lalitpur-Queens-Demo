"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import MatchForm from "@/components/AdminComponents/MatchForm";

export default function EditMatch() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await fetch(`/api/matches/${id}`);
        const data = await res.json();

        if (data.success) {
          setMatch(data.data);
        } else {
          setError(data.message || "Failed to fetch match details");
        }
      } catch (err) {
        setError("An error occurred while fetching match details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMatch();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-text-primary mb-6">
          Edit Match
        </h1>
        <div className="text-center py-10">Loading match details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-text-primary mb-6">
          Edit Match
        </h1>
        <div className="text-center py-10 text-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Edit Match</h1>
      <MatchForm initialData={match} />
    </div>
  );
}

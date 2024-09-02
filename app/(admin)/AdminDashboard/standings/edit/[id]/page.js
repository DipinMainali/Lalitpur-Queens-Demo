"use client";
import { useState, useEffect } from "react";
import StandingForm from "@/components/AdminComponents/edit/StandingForm";
import { useRouter } from "next/navigation";

export default function StandingEditPage({ params }) {
  const router = useRouter();
  const { id } = params;

  const [standing, setStanding] = useState();

  useEffect(() => {
    const fetchStanding = async () => {
      try {
        const res = await fetch(`/api/standings/${id}`);
        console.log(res);
        const jsonRes = await res.json();
        console.log(jsonRes.data);
        if (jsonRes.success) {
          setStanding(jsonRes.data);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchStanding();
  }, [id]);
  console.log(standing);

  if (!standing) {
    return <p>Loading...</p>; // Optional: Display a loading state while fetching
  } else {
    console.log(standing);
    return (
      <div className="p-8 flex items-center justify-center">
        <StandingForm standing={standing} />
      </div>
    );
  }
}

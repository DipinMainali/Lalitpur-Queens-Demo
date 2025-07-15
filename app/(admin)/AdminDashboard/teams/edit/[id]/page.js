"use client";
import TeamEditForm from "@/components/AdminComponents/TeamEditForm";
import { useParams } from "next/navigation";

export default function EditTeamPage() {
  const params = useParams();
  const teamId = params.id;

  return (
    <div className="p-6">
      <TeamEditForm teamId={teamId} />
    </div>
  );
}

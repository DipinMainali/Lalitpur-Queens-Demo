"use client";
import MatchForm from "@/components/AdminComponents/MatchForm";

export default function AddMatch() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6">
        Add New Match
      </h1>
      <MatchForm />
    </div>
  );
}

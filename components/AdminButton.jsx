"use client";
import React from "react";
import myadmin from "@/createAdmin";

export default function AdminButton() {
  const addAdmin = async () => {
    await myadmin();
  };

  return (
    <button type="button" onClick={addAdmin}>
      add admin
    </button>
  );
}

"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function TeamForm() {
  const [team, setTeam] = useState({
    name: "",
    logo: null,
  });

  const router = useRouter();

  const fileInputRef = useRef(null); // Ref for file input

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeam((prevTeam) => ({ ...prevTeam, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setTeam((prevTeam) => ({ ...prevTeam, logo: file }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", team.name);
    formData.append("logo", team.logo);

    console.log("Form Data:", { name: team.name, logo: team.logo });
    const res = await fetch("/api/teams", {
      method: "POST",
      body: formData,
    });
    // Check if the response is ok (status in the range 200-299)
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    // Parse JSON safely
    const jsonRes = await res.json();
    if (jsonRes.success) {
      alert(jsonRes.message);

      // Clear the form
      setTeam({
        name: "",
        logo: null,
      });
      fileInputRef.current.value = ""; // Clear the file input field

      // Redirect to the teams page
      router.back();
    } else {
      alert("Failed to save team: ", jsonRes.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-queens-white rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-queens-black font-semibold mb-2"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name" // Ensure the input name matches the state key
          value={team.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="logo"
          className="block text-queens-black font-semibold mb-2"
        >
          Logo
        </label>
        <input
          type="file"
          id="logo"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-queens-emerald text-queens-white py-2 px-4 rounded-lg hover:bg-queens-green transition duration-300"
      >
        Submit
      </button>
    </form>
  );
}

"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faSave } from "@fortawesome/free-solid-svg-icons";

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

    // Validation
    if (!team.name || !team.name.trim()) {
      alert("Please enter a team name");
      return;
    }

    if (!team.logo) {
      alert("Please select a logo image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", team.name.trim());
      formData.append("logo", team.logo);

      console.log("Form Data:", { name: team.name, logo: team.logo?.name });

      const res = await fetch("/api/teams", {
        method: "POST",
        body: formData,
      });

      // Parse JSON response
      const jsonRes = await res.json();

      // Check API response status
      if (jsonRes.success) {
        alert(jsonRes.message || "Team created successfully");

        // Clear the form
        setTeam({
          name: "",
          logo: null,
        });
        fileInputRef.current.value = ""; // Clear the file input field

        // Redirect to the teams page
        router.back();
      } else {
        // Handle API error response
        alert(jsonRes.message || "Failed to save team");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error: ${error.message || "Failed to save team"}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg border border-background"
    >
      <h2 className="text-2xl font-bold text-text-primary mb-6 pb-2 border-b border-background">
        Add New Team
      </h2>

      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-text-primary font-medium mb-2"
        >
          Team Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={team.name}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-background rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-300"
          required
          placeholder="Enter team name"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="logo"
          className="block text-text-primary font-medium mb-2"
        >
          Team Logo
        </label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="logo"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-background rounded-lg cursor-pointer bg-background/5 hover:bg-background/10 transition-all duration-300"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FontAwesomeIcon
                icon={faUpload}
                className="text-brand-secondary mb-2 text-xl"
              />
              <p className="mb-2 text-sm text-text-primary">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-text-secondary">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input
              type="file"
              id="logo"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              required
            />
          </label>
        </div>
        {team.logo && (
          <div className="mt-3 text-sm text-text-secondary">
            Selected file: {team.logo.name}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-background text-text-primary py-3 px-6 rounded-lg hover:bg-gray-200 transition duration-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-brand-secondary text-white py-3 px-6 rounded-lg hover:bg-brand-primary transition duration-300 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faSave} />
          Save Team
        </button>
      </div>
    </form>
  );
}

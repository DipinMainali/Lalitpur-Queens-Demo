"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function TeamForm() {
  const [team, setTeam] = useState({
    name: "",
    logo: null,
    season: "", // Added season field
  });
  const [seasons, setSeasons] = useState([]); // Added seasons state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSeasons, setIsLoadingSeasons] = useState(true); // Loading state for seasons
  const [error, setError] = useState(""); // Added error state

  const router = useRouter();

  const fileInputRef = useRef(null); // Ref for file input

  // Fetch available seasons when component mounts
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const res = await fetch("/api/seasons");
        const jsonRes = await res.json();

        if (jsonRes.success) {
          setSeasons(jsonRes.data);
          // If there's an active season, select it by default
          const activeSeason = jsonRes.data.find((season) => season.isActive);
          if (activeSeason) {
            setTeam((prev) => ({ ...prev, season: activeSeason._id }));
          }
        } else {
          setError("Failed to load seasons");
        }
      } catch (err) {
        console.error("Error loading seasons:", err);
        setError("Error loading seasons");
      } finally {
        setIsLoadingSeasons(false);
      }
    };

    fetchSeasons();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeam((prevTeam) => ({ ...prevTeam, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setTeam((prevTeam) => ({ ...prevTeam, logo: file }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Validation
    if (!team.name || !team.name.trim()) {
      setError("Please enter a team name");
      return;
    }

    if (!team.logo) {
      setError("Please select a logo image");
      return;
    }

    if (!team.season) {
      setError("Please select a season");
      return;
    }

    // Prevent multiple form submissions
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", team.name.trim());
      formData.append("logo", team.logo);
      formData.append("season", team.season);

      const res = await fetch("/api/teams", {
        method: "POST",
        body: formData,
      });

      // Check for network errors
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Server responded with status ${res.status}: ${errorText}`
        );
      }

      // Parse JSON response
      const jsonRes = await res.json();

      // Check API response status
      if (jsonRes.success) {
        alert(jsonRes.message || "Team created successfully");

        // Clear the form
        setTeam({
          name: "",
          logo: null,
          season: "",
        });
        fileInputRef.current.value = ""; // Clear the file input field

        // Redirect to the teams page
        router.back();
      } else {
        // Handle API error response
        throw new Error(jsonRes.message || "Failed to save team");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.message || "Failed to save team");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingSeasons) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="animate-spin text-3xl text-brand-secondary mb-4"
          />
          <p className="text-text-secondary">Loading seasons data...</p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg border border-background"
    >
      <h2 className="text-2xl font-bold text-text-primary mb-6 pb-2 border-b border-background">
        Add New Team
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

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
          placeholder="Enter team name"
        />
      </div>

      {/* Season Selection */}
      <div className="mb-4">
        <label
          htmlFor="season"
          className="block text-text-primary font-medium mb-2"
        >
          Season
        </label>
        <select
          id="season"
          name="season"
          value={team.season}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-background rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-300"
        >
          <option value="">Select a season</option>
          {seasons.map((season) => (
            <option key={season._id} value={season._id}>
              {season.name} {season.year} {season.isActive ? "(Active)" : ""}
            </option>
          ))}
        </select>
        {seasons.length === 0 && (
          <p className="text-sm text-red-500 mt-1">
            No seasons available. Please create a season first.
          </p>
        )}
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
              name="logo"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
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
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-brand-secondary text-white py-3 px-6 rounded-lg hover:bg-brand-primary transition duration-300 flex items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faSave} />
              Save Team
            </>
          )}
        </button>
      </div>
    </form>
  );
}

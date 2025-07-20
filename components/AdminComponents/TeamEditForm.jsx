"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function TeamEditForm({ teamId }) {
  const [team, setTeam] = useState({
    name: "",
    logo: null,
    currentLogoUrl: "",
    season: "",
  });
  const [seasons, setSeasons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const fileInputRef = useRef(null);

  // Fetch team data and seasons when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch seasons first
        const seasonsRes = await fetch("/api/seasons");
        const seasonsJsonRes = await seasonsRes.json();

        if (!seasonsJsonRes.success) {
          throw new Error("Failed to load seasons data");
        }

        setSeasons(seasonsJsonRes.data);

        // Then fetch team data
        const teamRes = await fetch(`/api/teams/${teamId}`);
        const teamJsonRes = await teamRes.json();

        if (teamJsonRes.success) {
          setTeam({
            name: teamJsonRes.data.name || "",
            logo: null,
            currentLogoUrl: teamJsonRes.data.logo || "",
            season:
              teamJsonRes.data.season?._id || teamJsonRes.data.season || "",
          });
        } else {
          setError("Failed to load team data");
          console.error("Failed to load team data:", teamJsonRes.message);
        }
      } catch (err) {
        setError("Error loading data: " + err.message);
        console.error("Error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (teamId) {
      fetchData();
    }
  }, [teamId]);

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

    if (!team.season) {
      setError("Please select a season");
      return;
    }

    // Prevent multiple submissions
    if (isSaving) return;

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", team.name.trim());
      formData.append("season", team.season);

      if (team.logo) {
        formData.append("logo", team.logo);
      }

      const res = await fetch(`/api/teams/${teamId}`, {
        method: "PATCH",
        body: formData,
      });

      // Check for network errors
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Server responded with status ${res.status}: ${errorText}`
        );
      }

      const jsonRes = await res.json();

      if (jsonRes.success) {
        router.back();
        router.refresh(); // Refresh the page data
      } else {
        setError(jsonRes.message || "Failed to update team");
      }
    } catch (err) {
      console.error("Error updating team:", err);
      setError("An error occurred while updating the team: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="animate-spin text-3xl text-brand-secondary mb-4"
          />
          <p className="text-text-secondary">Loading team data...</p>
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
        Edit Team
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

        {team.currentLogoUrl && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md flex items-center">
            <div className="w-16 h-16 mr-4 flex items-center justify-center bg-white rounded-md border border-gray-200">
              <img
                src={team.currentLogoUrl}
                alt="Current logo"
                className="max-h-14 max-w-14 object-contain"
              />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Current logo</p>
              <p className="text-xs text-text-secondary/70 mt-1">
                Upload a new file to replace it
              </p>
            </div>
          </div>
        )}

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
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="bg-brand-secondary text-white py-3 px-6 rounded-lg hover:bg-brand-primary transition duration-300 flex items-center gap-2"
        >
          {isSaving ? (
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

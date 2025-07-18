// app/admin/players/form.js

"use client";
import { useState, useRef, useEffect } from "react";
import RichTextEditor from "../RichTextEditor";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faSave, faUser } from "@fortawesome/free-solid-svg-icons";

export default function PlayerForm() {
  const fileInputRef = useRef(null);
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const route = useRouter();

  const [player, setPlayer] = useState({
    firstName: "",
    lastName: "",
    DOB: "",
    height: "",
    position: "",
    jerseyNumber: "",
    nationality: "",
    image: null,
    bio: "",
    featured: false,
  });

  const [currentImagePath, setCurrentImagePath] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPlayer = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/players/${id}`);
        const jsonRes = await res.json();
        if (jsonRes.success) {
          const fetchedPlayer = jsonRes.data;

          // Set the state for the player
          setPlayer((prevPlayer) => ({
            ...prevPlayer,
            ...fetchedPlayer,
            DOB: fetchedPlayer.DOB ? fetchedPlayer.DOB.split("T")[0] : "",
          }));

          // Set the current image path
          setCurrentImagePath(fetchedPlayer.image);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlayer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlayer((prevPlayer) => ({ ...prevPlayer, [name]: value }));
  };

  const handleFileChange = (e) => {
    setPlayer((prevPlayer) => ({ ...prevPlayer, image: e.target.files[0] }));
  };

  const handleBioChange = (content) => {
    setPlayer((prevPlayer) => ({ ...prevPlayer, bio: content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(player).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const res = await fetch(`/api/players/${id}`, {
        method: "PATCH",
        body: formData,
      });
      const jsonRes = await res.json();
      if (jsonRes.success) {
        alert("Player updated successfully");
        route.back();
      } else {
        alert(jsonRes.message || "Failed to update player");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating the player.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg border border-background text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-secondary mb-4"></div>
        <p className="text-text-secondary">Loading player data...</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg border border-background"
    >
      <h2 className="text-2xl font-bold text-text-primary mb-6 pb-2 border-b border-background">
        <FontAwesomeIcon icon={faUser} className="mr-2" />
        Edit Player
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-text-primary font-medium mb-2"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={player.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-background rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-300"
            required
            placeholder="First name"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-text-primary font-medium mb-2"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={player.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-background rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-300"
            required
            placeholder="Last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label
            htmlFor="DOB"
            className="block text-text-primary font-medium mb-2"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="DOB"
            name="DOB"
            value={player.DOB}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-background rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-300"
            required
          />
        </div>

        <div>
          <label
            htmlFor="nationality"
            className="block text-text-primary font-medium mb-2"
          >
            Nationality
          </label>
          <input
            type="text"
            id="nationality"
            name="nationality"
            value={player.nationality}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-background rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-300"
            required
            placeholder="Nationality"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label
            htmlFor="jerseyNumber"
            className="block text-text-primary font-medium mb-2"
          >
            Jersey Number
          </label>
          <input
            type="number"
            id="jerseyNumber"
            name="jerseyNumber"
            value={player.jerseyNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-background rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-300"
            required
            placeholder="#"
          />
        </div>

        <div>
          <label
            htmlFor="position"
            className="block text-text-primary font-medium mb-2"
          >
            Position
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={player.position}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-background rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-300"
            required
            placeholder="Position"
          />
        </div>

        <div>
          <label
            htmlFor="height"
            className="block text-text-primary font-medium mb-2"
          >
            Height (cm)
          </label>
          <input
            type="number"
            id="height"
            name="height"
            value={player.height}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-background rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-300"
            required
            placeholder="Height in cm"
          />
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="image"
          className="block text-text-primary font-medium mb-2"
        >
          Player Photo
        </label>
        {currentImagePath && (
          <div className="mb-3 p-2 border border-background rounded-lg">
            <img
              src={currentImagePath}
              alt="Current Player Image"
              className="w-40 h-auto object-contain mx-auto rounded-lg"
            />
            <p className="text-xs text-text-secondary text-center mt-2">
              Current image
            </p>
          </div>
        )}
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="image"
            className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-background rounded-lg cursor-pointer bg-background/5 hover:bg-background/10 transition-all duration-300"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FontAwesomeIcon
                icon={faUpload}
                className="text-brand-secondary mb-2 text-xl"
              />
              <p className="mb-2 text-sm text-text-primary">
                <span className="font-semibold">Click to upload</span> new photo
              </p>
              <p className="text-xs text-text-secondary">
                PNG or JPG (recommended size 800x1200px)
              </p>
            </div>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
          </label>
        </div>
        {player.image && (
          <div className="mt-3 text-sm text-text-secondary">
            Selected file: {player.image.name}
          </div>
        )}
      </div>

      <div className="mb-6">
        <label
          htmlFor="bio"
          className="block text-text-primary font-medium mb-2"
        >
          Player Bio
        </label>
        <div className="border border-background rounded-lg overflow-hidden">
          <RichTextEditor value={player.bio} onChange={handleBioChange} />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            checked={player.featured}
            onChange={(e) =>
              setPlayer((prevPlayer) => ({
                ...prevPlayer,
                featured: e.target.checked,
              }))
            }
            className="w-5 h-5 text-brand-secondary bg-gray-100 rounded border-background focus:ring-brand-primary"
          />
          <label
            htmlFor="featured"
            className="ml-2 text-text-primary font-medium"
          >
            Featured Player
          </label>
        </div>
        <p className="text-xs text-text-secondary mt-1">
          Featured players will be highlighted on the team page
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-background">
        <button
          type="button"
          onClick={() => route.back()}
          className="bg-background text-text-primary py-3 px-6 rounded-lg hover:bg-gray-200 transition duration-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-brand-secondary text-white py-3 px-6 rounded-lg hover:bg-brand-primary transition duration-300 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faSave} />
          Update Player
        </button>
      </div>
    </form>
  );
}

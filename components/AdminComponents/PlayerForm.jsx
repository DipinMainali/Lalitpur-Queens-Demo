// app/admin/players/form.js
"use client";
import { useState, useRef } from "react";
import RichTextEditor from "./RichTextEditor";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faSave, faUser } from "@fortawesome/free-solid-svg-icons";

export default function PlayerForm() {
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

  const fileInputRef = useRef(null);
  const route = useRouter();

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
    formData.append("firstName", player.firstName);
    formData.append("lastName", player.lastName);
    formData.append("DOB", player.DOB);
    formData.append("height", player.height);
    formData.append("position", player.position);
    formData.append("jerseyNumber", player.jerseyNumber);
    formData.append("nationality", player.nationality);
    formData.append("image", player.image);
    formData.append("bio", player.bio);
    formData.append("featured", player.featured);

    const res = await fetch("/api/players", {
      method: "POST",
      body: formData,
    });
    const jsonRes = await res.json();
    if (jsonRes.success) {
      alert("Player saved successfully");

      // Clear the form and file input
      setPlayer({
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
      fileInputRef.current.value = "";
      route.back();
    } else {
      alert(jsonRes.message || "Failed to save player");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg border border-background"
    >
      <h2 className="text-2xl font-bold text-text-primary mb-6 pb-2 border-b border-background">
        <FontAwesomeIcon icon={faUser} className="mr-2" />
        Add New Player
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
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="image"
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-background rounded-lg cursor-pointer bg-background/5 hover:bg-background/10 transition-all duration-300"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FontAwesomeIcon
                icon={faUpload}
                className="text-brand-secondary mb-2 text-xl"
              />
              <p className="mb-2 text-sm text-text-primary">
                <span className="font-semibold">Click to upload</span> player
                photo
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
              required
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

      <div className="flex justify-end gap-3">
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
          Save Player
        </button>
      </div>
    </form>
  );
}

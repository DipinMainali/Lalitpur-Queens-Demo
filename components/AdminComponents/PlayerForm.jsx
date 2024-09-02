// app/admin/players/form.js
"use client";
import { useState, useRef } from "react";
import RichTextEditor from "./RichTextEditor"; // Import your RichTextEditor component
import { useRouter } from "next/navigation";

export default function PlayerForm() {
  const [player, setPlayer] = useState({
    firstName: "",
    lastName: "",
    DOB: "",
    height: "",
    position: "",
    jerseyNumber: "",
    nationality: "",
    image: null, // For the image file
    bio: "", // Assuming you want a bio field with rich text
  });

  const fileInputRef = useRef(null); // Ref for file input
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
    // If the featured checkbox is checked, update all other players to be non-featured
    if (player.featured) {
      await fetch("/api/players/unfeature", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

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
    formData.append("featured", false); // Assuming you have a featured field

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
      });
      fileInputRef.current.value = ""; // Clear the file input field
      route.back();
    } else {
      alert(jsonRes.message || "Failed to save player");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-queens-white rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label
          htmlFor="firstName"
          className="block text-queens-black font-semibold mb-2"
        >
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={player.firstName}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="lastName"
          className="block text-queens-black font-semibold mb-2"
        >
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={player.lastName}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="DOB"
          className="block text-queens-black font-semibold mb-2"
        >
          Date of Birth
        </label>
        <input
          type="date"
          id="DOB"
          name="DOB"
          value={player.DOB}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="height"
          className="block text-queens-black font-semibold mb-2"
        >
          Height (cm)
        </label>
        <input
          type="number"
          id="height"
          name="height"
          value={player.height}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="position"
          className="block text-queens-black font-semibold mb-2"
        >
          Position
        </label>
        <input
          type="text"
          id="position"
          name="position"
          value={player.position}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="jerseyNumber"
          className="block text-queens-black font-semibold mb-2"
        >
          Jersey Number
        </label>
        <input
          type="number"
          id="jerseyNumber"
          name="jerseyNumber"
          value={player.jerseyNumber}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="nationality"
          className="block text-queens-black font-semibold mb-2"
        >
          Nationality
        </label>
        <input
          type="text"
          id="nationality"
          name="nationality"
          value={player.nationality}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="image"
          className="block text-queens-black font-semibold mb-2"
        >
          Image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          ref={fileInputRef} // Set ref here
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="bio"
          className="block text-queens-black font-semibold mb-2"
        >
          Bio
        </label>
        <RichTextEditor value={player.bio} onChange={handleBioChange} />
      </div>

      <div className="mb-4">
        <label
          htmlFor="featured"
          className="block text-queens-black font-semibold mb-2"
        >
          Featured
        </label>
        <input
          type="checkbox"
          checked={player.featured}
          onChange={(e) =>
            setPlayer((prevPlayer) => ({
              ...prevPlayer,
              featured: e.target.checked,
            }))
          }
        />
      </div>

      <button
        type="submit"
        className="bg-queens-green text-queens-white py-2 px-4 rounded-lg hover:bg-queens-midnight transition duration-300"
      >
        Submit
      </button>
    </form>
  );
}

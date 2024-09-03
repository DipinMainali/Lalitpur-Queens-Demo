// app/admin/players/form.js

"use client";
import { useState, useRef, useEffect } from "react";
import RichTextEditor from "../RichTextEditor";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

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

  const [currentImagePath, setCurrentImagePath] = useState(null); // To store the image path

  useEffect(() => {
    if (!id) return;

    const fetchPlayer = async () => {
      try {
        const res = await fetch(`/api/players/${id}`);
        const jsonRes = await res.json();
        if (jsonRes.success) {
          const fetchedPlayer = jsonRes.data;

          // Set the state for the player
          setPlayer((prevPlayer) => ({
            ...prevPlayer,
            ...fetchedPlayer,
            DOB: fetchedPlayer.DOB ? fetchedPlayer.DOB.split("T")[0] : "", // Format the DOB
          }));

          // Set the current image path
          setCurrentImagePath(fetchedPlayer.image);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
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
        alert("Player saved successfully");
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
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving the player.");
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
        {currentImagePath && (
          <div className="mb-2">
            <img
              src={currentImagePath}
              alt="Current Player Image"
              className="max-w-full h-auto"
            />
          </div>
        )}
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          ref={fileInputRef}
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

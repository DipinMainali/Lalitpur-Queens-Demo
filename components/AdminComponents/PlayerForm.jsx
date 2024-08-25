"use client";
import { createPlayer } from "@/actions/player.action";
import React, { useState } from "react";

export default function PlayerForm() {
  const [player, setPlayer] = useState({
    firstName: "",
    lastName: "",
    DOB: "",
    height: "",
    position: "",
    jerseyNumber: "",
    nationality: "",
    image: "",
  });

  const handleChange = (e) => {
    setPlayer({ ...player, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    try {
      await createPlayer(player);
      console.log("submitted successfully");
      setPlayer({
        firstName: "",
        lastName: "",
        DOB: "",
        height: "",
        position: "",
        jerseyNumber: "",
        nationality: "",
        image: "",
      });
    } catch (error) {
      console.log("failed to submit the form, error: ", error);
    }
  };

  return (
    <form
      className="max-w-lg mx-auto p-8 bg-queens-white shadow-lg rounded-lg"
      onSubmit={handleSubmit}
    >
      <div className="mb-6 flex items-center">
        <label
          htmlFor="firstName"
          className="text-queens-midnight font-medium w-1/3"
        >
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          className="w-2/3 px-3 py-2 border border-queens-emerald rounded-lg focus:outline-none focus:border-queens-blue"
          value={player.firstName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-6 flex items-center">
        <label
          htmlFor="lastName"
          className="text-queens-midnight font-medium w-1/3"
        >
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          className="w-2/3 px-3 py-2 border border-queens-emerald rounded-lg focus:outline-none focus:border-queens-blue"
          value={player.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-6 flex items-center">
        <label htmlFor="DOB" className="text-queens-midnight font-medium w-1/3">
          Date of Birth
        </label>
        <input
          type="date"
          id="DOB"
          name="DOB"
          className="w-2/3 px-3 py-2 border border-queens-emerald rounded-lg focus:outline-none focus:border-queens-blue"
          value={player.DOB}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-6 flex items-center">
        <label
          htmlFor="height"
          className="text-queens-midnight font-medium w-1/3"
        >
          Height (cm)
        </label>
        <input
          type="number"
          id="height"
          name="height"
          className="w-2/3 px-3 py-2 border border-queens-emerald rounded-lg focus:outline-none focus:border-queens-blue"
          value={player.height}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-6 flex items-center">
        <label
          htmlFor="position"
          className="text-queens-midnight font-medium w-1/3"
        >
          Position
        </label>
        <input
          type="text"
          id="position"
          name="position"
          className="w-2/3 px-3 py-2 border border-queens-emerald rounded-lg focus:outline-none focus:border-queens-blue"
          value={player.position}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-6 flex items-center">
        <label
          htmlFor="jerseyNumber"
          className="text-queens-midnight font-medium w-1/3"
        >
          Jersey Number
        </label>
        <input
          type="number"
          id="jerseyNumber"
          name="jerseyNumber"
          className="w-2/3 px-3 py-2 border border-queens-emerald rounded-lg focus:outline-none focus:border-queens-blue"
          value={player.jerseyNumber}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-6 flex items-center">
        <label
          htmlFor="nationality"
          className="text-queens-midnight font-medium w-1/3"
        >
          Nationality
        </label>
        <input
          type="text"
          id="nationality"
          name="nationality"
          className="w-2/3 px-3 py-2 border border-queens-emerald rounded-lg focus:outline-none focus:border-queens-blue"
          value={player.nationality}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-6 flex items-center">
        <label
          htmlFor="image"
          className="text-queens-midnight font-medium w-1/3"
        >
          Image URL
        </label>
        <input
          type="text"
          id="image"
          name="image"
          className="w-2/3 px-3 py-2 border border-queens-emerald rounded-lg focus:outline-none focus:border-queens-blue"
          value={player.image}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-queens-green text-queens-white py-2 px-4 rounded-lg hover:bg-queens-midnight transition duration-300"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

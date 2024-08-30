// app/admin/sponsors/form.js
"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SponsorForm() {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);
  const [website, setWebsite] = useState("");
  const [tier, setTier] = useState("");
  const router = useRouter();

  const fileInputRef = useRef(null); // Ref for file input

  const handleFileChange = (event) => {
    setLogo(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("logo", logo);
    formData.append("website", website);
    formData.append("tier", tier);

    console.log("Form Data:", { name, logo, website, tier });
    const res = await fetch("/api/sponsors", {
      method: "POST",
      body: formData,
    });
    const jsonRes = await res.json();
    if (jsonRes.success) {
      alert(jsonRes.message);

      // Clear the form
      setName("");
      setLogo(null);
      setWebsite("");
      setTier("");
      fileInputRef.current.value = ""; // Clear the file input field

      // Redirect to the sponsors page

      router.back();
    } else {
      alert("Failed to save sponsor: ", jsonRes.message);
    }

    // TODO: Add code to send the form data to your backend

    // e.g., await fetch('/api/sponsors', { method: 'POST', body: formData });
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
          value={name}
          onChange={(e) => setName(e.target.value)}
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

      <div className="mb-4">
        <label
          htmlFor="website"
          className="block text-queens-black font-semibold mb-2"
        >
          Website
        </label>
        <input
          type="text"
          id="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="tier"
          className="block text-queens-black font-semibold mb-2"
        >
          Tier
        </label>
        <select
          id="tier"
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          required
        >
          <option value="">Select Tier</option>
          <option value="Major Sponsor">Major Sponsor</option>
          <option value="Co-Sponsor">Co-sponsor</option>
          <option value="Partner">Partner</option>
          <option value="Co-partner">Co-partner</option>
        </select>
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

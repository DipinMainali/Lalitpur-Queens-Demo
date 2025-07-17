// app/admin/sponsors/form.js
"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faSave,
  faHandshake,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

export default function SponsorForm({ initialData = null }) {
  const isEditing = !!initialData;
  const [name, setName] = useState(initialData?.name || "");
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(initialData?.logo || null);
  const [website, setWebsite] = useState(initialData?.website || "");
  const [tier, setTier] = useState(initialData?.tier || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileError, setFileError] = useState("");
  const router = useRouter();

  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes (increased from 1MB)

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileError("");

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError("File size must be less than 10MB");
        setLogo(null);
        fileInputRef.current.value = "";
        return;
      }

      setLogo(file);

      // Create preview for the selected file
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    if (logo) {
      formData.append("logo", logo);
    }
    formData.append("website", website);
    formData.append("tier", tier);

    try {
      let url = "/api/sponsors";
      let method = "POST";

      if (isEditing) {
        url = `/api/sponsors/${initialData._id}`;
        method = "PATCH";
      }

      const res = await fetch(url, {
        method: method,
        body: formData,
      });

      const jsonRes = await res.json();

      if (jsonRes.success) {
        alert(jsonRes.message);
        if (!isEditing) {
          // Reset form if adding new sponsor
          setName("");
          setLogo(null);
          setLogoPreview(null);
          setWebsite("");
          setTier("");
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
        router.back();
      } else {
        alert("Failed to save sponsor: " + jsonRes.message);
      }
    } catch (err) {
      console.error("Error saving sponsor:", err);
      alert("An error occurred while saving the sponsor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg border border-background"
    >
      <h2 className="text-2xl font-bold text-text-primary mb-6 pb-2 border-b border-background">
        <FontAwesomeIcon
          icon={isEditing ? faEdit : faHandshake}
          className="mr-2"
        />
        {isEditing ? "Edit Sponsor" : "Add New Sponsor"}
      </h2>

      <div className="mb-6">
        <label
          htmlFor="name"
          className="block text-text-primary font-medium mb-2"
        >
          Sponsor Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-background rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-300"
          required
          placeholder="Enter sponsor name"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="website"
          className="block text-text-primary font-medium mb-2"
        >
          Website URL
        </label>
        <input
          type="url"
          id="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full px-4 py-3 border border-background rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-300"
          required
          placeholder="https://"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="tier"
          className="block text-text-primary font-medium mb-2"
        >
          Sponsorship Tier
        </label>
        <select
          id="tier"
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          className="w-full px-4 py-3 border border-background rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-300"
          required
        >
          <option value="">Select Sponsorship Tier</option>
          <option value="Title Sponsor">Title Sponsor</option>
          <option value="Co-Sponsor">Co-sponsor</option>
          <option value="Partner">Partner</option>
          <option value="Co-partner">Co-partner</option>
        </select>
      </div>

      <div className="mb-6">
        <label
          htmlFor="logo"
          className="block text-text-primary font-medium mb-2"
        >
          Sponsor Logo
        </label>

        {logoPreview && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-background text-center">
            <img
              src={logoPreview}
              alt="Logo preview"
              className="h-20 mx-auto object-contain"
            />
            <p className="mt-2 text-xs text-text-secondary">
              Current logo preview
            </p>
          </div>
        )}

        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="logo"
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-background rounded-lg cursor-pointer bg-background/5 hover:bg-background/10 transition-all duration-300"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FontAwesomeIcon
                icon={faUpload}
                className="text-brand-secondary mb-2 text-xl"
              />
              <p className="mb-2 text-sm text-text-primary">
                <span className="font-semibold">Click to upload</span> sponsor
                logo
              </p>
              <p className="text-xs text-text-secondary">
                SVG, PNG or JPG (transparent background recommended, max 10MB)
              </p>
              {isEditing && (
                <p className="text-xs text-brand-primary mt-2">
                  Leave empty to keep current logo
                </p>
              )}
            </div>
            <input
              type="file"
              id="logo"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              required={!isEditing}
            />
          </label>
        </div>
        {logo && (
          <div className="mt-3 text-sm text-text-secondary">
            Selected file: {logo.name}
          </div>
        )}
        {fileError && <p className="mt-2 text-sm text-red-600">{fileError}</p>}
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
          <FontAwesomeIcon icon={faSave} />
          {isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Sponsor"
            : "Save Sponsor"}
        </button>
      </div>
    </form>
  );
}

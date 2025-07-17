// app/admin/players/form.js
"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import RichTextEditor from "./RichTextEditor";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faSave,
  faUser,
  faExclamationTriangle,
  faCheckCircle,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fileError, setFileError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  // Clear messages when user starts making changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlayer((prevPlayer) => ({ ...prevPlayer, [name]: value }));
    // Clear messages when user makes changes
    setError("");
    setSuccess("");
  };

  // Generate preview URL when image changes
  useEffect(() => {
    if (player.image && player.image instanceof File) {
      const objectUrl = URL.createObjectURL(player.image);
      setPreviewUrl(objectUrl);

      // Clean up the URL when component unmounts or image changes
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [player.image]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setFileError("");
    setPreviewUrl(null);

    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      setFileError("Please select an image file (JPEG, PNG, etc.)");
      fileInputRef.current.value = "";
      return;
    }

    // Check file size (1MB = 1,048,576 bytes)
    const MAX_FILE_SIZE = 1 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setFileError("Image size must be less than 1MB");
      fileInputRef.current.value = "";
      return;
    }

    try {
      // Compress the image before setting it
      const compressedFile = await compressImage(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
      });

      // Verify compressed file is still under limit
      if (compressedFile.size > MAX_FILE_SIZE) {
        setFileError(
          "Image is still too large after compression. Please use a smaller image."
        );
        fileInputRef.current.value = "";
        return;
      }

      setPlayer((prev) => ({ ...prev, image: compressedFile }));
    } catch (error) {
      console.error("Error compressing image:", error);
      setFileError("Error processing image. Please try a different file.");
      fileInputRef.current.value = "";
    }
  };

  // Image compression function
  const compressImage = (file, options) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Scale down if needed
          if (
            width > options.maxWidthOrHeight ||
            height > options.maxWidthOrHeight
          ) {
            if (width > height) {
              height = Math.round((height * options.maxWidthOrHeight) / width);
              width = options.maxWidthOrHeight;
            } else {
              width = Math.round((width * options.maxWidthOrHeight) / height);
              height = options.maxWidthOrHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw image to canvas
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob/file
          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            file.type,
            0.7 // Quality (0.7 = 70%)
          );
        };
        img.onerror = reject;
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleBioChange = (content) => {
    setPlayer((prevPlayer) => ({ ...prevPlayer, bio: content }));
    // Clear messages when user makes changes
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Create a FormData object for the API request
      const formData = new FormData();

      // Add all player fields to FormData
      formData.append("firstName", player.firstName);
      formData.append("lastName", player.lastName);
      formData.append("DOB", player.DOB);
      formData.append("height", player.height);
      formData.append("position", player.position);
      formData.append("jerseyNumber", player.jerseyNumber);
      formData.append("nationality", player.nationality);
      formData.append("bio", player.bio);
      formData.append("featured", player.featured);

      // Add image if present
      if (player.image) {
        formData.append("image", player.image);
      }

      // Send to your API with FormData
      const response = await fetch("/api/players", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save player");
      }

      // Success!
      setSuccess("Player saved successfully");

      // Reset form after short delay
      setTimeout(() => {
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
        setPreviewUrl(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Navigate back
        router.back();
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "An unexpected error occurred");
      window.scrollTo(0, 0); // Scroll to top to show error
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
        <FontAwesomeIcon icon={faUser} className="mr-2" />
        Add New Player
      </h2>

      {/* Error message display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-md">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-red-500 mr-2"
            />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Success message display */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-md">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-green-500 mr-2"
            />
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        </div>
      )}

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* File Upload Area */}
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="image"
              className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${
                fileError
                  ? "border-red-400 bg-red-50 hover:bg-red-100"
                  : "border-background bg-background/5 hover:bg-background/10"
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FontAwesomeIcon
                  icon={faUpload}
                  className={`mb-2 text-xl ${
                    fileError ? "text-red-500" : "text-brand-secondary"
                  }`}
                />
                <p className="mb-2 text-sm text-text-primary">
                  <span className="font-semibold">Click to upload</span> player
                  photo
                </p>
                <p className="text-xs text-text-secondary">
                  PNG or JPG (max 1MB, recommended size 800x1200px)
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

          {/* Image Preview */}
          <div className="flex items-center justify-center w-full">
            {previewUrl ? (
              <div className="relative w-full h-40 border border-background rounded-lg overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="Player preview"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-40 border border-background rounded-lg bg-gray-50">
                <FontAwesomeIcon
                  icon={faImage}
                  className="text-gray-300 text-3xl mb-2"
                />
                <p className="text-sm text-gray-400">
                  Image preview will appear here
                </p>
              </div>
            )}
          </div>
        </div>

        {fileError && (
          <div className="mt-2 text-sm text-red-600">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
            {fileError}
          </div>
        )}

        {player.image && !fileError && (
          <div className="mt-2 text-sm text-green-600">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
            File selected: {player.image.name} (
            {(player.image.size / 1024).toFixed(2)} KB)
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
          onClick={() => router.back()}
          className="bg-background text-text-primary py-3 px-6 rounded-lg hover:bg-gray-200 transition duration-300"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`text-white py-3 px-6 rounded-lg transition duration-300 flex items-center gap-2 ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-brand-secondary hover:bg-brand-primary"
          }`}
          disabled={isSubmitting}
        >
          <FontAwesomeIcon icon={faSave} />
          {isSubmitting ? "Saving..." : "Save Player"}
        </button>
      </div>
    </form>
  );
}

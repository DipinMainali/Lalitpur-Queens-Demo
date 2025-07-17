// app/admin/news/form.js
"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import RichTextEditor from "./RichTextEditor";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faNewspaper,
  faUpload,
  faSave,
  faEdit,
  faImage,
  faExclamationTriangle,
  faCheckCircle,
  faArchive, // Add this line
} from "@fortawesome/free-solid-svg-icons";

export default function NewsForm({ initialData = null }) {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

  const isEditing = !!initialData;
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");
  const [publishStatus, setPublishStatus] = useState(
    initialData?.status || "published"
  );
  const [fileError, setFileError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileError("");

    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      setFileError("Please select an image file (JPEG, PNG, etc.)");
      fileInputRef.current.value = "";
      return;
    }

    // Check file size (10MB limit)
    if (file.size > MAX_FILE_SIZE) {
      setFileError("Image size must be less than 10MB");
      fileInputRef.current.value = "";
      return;
    }

    setImage(file);

    // Create preview for the selected file
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Format file size in a readable way (KB, MB)
  const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    }
    return `${(sizeInBytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tags);
    formData.append("status", publishStatus);

    if (image) {
      formData.append("image", image);
    }

    try {
      let url = "/api/news";
      let method = "POST";

      if (isEditing) {
        url = `/api/news/${initialData._id}`;
        method = "PUT"; // Will be handled by the PUT handler which calls PATCH
      }

      const res = await fetch(url, {
        method: method,
        body: formData,
      });

      const jsonRes = await res.json();

      if (jsonRes.success) {
        setSuccess(jsonRes.message || "Article saved successfully");

        // Reset form after short delay if adding new article
        if (!isEditing) {
          setTimeout(() => {
            setTitle("");
            setContent("");
            setImage(null);
            setImagePreview(null);
            setTags("");
            setPublishStatus("published");

            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }

            // Navigate back
            router.back();
          }, 1500);
        } else {
          // Just navigate back for edits after a short delay
          setTimeout(() => {
            router.back();
          }, 1500);
        }
      } else {
        setError(jsonRes.message || "Failed to save article");
      }
    } catch (err) {
      console.error("Error saving article:", err);
      setError("An error occurred while saving the article");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center">
        <FontAwesomeIcon
          icon={isEditing ? faEdit : faNewspaper}
          className="mr-2 text-brand-secondary"
        />
        {isEditing ? "Edit Article" : "Create New Article"}
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

      <div className="space-y-6">
        {/* Title Field */}
        <div>
          <label
            htmlFor="title"
            className="block text-gray-700 font-semibold mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all duration-300"
            required
            placeholder="Enter article title"
          />
        </div>

        {/* Tags Field */}
        <div>
          <label
            htmlFor="tags"
            className="block text-gray-700 font-semibold mb-2"
          >
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all duration-300"
            placeholder="news, team, tournament, etc."
          />
          <p className="text-xs text-gray-500 mt-1">
            Add relevant tags separated by commas to improve article
            discoverability
          </p>
        </div>

        {/* Content Rich Text Editor */}
        <div>
          <label
            htmlFor="content"
            className="block text-gray-700 font-semibold mb-2"
          >
            Content
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <RichTextEditor
              value={content}
              onChange={setContent}
              className="min-h-[300px]"
            />
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label
            htmlFor="image"
            className="block text-gray-700 font-semibold mb-2"
          >
            Featured Image
          </label>

          {imagePreview && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
              {/* Using Next.js Image component for better optimization */}
              <div className="relative h-48 w-full max-w-md mx-auto">
                <Image
                  src={imagePreview}
                  alt="Article preview image"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  style={{ objectFit: "cover" }}
                  className="rounded-md"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {isEditing && !image
                  ? "Current featured image"
                  : "New image preview"}
              </p>
            </div>
          )}

          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="image"
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${
                fileError
                  ? "border-red-400 bg-red-50 hover:bg-red-100"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FontAwesomeIcon
                  icon={faImage}
                  className={`mb-2 text-xl ${
                    fileError ? "text-red-500" : "text-brand-secondary"
                  }`}
                />
                <p className="mb-2 text-sm text-gray-700">
                  <span className="font-semibold">Click to upload</span>{" "}
                  featured image
                </p>
                <p className="text-xs text-gray-500">
                  JPG or PNG (max 10MB, 1200×630px recommended)
                </p>
              </div>
              <input
                type="file"
                id="image"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {fileError && (
            <div className="mt-2 text-sm text-red-600">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
              {fileError}
            </div>
          )}

          {image && !fileError && (
            <div className="mt-2 text-sm text-green-600">
              <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
              File selected: {image.name} ({formatFileSize(image.size)})
              {image.size > 2 * 1024 * 1024 && (
                <span className="ml-2 text-amber-500">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="mr-1"
                  />
                  Large file - upload may take longer
                </span>
              )}
            </div>
          )}
        </div>

        {/* Publication Status */}
        <div>
          <label
            htmlFor="status"
            className="block text-gray-700 font-semibold mb-2"
          >
            Publication Status
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              className={`border rounded-lg p-4 text-center cursor-pointer transition-all ${
                publishStatus === "published"
                  ? "bg-green-50 border-green-300 shadow-sm"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => setPublishStatus("published")}
            >
              <div
                className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  publishStatus === "published" ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className={`${
                    publishStatus === "published"
                      ? "text-green-500"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <h4
                className={`font-medium ${
                  publishStatus === "published"
                    ? "text-green-700"
                    : "text-gray-700"
                }`}
              >
                Published
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Visible to all website visitors
              </p>
            </div>

            <div
              className={`border rounded-lg p-4 text-center cursor-pointer transition-all ${
                publishStatus === "draft"
                  ? "bg-blue-50 border-blue-300 shadow-sm"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => setPublishStatus("draft")}
            >
              <div
                className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  publishStatus === "draft" ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                <FontAwesomeIcon
                  icon={faEdit}
                  className={`${
                    publishStatus === "draft"
                      ? "text-blue-500"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <h4
                className={`font-medium ${
                  publishStatus === "draft" ? "text-blue-700" : "text-gray-700"
                }`}
              >
                Draft
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Save for later, not visible on the site
              </p>
            </div>

            <div
              className={`border rounded-lg p-4 text-center cursor-pointer transition-all ${
                publishStatus === "archived"
                  ? "bg-gray-100 border-gray-400 shadow-sm"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => setPublishStatus("archived")}
            >
              <div
                className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  publishStatus === "archived" ? "bg-gray-200" : "bg-gray-100"
                }`}
              >
                <FontAwesomeIcon
                  icon={faArchive}
                  className={`${
                    publishStatus === "archived"
                      ? "text-gray-600"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <h4
                className={`font-medium ${
                  publishStatus === "archived"
                    ? "text-gray-700"
                    : "text-gray-700"
                }`}
              >
                Archived
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Inactive content, not visible on the site
              </p>
            </div>
          </div>
          {/* Hidden select field to maintain compatibility with form processing */}
          <input type="hidden" name="status" value={publishStatus} />
        </div>

        {/* Form Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-200 transition duration-300"
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
            {isSubmitting
              ? "Saving..."
              : isEditing
              ? "Update Article"
              : "Publish Article"}
          </button>
        </div>
      </div>
    </form>
  );
}

// app/admin/news/form.js
"use client";
import { useState, useRef, useEffect } from "react";
import RichTextEditor from "./RichTextEditor";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faNewspaper,
  faUpload,
  faSave,
  faEdit,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

export default function NewsForm({ initialData = null }) {
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

  const router = useRouter();
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);

    // Create preview for the selected file
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

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
        method = "PUT";
      }

      const res = await fetch(url, {
        method: method,
        body: formData,
      });

      const jsonRes = await res.json();

      if (jsonRes.success) {
        alert(jsonRes.message);
        if (!isEditing) {
          // Clear the form if adding new article
          setTitle("");
          setContent("");
          setImage(null);
          setImagePreview(null);
          setTags("");
          setPublishStatus("published");
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
        router.back();
      } else {
        alert("Failed to save article: " + jsonRes.message);
      }
    } catch (err) {
      console.error("Error saving article:", err);
      alert("An error occurred while saving the article");
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
              <img
                src={imagePreview}
                alt="Article preview image"
                className="h-48 mx-auto object-cover rounded-md"
              />
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
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FontAwesomeIcon
                  icon={faImage}
                  className="text-brand-secondary mb-2 text-xl"
                />
                <p className="mb-2 text-sm text-gray-700">
                  <span className="font-semibold">Click to upload</span>{" "}
                  featured image
                </p>
                <p className="text-xs text-gray-500">
                  JPG or PNG (1200×630px recommended)
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
          {image && (
            <div className="mt-3 text-sm text-gray-600">
              Selected file: {image.name}
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
          <select
            id="status"
            value={publishStatus}
            onChange={(e) => setPublishStatus(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all duration-300"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
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
            className="bg-brand-secondary text-white py-3 px-6 rounded-lg hover:bg-brand-primary transition duration-300 flex items-center gap-2"
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

// app/admin/news/form.js
"use client";
import { useState } from "react";
import RichTextEditor from "./RichTextEditor";

export default function NewsForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    console.log("Form Data:", { title, content, image });

    // TODO: Add code to send the form data to your backend
    // e.g., await fetch('/api/news', { method: 'POST', body: formData });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-queens-white rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-queens-black font-semibold mb-2"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="content"
          className="block text-queens-black font-semibold mb-2"
        >
          Content
        </label>
        <RichTextEditor value={content} onChange={setContent} />
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
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-queens-black rounded-lg"
        />
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

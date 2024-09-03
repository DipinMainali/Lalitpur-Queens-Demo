"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import RichTextEditor from "../RichTextEditor";

export default function EditNewsForm() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [news, setNews] = useState({
    title: "",
    content: "",
    image: null,
    currentImagePath: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchNews = async () => {
      try {
        const res = await fetch(`/api/news/${id}`);
        const jsonRes = await res.json();
        if (jsonRes.success) {
          const fetchedNews = jsonRes.data;
          setNews({
            title: fetchedNews.title,
            content: fetchedNews.content,
            image: null,
            currentImagePath: fetchedNews.image,
          });
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchNews();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNews((prevNews) => ({ ...prevNews, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNews((prevNews) => ({ ...prevNews, image: e.target.files[0] }));
  };

  const handleContentChange = (content) => {
    setNews((prevNews) => ({ ...prevNews, content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", news.title);
    formData.append("content", news.content);
    if (news.image) {
      formData.append("image", news.image);
    }

    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "PATCH",
        body: formData,
      });
      const jsonRes = await res.json();
      if (jsonRes.success) {
        alert("News updated successfully");
        router.back();
      } else {
        alert("Failed to update news: ", jsonRes.message);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating the news.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-queens-white rounded-lg shadow-md space-y-6"
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-queens-black"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={news.title}
          onChange={handleChange}
          className="mt-1 p-3 w-full border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-semibold text-queens-black"
        >
          Content
        </label>
        <RichTextEditor value={news.content} onChange={handleContentChange} />
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-semibold text-queens-black"
        >
          Image
        </label>
        {news.currentImagePath && (
          <div className="mb-2">
            <img
              src={news.currentImagePath}
              alt="Current News Image"
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
          className="mt-1 p-3 w-full border border-gray-300 rounded-md"
          ref={fileInputRef}
        />
      </div>

      <button
        type="submit"
        className="bg-queens-green text-queens-white py-2 px-4 rounded-lg hover:bg-queens-midnight transition duration-300"
      >
        Save
      </button>
    </form>
  );
}

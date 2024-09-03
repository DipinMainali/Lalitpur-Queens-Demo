"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function News() {
  const [newsArticles, setNewsArticles] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const jsonRes = await res.json();
        if (jsonRes.success) {
          setNewsArticles(jsonRes.data);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchNews();
  }, []);

  const router = useRouter();

  const handleEdit = (id) => {
    console.log(`Edit news article with id: ${id}`);
    try {
      router.push(`/AdminDashboard/news/edit/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    console.log(`Delete news article with id: ${id}`);
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      });
      const jsonRes = await res.json();
      if (jsonRes.success) {
        alert("News article deleted successfully");
        setNewsArticles(newsArticles.filter((article) => article._id !== id));
      } else {
        alert("Failed to delete news article");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-queens-white text-center">News</h1>
      <div className="flex justify-end mb-4">
        <Link
          href="/AdminDashboard/news/add"
          className="bg-queens-green text-queens-white py-2 px-4 rounded-lg hover:bg-queens-midnight transition duration-300 flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add New
        </Link>
      </div>

      <div className="overflow-x-auto bg-queens-white p-6 rounded-lg shadow-lg">
        <table className="min-w-full bg-queens-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Title
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Image
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Date
              </th>
              <th className="px-6 py-3 border-b-2 border-queens-black text-left text-sm font-semibold text-queens-black">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {newsArticles &&
              newsArticles.map((article) => (
                <tr key={article._id}>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    {article.title}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={`${article.title} image`}
                        className="h-10"
                      />
                    ) : (
                      "No image"
                    )}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 border-b border-queens-black text-sm text-queens-black">
                    <button
                      onClick={() => handleEdit(article._id)}
                      className="text-queens-green hover:text-queens-midnight transition duration-300 mr-4"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(article._id)}
                      className="text-queens-green hover:text-queens-midnight transition duration-300"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

const NewsDetails = () => {
  const router = useRouter();
  const pathname = usePathname();

  const id = pathname.split("/").pop();
  console.log(id);

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("id", id);
    if (id) {
      const fetchNews = async () => {
        try {
          const res = await fetch(`/api/news/${id}`);

          if (!res.ok) {
            throw new Error("Failed to fetch news");
          }
          const data = await res.json();
          console.log("data", data);
          setNews(data.data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchNews();
    }
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* Loading Spinner */}
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-queens-blue border-opacity-75"></div>
      </div>
    );
  if (!news) return <p>News not found</p>;

  return (
    <div className="bg-queens-white text-queens-black min-h-screen py-12 px-4 md:px-16 lg:px-24">
      <div className="max-w-5xl mx-auto">
        {/* Featured Image */}
        <div className="relative mb-12">
          <Image
            src={news.image}
            alt={news.title}
            width={1000}
            height={600}
            className="w-full h-auto rounded-lg object-cover shadow-lg transition duration-300 hover:scale-105"
          />
        </div>

        {/* Title and Date */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-queens-midnight mb-4">
            {news.title}
          </h1>
          <p className="text-md text-queens-blue italic mb-2 transition duration-300 ease-in-out transform hover:scale-105">
            {new Date(news.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-8 text-queens-midnight leading-relaxed">
          {news.content?.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-6 text-lg tracking-wide">
              {paragraph
                .replace("<p>", "")
                .replace("</p>", "")
                .replace("&nbsp;", " ")}
            </p>
          ))}
        </div>

        {/* Back to News List Button */}
        <div className="text-center">
          {/* Update button */}
          <button
            onClick={() => router.push("/News")}
            className="bg-brand-secondary text-white text-lg font-semibold py-3 px-8 rounded-full transition duration-300 hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-opacity-50 cursor-pointer shadow-lg"
          >
            Back to News
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;

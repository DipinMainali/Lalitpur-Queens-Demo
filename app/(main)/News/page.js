"use client";
import React, { useState, useEffect } from "react";
import NewsCard from "@/components/NewsCard";
import { useRouter } from "next/navigation";

export default function News() {
  const [newsItems, setNews] = useState([]);
  const [visibleNewsCount, setVisibleNewsCount] = useState(3); // Initially show 3 news items
  const router = useRouter();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const jsonRes = await res.json();
        if (jsonRes.success) {
          setNews(jsonRes.data);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchNews();

    console.log("News Items", newsItems);
  }, []);

  const loadMoreNews = () => {
    setVisibleNewsCount((prevCount) => prevCount + 6); // Load 3 more news items
  };

  return (
    <div className="bg-queens-white min-h-screen">
      <div className="container mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold text-queens-midnight mb-8 text-center">
          Latest News
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.slice(0, visibleNewsCount).map((newsItem) => (
            <div
              key={newsItem._id}
              className="cursor-pointer"
              onClick={() => router.push(`/News/${newsItem._id}`)}
            >
              <NewsCard
                title={newsItem.title}
                //remove <p> tag from content and &nbsp; from content
                excerpt={newsItem.content
                  .replace(/<p>|<\/p>|&nbsp;/g, "")
                  .slice(0, 100)
                  .concat("...")}
                image={newsItem.image}
                date={new Date(newsItem.createdAt).toLocaleDateString()}
              />
            </div>
          ))}
        </div>

        {visibleNewsCount < newsItems.length && (
          <div className="text-center mt-12">
            <button
              onClick={loadMoreNews}
              className="bg-queens-emerald text-queens-white text-lg font-semibold py-3 px-8 rounded-full transition duration-300 hover:bg-queens-green focus:outline-none focus:ring-2 focus:ring-queens-green focus:ring-opacity-50 cursor-pointer"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import NewsCard from "@/components/NewsCard";
import { useRouter } from "next/navigation";

export default function News() {
  const [newsItems, setNews] = useState([]);
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
  }, []);

  return (
    <div className="bg-queens-white min-h-screen py-8">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-queens-white mb-8 text-center">
          News
        </h1>
        <div className="flex flex-wrap gap-8 justify-center">
          {newsItems.map((newsItem) => (
            <div
              key={newsItem._id}
              onClick={() => router.push(`/news/${newsItem._id}`)}
              className="cursor-pointer transform transition duration-300 hover:scale-105"
            >
              <NewsCard
                title={newsItem.title}
                excerpt={newsItem.content.substring(0, 100) + "..."}
                image={newsItem.image}
                date={new Date(newsItem.createdAt).toLocaleDateString()}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

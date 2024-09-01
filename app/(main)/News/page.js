"use client";
import React from "react";
import { useState, useEffect } from "react";
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
    <>
      <div className="bg-queens-white">
        <div className="container px-8 py-4">
          <h1 className=" text-2xl ">News</h1>
        </div>
        <div className="container flex flex-row gap-4 mx-auto px-4 pb-16">
          {newsItems.map((newsItem) => (
            <div
              key={newsItem._id}
              onClick={() => router.push(`/news/${newsItem._id}`)}
            >
              <NewsCard
                key={newsItem._id}
                title={newsItem.title}
                excerpt={newsItem.content.substring(0, 100) + "..."}
                image={newsItem.image}
                date={new Date(newsItem.createdAt).toLocaleDateString()}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

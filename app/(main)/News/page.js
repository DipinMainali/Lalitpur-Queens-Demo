"use client";
import React, { useState, useEffect } from "react";
import NewsCard from "@/components/NewsCard";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image"; // Add this import

export default function News() {
  const [newsItems, setNews] = useState([]);
  const [visibleNewsCount, setVisibleNewsCount] = useState(7); // Initially show 7 news items (1 featured + 6 regular)
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const loadMoreNews = () => {
    setVisibleNewsCount((prevCount) => prevCount + 6);
  };

  // Filter news based on tags
  const filteredNews =
    activeFilter === "all"
      ? newsItems
      : newsItems.filter((item) =>
          item.tags
            ? item.tags.some(
                (tag) => tag.toLowerCase() === activeFilter.toLowerCase()
              )
            : false
        );

  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-background min-h-screen pb-16">
      {/* Hero Section */}
      <div className="relative bg-brand-primary text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-secondary rounded-full opacity-10"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent rounded-full opacity-10"></div>
        </div>
        <div className="container mx-auto px-8 py-16 relative z-10">
          <h1 className="text-5xl font-bold mb-4">Team News</h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Stay updated with the latest stories, announcements, and
            achievements from the Lalitpur Queens
          </p>
        </div>
      </div>

      <div className="container mx-auto px-8 py-12">
        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              activeFilter === "all"
                ? "bg-brand-primary text-white"
                : "bg-white text-text-primary hover:bg-brand-secondary/10"
            }`}
          >
            All News
          </button>
          <button
            onClick={() => setActiveFilter("team")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              activeFilter === "team"
                ? "bg-brand-primary text-white"
                : "bg-white text-text-primary hover:bg-brand-secondary/10"
            }`}
          >
            Team Updates
          </button>
          <button
            onClick={() => setActiveFilter("match")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              activeFilter === "match"
                ? "bg-brand-primary text-white"
                : "bg-white text-text-primary hover:bg-brand-secondary/10"
            }`}
          >
            Match Reports
          </button>
          <button
            onClick={() => setActiveFilter("tournament")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              activeFilter === "tournament"
                ? "bg-brand-primary text-white"
                : "bg-white text-text-primary hover:bg-brand-secondary/10"
            }`}
          >
            Tournament News
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-secondary"></div>
          </div>
        ) : filteredNews.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Featured News Item (first item) */}
            {filteredNews.length > 0 && (
              <motion.div variants={item} className="lg:col-span-12 mb-8">
                <div
                  className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl flex flex-col md:flex-row"
                  onClick={() => router.push(`/News/${filteredNews[0]._id}`)}
                >
                  <div className="md:w-1/2 relative">
                    <div className="relative h-64 md:h-full">
                      <Image
                        src={
                          filteredNews[0].image ||
                          "/images/news-placeholder.jpg"
                        }
                        alt={filteredNews[0].title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                        className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/70 to-transparent md:bg-gradient-to-t"></div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-accent text-text-primary text-xs font-bold px-3 py-1 rounded-full">
                          Featured
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                    <div className="text-sm text-brand-secondary font-medium mb-2">
                      {new Date(filteredNews[0].createdAt).toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-text-primary group-hover:text-brand-primary transition-colors duration-300">
                      {filteredNews[0].title}
                    </h2>
                    <p className="text-text-secondary mb-6 line-clamp-3">
                      {filteredNews[0].content
                        .replace(/<p>|<\/p>|&nbsp;/g, "")
                        .slice(0, 200)}
                      ...
                    </p>
                    <button className="self-start flex items-center gap-2 text-brand-secondary font-semibold group-hover:text-brand-primary transition-colors duration-300">
                      Read Full Article
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Regular News Grid - pass tags to NewsCard */}
            {filteredNews.slice(1, visibleNewsCount).map((newsItem) => (
              <motion.div
                key={newsItem._id}
                variants={item}
                className="lg:col-span-4 sm:col-span-6"
              >
                <NewsCard
                  id={newsItem._id}
                  title={newsItem.title}
                  excerpt={newsItem.content
                    .replace(/<p>|<\/p>|&nbsp;/g, "")
                    .slice(0, 120)
                    .concat("...")}
                  image={newsItem.image}
                  date={newsItem.createdAt}
                  tags={newsItem.tags}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              No News Articles Found
            </h3>
            <p className="text-text-secondary mb-6">
              We couldn&apos;t find any articles matching your filter criteria.
            </p>
            <button
              onClick={() => setActiveFilter("all")}
              className="inline-flex items-center px-6 py-3 bg-brand-secondary text-white rounded-full hover:bg-brand-primary transition-colors duration-300"
            >
              View All News
            </button>
          </div>
        )}

        {/* Load More Button */}
        {filteredNews.length > visibleNewsCount && (
          <div className="text-center mt-12">
            <button
              onClick={loadMoreNews}
              className="bg-brand-primary text-white text-lg font-semibold py-3 px-8 rounded-full transition duration-300 hover:bg-brand-secondary hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-opacity-50"
            >
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

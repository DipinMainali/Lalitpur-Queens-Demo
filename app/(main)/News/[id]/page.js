"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

const NewsDetails = () => {
  const router = useRouter();
  const pathname = usePathname();

  const id = pathname.split("/").pop();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchNews = async () => {
        try {
          const res = await fetch(`/api/news/${id}`);

          if (!res.ok) {
            throw new Error("Failed to fetch news");
          }
          const data = await res.json();
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

  // Parse HTML content safely
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-blue-50">
        {/* Enhanced Loading Spinner */}
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#10316b] mb-4"></div>
        <p className="text-[#10316b] font-medium animate-pulse">
          Loading news article...
        </p>
      </div>
    );

  if (!news)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          News article not found
        </h2>
        <p className="text-gray-500 mb-6">
          The article you&apos;re looking for may have been moved or deleted
        </p>
        <button
          onClick={() => router.push("/News")}
          className="bg-[#10316b] hover:bg-[#0b8457] text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
        >
          Return to News
        </button>
      </div>
    );

  // Format date nicely
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 text-gray-800 min-h-screen pt-20 pb-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto animate-fade-in">
        {/* Article Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Featured Image */}
          <div className="relative h-72 md:h-96 overflow-hidden">
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover transition duration-700 ease-in-out hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-white/80 text-sm font-medium mb-2 inline-block bg-[#10316b]/80 px-3 py-1 rounded-full">
                {formatDate(news.createdAt)}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {news.title}
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-10">
            {/* Article content with proper HTML rendering */}
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {news.content ? (
                <div
                  dangerouslySetInnerHTML={createMarkup(
                    news.content.replace(/&nbsp;/g, " ")
                  )}
                />
              ) : (
                <p>No content available.</p>
              )}
            </div>

            {/* Social Sharing */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </button>
                <button className="p-2 bg-sky-100 text-sky-500 rounded-full hover:bg-sky-200 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </button>
                <button className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </button>
              </div>

              {/* Back to News List Button */}
              <button
                onClick={() => router.push("/News")}
                className="bg-[#10316b] text-white font-semibold py-2 px-6 rounded-lg transition duration-300 hover:bg-[#0b8457] focus:outline-none focus:ring-2 focus:ring-[#10316b] focus:ring-opacity-50 shadow-md"
              >
                ← Back to News
              </button>
            </div>
          </div>
        </div>

        {/* Related articles section could be added here */}
      </div>
    </div>
  );
};

export default NewsDetails;

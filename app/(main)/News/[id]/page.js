import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

const NewsDetails = () => {
  const router = useRouter();
  const { id } = router.query;
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
          setNews(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchNews();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!news) return <p>News not found</p>;

  return (
    <div className="bg-queens-white text-queens-black min-h-screen py-12 px-4 md:px-16 lg:px-24">
      <div className="max-w-5xl mx-auto">
        {/* Featured Image */}
        <div className="relative mb-8">
          <Image
            src={news.image}
            alt={news.title}
            width={1000}
            height={600}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>

        {/* Title and Date */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-queens-midnight mb-4">
            {news.title}
          </h1>
          <p className="text-sm text-queens-midnight">{news.date}</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <p className="leading-relaxed mb-6">{news.content}</p>
        </div>

        {/* Back to News List Button */}
        <div className="mt-12">
          <button
            onClick={() => router.back()}
            className="bg-queens-emerald text-queens-white text-sm font-semibold py-2 px-6 rounded-full transition duration-300 hover:bg-queens-green focus:outline-none focus:ring-2 focus:ring-queens-green focus:ring-opacity-50 cursor-pointer"
          >
            Back to News
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;

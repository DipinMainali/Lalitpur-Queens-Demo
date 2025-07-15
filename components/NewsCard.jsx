import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function NewsCard({ id, title, excerpt, image, date, tags }) {
  const router = useRouter();

  const handleReadMoreClick = (e) => {
    e.stopPropagation();
    router.push(`/News/${id}`);
  };

  const navigateToArticle = () => {
    router.push(`/News/${id}`);
  };

  // Get first tag or default to "News"
  const primaryTag = tags && tags.length > 0 ? tags[0] : "News";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="h-full rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white group cursor-pointer"
      onClick={navigateToArticle}
    >
      {/* News Image with Overlay */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={image || "/images/news-placeholder.jpg"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300"></div>

        {/* Tag Badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-white/90 text-brand-primary text-xs font-semibold px-3 py-1 rounded-full">
            {primaryTag}
          </div>
        </div>

        {/* Date Badge */}
        <div className="absolute top-3 right-3">
          <div className="bg-white text-text-primary text-xs font-medium px-3 py-1 rounded-full shadow-sm">
            {new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col h-[calc(100%-13rem)]">
        {/* Title */}
        <h3 className="font-bold text-xl mb-3 text-text-primary group-hover:text-brand-primary transition-colors duration-300 line-clamp-2">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-text-secondary mb-5 line-clamp-3 text-sm flex-grow">
          {excerpt}
        </p>

        {/* Action Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-background mt-auto">
          {/* Author or category */}
          <div className="flex items-center">
            <div className="w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-xs font-bold">LQ</span>
            </div>
            <span className="text-xs text-text-secondary">Team News</span>
          </div>

          {/* Read button */}
          <button
            onClick={handleReadMoreClick}
            className="flex items-center gap-1.5 text-sm font-semibold text-brand-secondary group-hover:text-brand-primary transition-colors duration-300"
          >
            Read More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300"
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
  );
}

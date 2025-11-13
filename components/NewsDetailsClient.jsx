"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import ShareButton from "./ShareButton";

const NewsDetailsClient = ({ news }) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Ensure component is mounted before accessing window
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get current URL only on client side using useMemo
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined" || !isMounted) {
      return "";
    }
    return window.location.href;
  }, [isMounted]);

  // Create share text with title and excerpt - improved formatting
  const shareText = useMemo(() => {
    if (!news) return "";
    const excerpt = news.excerpt || "";
    return `${news.title}\n\n${excerpt}`;
  }, [news]);

  // Parse HTML content safely
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  // Format date nicely with error handling
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";

    try {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Date not available";
      }

      return date.toLocaleDateString("en-US", options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date not available";
    }
  };

  // Handle Facebook share manually for better control
  const handleFacebookShare = () => {
    if (!shareUrl) return;

    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}&quote=${encodeURIComponent(shareText)}&hashtag=${encodeURIComponent(
      "#VolleyballNepal"
    )}`;

    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  // Handle Twitter share manually
  const handleTwitterShare = () => {
    if (!shareUrl) return;

    const twitterText = `${news?.title || ""}\n${shareUrl}`;
    const hashtags =
      news?.tags && Array.isArray(news.tags) && news.tags.length > 0
        ? news.tags.join(",")
        : "volleyball,nepal";
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      twitterText
    )}&hashtags=${encodeURIComponent(hashtags)}`;

    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  // Handle LinkedIn share manually
  const handleLinkedInShare = () => {
    if (!shareUrl) return;

    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`;

    window.open(linkedInUrl, "_blank", "width=600,height=400");
  };

  // Handle WhatsApp share manually
  const handleWhatsAppShare = () => {
    if (!shareUrl) return;

    const whatsappText = `${news?.title || ""}\n\n${
      news?.excerpt || ""
    }\n\n${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      whatsappText
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  // Get image source with fallback
  const imageSrc = imageError
    ? "/images/placeholder-news.jpg"
    : news?.image || "/images/placeholder-news.jpg";

  // Validate news data - AFTER all hooks
  if (!news) {
    return (
      <div className="bg-gradient-to-b from-white to-blue-50 text-gray-800 min-h-screen pt-20 pb-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-10 text-center">
            <p className="text-gray-500 text-lg">News article not found.</p>
            <button
              onClick={() => router.push("/News")}
              className="mt-6 bg-[#10316b] text-white font-semibold py-2 px-6 rounded-lg transition duration-300 hover:bg-[#0b8457]"
            >
              ← Back to News
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 text-gray-800 min-h-screen pt-20 pb-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto animate-fade-in">
        {/* Article Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Featured Image */}
          <div className="relative h-72 md:h-96 overflow-hidden bg-gray-200">
            <Image
              src={imageSrc}
              alt={news.title || "News article"}
              fill
              className="object-cover transition duration-700 ease-in-out hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <p className="text-white/80 text-sm font-medium inline-block bg-[#10316b]/80 px-3 py-1 rounded-full">
                  {formatDate(news.createdAt)}
                </p>
                {news.author && (
                  <p className="text-white/80 text-sm font-medium inline-block bg-[#0b8457]/80 px-3 py-1 rounded-full">
                    By {news.author}
                  </p>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {news.title || "Untitled Article"}
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
                <p className="text-gray-500 italic">No content available.</p>
              )}
            </div>

            {/* Enhanced Social Sharing with manual handlers */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-12 pt-6 border-t border-gray-200 gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Share this article:
                </span>

                {/* Only render share buttons when URL is available */}
                {isMounted && shareUrl ? (
                  <div
                    className="flex flex-wrap gap-2"
                    suppressHydrationWarning
                  >
                    {/* Facebook - Manual handler */}
                    <button
                      onClick={handleFacebookShare}
                      className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer"
                      title="Share on Facebook"
                      aria-label="Share on Facebook"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span className="hidden sm:inline">Facebook</span>
                    </button>

                    {/* Twitter - Manual handler */}
                    <button
                      onClick={handleTwitterShare}
                      className="flex items-center gap-2 bg-sky-500 text-white px-3 py-2 rounded-lg hover:bg-sky-600 transition-colors text-sm cursor-pointer"
                      title="Share on Twitter"
                      aria-label="Share on Twitter"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                      <span className="hidden sm:inline">Twitter</span>
                    </button>

                    {/* LinkedIn - Manual handler */}
                    <button
                      onClick={handleLinkedInShare}
                      className="flex items-center gap-2 bg-blue-700 text-white px-3 py-2 rounded-lg hover:bg-blue-800 transition-colors text-sm cursor-pointer"
                      title="Share on LinkedIn"
                      aria-label="Share on LinkedIn"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <span className="hidden sm:inline">LinkedIn</span>
                    </button>

                    {/* WhatsApp - Manual handler */}
                    <button
                      onClick={handleWhatsAppShare}
                      className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm cursor-pointer"
                      title="Share on WhatsApp"
                      aria-label="Share on WhatsApp"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>

                    {/* ShareButton Component for Copy Link */}
                    <ShareButton
                      title={news.title}
                      slug={news.id || news._id}
                    />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-2 bg-gray-300 text-gray-500 px-3 py-2 rounded-lg text-sm animate-pulse">
                      Loading share options...
                    </div>
                  </div>
                )}
              </div>

              {/* Back to News List Button */}
              <button
                onClick={() => router.push("/News")}
                className="bg-[#10316b] text-white font-semibold py-2 px-6 rounded-lg transition duration-300 hover:bg-[#0b8457] focus:outline-none focus:ring-2 focus:ring-[#10316b] focus:ring-opacity-50 shadow-md whitespace-nowrap"
                aria-label="Back to News List"
              >
                ← Back to News
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailsClient;

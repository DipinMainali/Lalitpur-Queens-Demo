import { notFound } from "next/navigation";
import NewsDetailsClient from "@/components/NewsDetailsClient";

// Utility function to generate excerpt from HTML content
function generateExcerpt(htmlContent, maxLength = 160) {
  if (!htmlContent) return "Read this interesting news article";

  const plainText = htmlContent
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&nbsp;/g, " ") // Replace &nbsp; with spaces
    .replace(/&amp;/g, "&") // Decode HTML entities
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim();

  if (plainText.length <= maxLength) return plainText;

  return plainText.substring(0, maxLength).trim() + "...";
}

// Fetch news data with improved error handling
async function getNews(id) {
  try {
    // Validate ID
    if (!id || typeof id !== "string") {
      console.error("Invalid news ID:", id);
      return null;
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL;

    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeoutt
    const res = await fetch(`${baseUrl}/api/news/${encodeURIComponent(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      next: {
        revalidate: 3600, // Cache for 1 hour
        tags: [`news-${id}`], // For on-demand revalidation
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 404) {
        console.log(`News not found for ID: ${id}`);
        return null;
      }
      console.error(`HTTP error! status: ${res.status} for news ID: ${id}`);
      return null;
    }

    const data = await res.json();

    // Validate response structure
    if (!data.success || !data.data) {
      console.error("Invalid API response structure:", data);
      return null;
    }

    // Add excerpt to news data
    const newsWithExcerpt = {
      ...data.data,
      excerpt: generateExcerpt(data.data.content),
    };

    return newsWithExcerpt;
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Fetch timeout for news ID:", id);
    } else {
      console.error("Error in getNews for ID:", id, error);
    }
    return null;
  }
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const news = await getNews(resolvedParams.id);
    console.log(news);

    if (!news) {
      return {
        title: "News Not Found - Volleyball Nepal",
        description: "The requested news article was not found.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    // Get base URL for absolute URLs - prioritize production URL
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXTAUTH_URL ||
      "https://www.rupsesports.com";

    // Construct absolute page URL for Open Graph and canonical
    const pageUrl = `${baseUrl}/News/${resolvedParams.id}`;

    // Use generated excerpt for description
    const description = news.excerpt || generateExcerpt(news.content);

    // Construct full image URL - ensure it's absolute
    let imageUrl = news.image;
    if (!imageUrl?.startsWith("http")) {
      imageUrl = `${baseUrl}${
        news.image?.startsWith("/") ? news.image : "/" + news.image
      }`;
    }

    // Format date for Open Graph
    const publishedTime =
      news.createdAt instanceof Date
        ? news.createdAt.toISOString()
        : new Date(news.createdAt).toISOString();

    return {
      metadataBase: new URL(baseUrl),
      title: `${news.title}`,
      description: description,
      keywords: news.tags?.join(", ") || "volleyball, news, Nepal, sports",
      authors: [{ name: news.author || "Volleyball Nepal" }],
      openGraph: {
        title: news.title,
        description: description,
        url: pageUrl,
        siteName: "Volleyball Nepal",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: news.title,
            type: "image/jpeg",
          },
        ],
        type: "article",
        publishedTime: publishedTime,
        authors: [news.author || "Volleyball Nepal"],
        tags: news.tags || ["volleyball", "sports"],
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title: news.title,
        description: description,
        images: [imageUrl],
        creator: "@volleyballnepal",
        site: "@volleyballnepal",
      },
      alternates: {
        canonical: pageUrl,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "News - Volleyball Nepal",
      description: "Latest volleyball news and updates from Nepal",
    };
  }
}

// Generate static params for better performance
export async function generateStaticParams() {
  // Only generate static params in production for better performance
  if (process.env.NODE_ENV !== "production") {
    return [];
  }

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXTAUTH_URL ||
      "https://www.rupsesports.com";
    const res = await fetch(`${baseUrl}/api/news`, {
      next: {
        revalidate: 3600, // 1 hour
        tags: ["news-list"],
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch news list for static generation");
      return [];
    }

    const data = await res.json();

    if (!data.success || !Array.isArray(data.data)) {
      console.error("Invalid data structure for static generation");
      return [];
    }

    // Generate params for all published news
    const params = data.data
      .filter((news) => news.status === "published") // Only published news
      .map((news) => ({
        id: news.id?.toString() || news._id?.toString(),
      }))
      .filter((param) => param.id); // Filter out undefined IDs

    console.log(`Generating static params for ${params.length} news articles`);
    return params;
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Add revalidation for on-demand ISR
export const revalidate = 3600; // 1 hour

// Main page component with enhanced error handling
export default async function NewsDetailPage({ params }) {
  try {
    const resolvedParams = await params;

    if (!resolvedParams?.id) {
      console.error("No ID parameter provided");
      notFound();
    }

    const news = await getNews(resolvedParams.id);

    if (!news) {
      console.log(`News not found for ID: ${resolvedParams.id}`);
      notFound();
    }

    // Check if news is published (if status field exists)
    if (news.status && news.status !== "published") {
      console.log(`News is not published. Status: ${news.status}`);
      notFound();
    }

    return <NewsDetailsClient news={news} />;
  } catch (error) {
    console.error("Error in NewsDetailPage:", error);
    notFound();
  }
}

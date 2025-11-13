import { notFound } from "next/navigation";
import NewsDetailsClient from "@/components/NewsDetailsClient";
import News from "@/models/news.model";
import dbConnection from "@/utils/dbconnection";

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

// Fetch news data directly from database (bypassing API route)
async function getNews(id) {
  try {
    // Validate ID
    if (!id || typeof id !== "string") {
      console.error("Invalid news ID:", id);
      return null;
    }

    console.log("Fetching news directly from database for ID:", id);

    // Connect to database
    await dbConnection();

    // Fetch news directly from database
    const news = await News.findOne({ _id: id }).lean();

    if (!news) {
      console.log(`News not found for ID: ${id}`);
      return null;
    }

    // Convert MongoDB document to plain object and handle _id
    const newsData = {
      ...news,
      _id: news._id.toString(),
      id: news._id.toString(),
      createdAt: news.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: news.updatedAt?.toISOString() || new Date().toISOString(),
    };

    // Add excerpt to news data
    const newsWithExcerpt = {
      ...newsData,
      excerpt: generateExcerpt(newsData.content),
    };

    console.log("Successfully fetched news:", newsWithExcerpt.title);
    return newsWithExcerpt;
  } catch (error) {
    console.error("Error in getNews for ID:", id, error);
    return null;
  }
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const news = await getNews(resolvedParams.id);

    if (!news) {
      return {
        title: "News Not Found - Lalitpur Queens",
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
      process.env.NEXT_PUBLIC_MAIN_URL ||
      process.env.NEXTAUTH_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    // Construct absolute page URL for Open Graph and canonical
    const pageUrl = `${baseUrl}/News/${resolvedParams.id}`;

    // Use generated excerpt for description
    const description = news.excerpt || generateExcerpt(news.content);

    // Construct full image URL - ensure it's absolute
    let imageUrl = news.image;
    if (imageUrl && !imageUrl.startsWith("http")) {
      imageUrl = `${baseUrl}${
        imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl
      }`;
    } else if (!imageUrl) {
      imageUrl = `${baseUrl}/images/placeholder-news.jpg`;
    }

    // Format date for Open Graph
    const publishedTime = news.createdAt
      ? new Date(news.createdAt).toISOString()
      : new Date().toISOString();

    return {
      metadataBase: new URL(baseUrl),
      title: `${news.title} - Lalitpur Queens`,
      description: description,
      keywords:
        news.tags?.join(", ") ||
        "volleyball, news, Nepal, sports, Lalitpur Queens",
      authors: [{ name: news.author || "Lalitpur Queens" }],
      openGraph: {
        title: news.title,
        description: description,
        url: pageUrl,
        siteName: "Lalitpur Queens",
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
        authors: [news.author || "Lalitpur Queens"],
        tags: news.tags || ["volleyball", "sports"],
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title: news.title,
        description: description,
        images: [imageUrl],
        creator: "@lalitpurqueens",
        site: "@lalitpurqueens",
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
      title: "News - Lalitpur Queens",
      description: "Latest volleyball news and updates from Lalitpur Queens",
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
    console.log("Generating static params for news articles");

    // Connect to database
    await dbConnection();

    // Fetch all published news directly from database
    const newsList = await News.find({ status: "published" })
      .select("_id")
      .lean();

    // Generate params for all published news
    const params = newsList.map((news) => ({
      id: news._id.toString(),
    }));

    console.log(`Generating static params for ${params.length} news articles`);
    return params;
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Dynamic params - allow dynamic routes
export const dynamicParams = true;

// Use dynamic rendering for fresh data
export const dynamic = "force-dynamic";

// Revalidate every 60 seconds
export const revalidate = 60;

// Main page component with enhanced error handling
export default async function NewsDetailPage({ params }) {
  try {
    const resolvedParams = await params;

    if (!resolvedParams?.id) {
      console.error("No ID parameter provided");
      notFound();
    }

    console.log("Fetching news for ID:", resolvedParams.id);
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

    console.log("Rendering news details for:", news.title);
    return <NewsDetailsClient news={news} />;
  } catch (error) {
    console.error("Error in NewsDetailPage:", error);
    notFound();
  }
}

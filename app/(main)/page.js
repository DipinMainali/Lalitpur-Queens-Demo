"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import HeroSection from "@/components/HeroSection";
import JourneySection from "@/components/Journey";
import { MatchesSection } from "@/components/Matches";
import { motion } from "framer-motion";
import TeamBehindTeam from "@/components/TeamBehindTeam";
import ImageReact from "@/components/Gallery";
import { useRouter } from "next/navigation";
import MarqueePlayer from "@/components/Marquee";
import PointsTable from "@/components/PointsTable"; // Import PointsTable component
export default function Home() {
  const router = useRouter();

  //multiple images in the hero section
  const images = [
    "/images/hero-bg.png",
    "/images/hero-bg2.png",
    "/images/hero-bg3.png",
  ];

  // State for upcoming matches
  const [upcomingMatches, setUpcomingMatches] = useState([]);

  // State for latest match results
  const [latestResults, setLatestResults] = useState([]);

  // State for the number of slides to show in the carousel
  const [slidesRender, setSlidesRender] = useState(1);

  // State for news items
  const [newsItems, setNews] = useState([]);

  // State for players data
  const [players, setPlayers] = useState([]);

  // State for points table data
  const [pointsTable, setPointsTable] = useState([]);

  // State for current player in marquee
  const [currentPlayer, setCurrentPlayer] = useState(0);

  // Fetch matches data when the component mounts
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("/api/matches");
        const jsonRes = await res.json();

        if (jsonRes.success) {
          // Filter upcoming matches (Scheduled, Postponed)
          const upMatches = jsonRes.data.filter(
            (match) =>
              match.matchStatus === "Scheduled" ||
              match.matchStatus === "Postponed" ||
              match.matchStatus === "In Progress"
          );

          // Filter completed matches
          const results = jsonRes.data.filter(
            (match) => match.matchStatus === "Completed"
          );

          // Sort upcoming matches by date (earliest first)
          upMatches.sort(
            (a, b) => new Date(a.matchDateTime) - new Date(b.matchDateTime)
          );

          // Sort results by date (most recent first)
          results.sort(
            (a, b) => new Date(b.matchDateTime) - new Date(a.matchDateTime)
          );

          setUpcomingMatches(upMatches);
          setLatestResults(results);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error("Error fetching matches:", err);
      }
    };

    fetchMatches();
  }, []);

  // Fetch news data when the component mounts
  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Updated to only fetch published news
        const res = await fetch("/api/news?status=published");
        const jsonRes = await res.json();
        if (jsonRes.success) {
          setNews(jsonRes.data);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
      }
    };

    fetchNews();
  }, []);

  // Fetch players data when the component mounts
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch("/api/players");
        const jsonRes = await res.json();

        if (jsonRes.success) {
          const featuredPlayers = jsonRes.data.filter(
            (player) => player.featured
          );

          setPlayers(featuredPlayers);

          // Set slidesRender based on the number of players fetched
          if (featuredPlayers.length >= 3) {
            setSlidesRender(3);
          } else {
            setSlidesRender(featuredPlayers.length);
          }
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error("Error fetching players:", err);
      }
    };

    fetchPlayers();
  }, []);

  // Fetch points table data when the component mounts
  useEffect(() => {
    const fetchPointsTable = async () => {
      try {
        const res = await fetch("/api/standings");
        const jsonRes = await res.json();

        if (jsonRes.success) {
          setPointsTable(jsonRes.data);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error("Error fetching standings:", err);
      }
    };

    fetchPointsTable();
  }, []);

  // Format date as "May 15, 2024"
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Marquee player data
  const marqueePlayer = {
    image: "/images/Salina-Shrestha-marquee.png",
    firstName: "Salina ",
    lastName: "Shrestha",
    jerseyNumber: 10,
    position: "Libero",
  };

  // Updated Carousel Settings for Responsiveness
  const carouselSettings = {
    dots: false,
    arrows: true,
    infinite: true,
    slidesToShow: slidesRender,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 4000,
    cssEase: "cubic-bezier(0.2, 0, 0, 1)",

    // Responsive breakpoints for different screen sizes
    responsive: [
      {
        breakpoint: 1024, // Tablet and smaller devices
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768, // Smaller tablets and large mobile devices
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // Mobile devices
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      {/* Hero Section */}
      <HeroSection images={images} />

      {/* Matches Section */}
      <MatchesSection
        upcomingMatches={upcomingMatches}
        latestResults={latestResults}
      />

      {/* Marquee Player Section */}
      <MarqueePlayer />
      {/* Our Queens Section */}
      <section className="py-28 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="container mx-auto px-3">
          {/* Section Heading with Accent */}
          <div className="relative mb-16 text-center">
            <h2 className="text-3xl sm:text-5xl font-bold text-text-primary inline-block relative">
              Our Queens
              <span className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary"></span>
            </h2>
            <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
              Meet the talented athletes who represent Lalitpur Queens with
              pride.
            </p>
          </div>

          {/* Player Showcase using Carousel */}
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Player Details Section - Left Side */}
            <div className="w-full lg:w-1/3 space-y-6 order-2 lg:order-1">
              {players.length > 0 && (
                <div
                  className="bg-gradient-to-br from-white to-brand-primary/5 p-8 rounded-2xl shadow-lg border border-background backdrop-blur-sm relative overflow-hidden group"
                  style={{ minHeight: "450px" }}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 overflow-hidden opacity-10 z-0">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-56 h-56 bg-brand-secondary rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
                  </div>

                  {/* Crown Icon with Animation */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 text-text-primary group-hover:scale-110 transition-transform duration-300"
                      >
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      </svg>
                    </div>
                  </div>

                  {/* Player Content with Animation */}
                  <div className="animate-fade-in pt-2 z-10 relative">
                    {/* Player Name with Animation */}
                    <div
                      key={`player-name-${currentPlayer}`}
                      className="animate-fade-in-up overflow-hidden"
                    >
                      <h3 className="text-2xl sm:text-3xl font-bold mb-3">
                        <span className="text-brand-primary">
                          {players[currentPlayer]?.firstName}
                        </span>{" "}
                        <span className="text-brand-secondary">
                          {players[currentPlayer]?.lastName}
                        </span>
                      </h3>
                    </div>

                    {/* Player Stats Badges */}
                    <div
                      key={`player-tags-${currentPlayer}`}
                      className="flex flex-wrap items-center gap-2 mb-5 animate-fade-in-up"
                      style={{ animationDelay: "100ms" }}
                    >
                      <span className="inline-block bg-accent text-text-primary text-sm font-bold px-3 py-1 rounded-full shadow-sm transform transition hover:scale-105 hover:shadow">
                        #{players[currentPlayer]?.jerseyNumber}
                      </span>
                      <span className="inline-block bg-gradient-to-r from-brand-primary/20 to-brand-primary/10 text-brand-primary text-sm font-medium py-1 px-4 rounded-full shadow-sm transform transition hover:scale-105 hover:shadow">
                        {players[currentPlayer]?.position}
                      </span>
                      <span className="inline-block bg-background text-text-secondary text-sm py-1 px-4 rounded-full shadow-sm transform transition hover:scale-105 hover:shadow">
                        {Math.floor(Math.random() * 10) + 20} yrs
                      </span>
                    </div>

                    {/* Player Bio with Animation */}
                    <div
                      key={`player-bio-${currentPlayer}`}
                      className="relative animate-fade-in-up"
                      style={{ animationDelay: "200ms" }}
                    >
                      <p className="text-text-secondary text-base mb-6 leading-relaxed">
                        {players[currentPlayer]?.bio
                          ? players[currentPlayer].bio
                              .replace(/<[^>]*>/g, "")
                              .slice(0, 150) + "..."
                          : `Our ${players[currentPlayer]?.position} brings exceptional skills and
            leadership to the court, inspiring teammates with
            dedication and athleticism.`}
                      </p>

                      {/* Decorative element */}
                      <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-brand-primary to-brand-secondary rounded-full opacity-50"></div>
                    </div>

                    {/* Player Stats with Animation */}
                    <div
                      key={`player-stats-${currentPlayer}`}
                      className="animate-fade-in-up"
                      style={{ animationDelay: "300ms" }}
                    >
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white rounded-xl shadow-lg p-4 transform transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-brand-primary/5">
                          <div className="text-3xl font-bold text-brand-primary">
                            {Math.floor(Math.random() * 100) + 100}
                          </div>
                          <div className="text-xs font-medium text-text-secondary">
                            POINTS
                          </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-4 transform transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-brand-primary/5">
                          <div className="text-3xl font-bold text-brand-primary">
                            {Math.floor(Math.random() * 15) + 75}%
                          </div>
                          <div className="text-xs font-medium text-text-secondary">
                            ACCURACY
                          </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-4 transform transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-brand-primary/5">
                          <div className="text-3xl font-bold text-brand-primary">
                            {Math.floor(Math.random() * 20) + 5}
                          </div>
                          <div className="text-xs font-medium text-text-secondary">
                            MATCHES
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* View Profile Button */}
                    <div
                      key={`player-action-${currentPlayer}`}
                      className="mt-6 text-center animate-fade-in-up"
                      style={{ animationDelay: "400ms" }}
                    >
                      <Link
                        href={`/Team/${players[currentPlayer]?._id}`}
                        className="inline-flex items-center gap-2 bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white py-2 px-4 rounded-lg transition-all duration-300 text-sm font-medium"
                      >
                        <span>View Full Profile</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
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
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Players Carousel - Right Side */}
            <div className="w-full lg:w-2/3 order-1 lg:order-2 relative h-[550px]">
              {/* Crown Base Shape */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[600px] h-[300px] border-t-8 border-accent opacity-20 rounded-t-full"></div>

              {/* Carousel Wrapper */}
              <div className="relative z-10 py-10 px-4">
                <Slider
                  {...carouselSettings}
                  className="queens-carousel"
                  beforeChange={(oldIndex, newIndex) =>
                    setCurrentPlayer(newIndex)
                  }
                >
                  {players.map((player, index) => (
                    <div key={player._id} className="px-4">
                      <div className="flex flex-col items-center transform transition-all duration-500 hover:scale-105">
                        <div className="relative w-60 h-60 rounded-full overflow-hidden border-4 border-white shadow-xl mb-6">
                          <Image
                            src={player.image}
                            alt={`${player.firstName} ${player.lastName}`}
                            fill
                            sizes="(max-width: 768px) 180px, 240px"
                            className="object-cover"
                          />
                        </div>
                        <div className="bg-white px-5 py-3 rounded-full shadow text-center min-w-[200px]">
                          <h4 className="font-bold text-lg">
                            <span className="text-brand-primary">
                              {player.firstName}
                            </span>{" "}
                            <span className="text-brand-secondary">
                              {player.lastName}
                            </span>
                          </h4>
                          <div className="flex items-center justify-center gap-2 mt-1">
                            <span className="inline-block bg-accent text-text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                              #{player.jerseyNumber}
                            </span>
                            <span className="text-sm text-text-secondary">
                              {player.position}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>

              {/* Team Logo - Repositioned lower */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-36 h-36 rounded-full bg-white shadow-xl flex items-center justify-center p-2 border-4 border-background z-20">
                <Image
                  src="/images/Lalitpur-queens-logo.png"
                  alt="Lalitpur Queens"
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Button for Full Squad */}
          <div className="text-center mt-16 relative z-30">
            <Link
              href="/Team"
              className="bg-brand-primary text-white py-4 px-10 rounded-full text-lg font-semibold hover:bg-brand-secondary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block"
              onClick={(e) => {
                e.stopPropagation();
                router.push("/Team");
              }}
            >
              View Full Squad
            </Link>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <JourneySection />

      {/* Team Behind Team Section */}
      <TeamBehindTeam />

      {/* Points Table Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="relative mb-14 text-center">
            <h2 className="text-4xl font-bold text-text-primary inline-block relative">
              League Standings
              <span className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary"></span>
            </h2>
            <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
              Check out how Lalitpur Queens are performing in the league
            </p>
          </div>

          <PointsTable data={pointsTable} showOnlyActive={true} />
        </div>
      </section>

      {/* Latest News Section - Hierarchical Grid with Animations */}
      <section className="py-20 bg-background relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary rounded-full opacity-10"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-secondary rounded-full opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header with Animated Bar */}
          <div className="relative mb-14 text-center">
            <h2 className="text-4xl font-bold text-text-primary inline-block relative">
              Latest News
              <span className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary"></span>
            </h2>
            <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
              Stay updated with the latest stories, announcements, and
              achievements from the Lalitpur Queens.
            </p>
          </div>

          {newsItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Featured News (Takes up more space) */}
              {newsItems.length > 0 && (
                <motion.div
                  className="lg:col-span-8 lg:row-span-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div
                    className="h-full group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
                    onClick={() => router.push(`/News/${newsItems[0]._id}`)}
                  >
                    <div className="relative h-72 overflow-hidden">
                      <Image
                        src={
                          newsItems[0].image || "/images/news-placeholder.jpg"
                        }
                        alt={newsItems[0].title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                        priority
                        className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-primary to-transparent opacity-70"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="flex items-center mb-3">
                          <span className="bg-accent text-text-primary text-xs font-bold px-3 py-1 rounded-full">
                            Featured
                          </span>
                          <span className="ml-3 text-xs opacity-90">
                            {new Date(
                              newsItems[0].createdAt
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors duration-300">
                          {newsItems[0].title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-text-secondary line-clamp-3">
                        {newsItems[0].content
                          .replace(/<p>|<\/p>|&nbsp;/g, "")
                          .slice(0, 180)}
                        ...
                      </p>
                      <div className="mt-6 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="bg-brand-primary h-8 w-8 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              LQ
                            </span>
                          </div>
                          <span className="ml-2 text-sm text-text-secondary">
                            {newsItems[0].author || "Admin"}
                          </span>
                        </div>
                        <button className="flex items-center gap-2 text-brand-secondary font-medium text-sm group-hover:text-brand-primary transition-colors duration-300">
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
                  </div>
                </motion.div>
              )}

              {/* Secondary News Articles - First Row */}
              {newsItems.slice(1, 3).map((news, index) => (
                <motion.div
                  key={news._id}
                  className="lg:col-span-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                >
                  <div
                    className="h-full group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1"
                    onClick={() => router.push(`/News/${news._id}`)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={news.image || "/images/news-placeholder.jpg"}
                        alt={news.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300"></div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 text-text-primary text-xs font-semibold px-3 py-1 rounded-full">
                          {news.tags && news.tags.length > 0
                            ? news.tags[0]
                            : "News"}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col h-[calc(100%-12rem)]">
                      <div className="mb-3 text-xs text-text-secondary">
                        {new Date(news.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 text-text-primary group-hover:text-brand-primary transition-colors duration-300">
                        {news.title}
                      </h3>
                      <p className="text-text-secondary text-sm line-clamp-2 mb-4 flex-grow">
                        {news.content
                          .replace(/<p>|<\/p>|&nbsp;/g, "")
                          .slice(0, 100)}
                        ...
                      </p>
                      <button className="flex items-center gap-1 text-brand-secondary text-sm font-medium group-hover:text-brand-primary transition-colors duration-300 mt-auto">
                        Read Article
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 transform group-hover:translate-x-1 transition-transform duration-300"
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
              ))}

              {/* Secondary News Articles - Second Row */}
              {newsItems.slice(3, 6).map((news, index) => (
                <motion.div
                  key={news._id}
                  className="lg:col-span-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + 0.1 * index }}
                >
                  <div
                    className="h-full group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1"
                    onClick={() => router.push(`/News/${news._id}`)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={news.image || "/images/news-placeholder.jpg"}
                        alt={news.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300"></div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 text-text-primary text-xs font-semibold px-3 py-1 rounded-full">
                          {news.tags && news.tags.length > 0
                            ? news.tags[0]
                            : "News"}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col h-[calc(100%-12rem)]">
                      <div className="mb-3 text-xs text-text-secondary">
                        {new Date(news.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 text-text-primary group-hover:text-brand-primary transition-colors duration-300">
                        {news.title}
                      </h3>
                      <p className="text-text-secondary text-sm line-clamp-2 mb-4 flex-grow">
                        {news.content
                          .replace(/<p>|<\/p>|&nbsp;/g, "")
                          .slice(0, 100)}
                        ...
                      </p>
                      <button className="flex items-center gap-1 text-brand-secondary text-sm font-medium group-hover:text-brand-primary transition-colors duration-300 mt-auto">
                        Read Article
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 transform group-hover:translate-x-1 transition-transform duration-300"
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
              ))}
            </div>
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
                No News Articles Yet
              </h3>
              <p className="text-text-secondary mb-6">
                Stay tuned for exciting updates and announcements!
              </p>
            </div>
          )}

          {/* View More News Button */}
          {newsItems.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/News"
                className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white py-3 px-8 rounded-full transition-all duration-300 shadow hover:shadow-lg transform hover:-translate-y-1"
              >
                <span className="font-semibold">View All News</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Galllery Section */}
      <ImageReact />
    </>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import MatchCard from "@/components/MatchCard";
import NewsCard from "@/components/NewsCard";
import Slider from "react-slick";
import TeamMember from "@/components/TeamMember";
import HeroSection from "@/components/HeroSection";
import JourneySection from "@/components/Journey";
import { MatchesSection } from "@/components/Matches";
import TeamBehindTeam from "@/components/TeamBehindTeam";
import ImageReact from "@/components/Gallery";

export default function Home() {
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
        const res = await fetch("/api/news");
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
              pride and passion
            </p>
          </div>

          {/* Player Showcase using Carousel */}
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Player Details Section - Left Side */}
            <div className="w-full lg:w-1/3 space-y-6 order-2 lg:order-1">
              {players.length > 0 && (
                <div className="bg-brand-primary bg-opacity-5 p-8 rounded-2xl shadow-lg transform transition-all duration-500 border border-background relative">
                  {/* Crown Icon */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 text-text-primary"
                      >
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      </svg>
                    </div>
                  </div>

                  <div className="animate-fade-in pt-2">
                    <h3 className="text-2xl font-bold mb-3">
                      <span className="text-brand-primary">
                        {players[0]?.firstName}
                      </span>{" "}
                      <span className="text-brand-secondary">
                        {players[0]?.lastName}
                      </span>
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-block bg-accent text-text-primary text-sm font-bold px-3 py-1 rounded-full">
                        #{players[0]?.jerseyNumber}
                      </span>
                      <span className="inline-block bg-brand-primary bg-opacity-10 text-brand-primary text-sm font-medium py-1 px-4 rounded-full">
                        {players[0]?.position}
                      </span>
                    </div>
                    <p className="text-text-secondary text-base mb-6 leading-relaxed">
                      Our {players[0]?.position} brings exceptional skills and
                      leadership to the court, inspiring teammates with
                      dedication and athleticism.
                    </p>
                    <div className="flex justify-between gap-4 bg-white p-4 rounded-xl shadow-inner">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-brand-primary">
                          195
                        </div>
                        <div className="text-xs font-medium text-text-secondary">
                          POINTS
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-brand-primary">
                          87%
                        </div>
                        <div className="text-xs font-medium text-text-secondary">
                          ACCURACY
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-brand-primary">
                          24
                        </div>
                        <div className="text-xs font-medium text-text-secondary">
                          MATCHES
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Players Carousel - Right Side */}
            <div className="w-full lg:w-2/3 order-1 lg:order-2 relative h-[450px]">
              {/* Crown Base Shape */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[500px] h-[250px] border-t-8 border-accent opacity-20 rounded-t-full"></div>

              {/* Carousel Wrapper */}
              <div className="relative z-10 py-10 px-4">
                <Slider {...carouselSettings} className="queens-carousel">
                  {players.map((player, index) => (
                    <div key={player._id} className="px-4">
                      <div className="flex flex-col items-center transform transition-all duration-500 hover:scale-105">
                        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl mb-4">
                          <Image
                            src={player.image}
                            alt={`${player.firstName} ${player.lastName}`}
                            fill
                            sizes="(max-width: 768px) 120px, 192px"
                            className="object-cover"
                          />
                        </div>
                        <div className="bg-white px-4 py-2 rounded-full shadow text-center min-w-[180px]">
                          <h4 className="font-bold">
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

              {/* Team Logo */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-36 h-36 rounded-full bg-white shadow-xl flex items-center justify-center p-2 border-4 border-background z-20">
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
          <div className="text-center mt-16">
            <Link
              href="/Team"
              className="bg-brand-primary text-white py-4 px-10 rounded-full text-lg font-semibold hover:bg-brand-secondary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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

      {/* Latest News Section */}
      <section className="py-16 bg-brand-secondary bg-opacity-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-text-primary">
            Latest News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsItems.slice(0, 3).map((news) => (
              <NewsCard
                key={news._id}
                id={news._id}
                title={news.title}
                excerpt={news.content
                  .replace(/<p>|<\/p>|&nbsp;/g, "")
                  .slice(0, 100)
                  .concat("...")}
                image={news.image}
                date={news.date}
              />
            ))}
          </div>

          {/*load more button */}
          <div className="text-center mt-8">
            <Link
              href="/News"
              className="bg-brand-primary text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-brand-secondary transition duration-300"
            >
              View More News
            </Link>
          </div>
        </div>
      </section>
      <section className="py-12  bg-queens-white bg-opacity-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Points Table */}
            <div className="w-full md:w-2/3">
              <h2 className="text-3xl font-bold mb-8 text-center text-queens-midnight">
                Points Table
              </h2>
              <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="table-auto w-full text-left bg-white border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-brand-primary text-white">
                      <th className="px-4 py-3 font-semibold">Team</th>
                      <th className="px-4 py-3 font-semibold">P</th>
                      <th className="px-4 py-3 font-semibold">W</th>
                      <th className="px-4 py-3 font-semibold">L</th>
                      <th className="px-4 py-3 font-semibold">D</th>
                      <th className="px-4 py-3 font-semibold">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pointsTable.map((team, index) => (
                      <tr
                        key={team._id}
                        className={`border-t ${
                          index % 2 === 0
                            ? "bg-brand-secondary bg-opacity-10"
                            : "bg-white"
                        } hover:bg-brand-secondary hover:bg-opacity-20 transition-colors duration-200`}
                      >
                        <td className="px-4 py-3 font-medium text-queens-midnight">
                          {team.team.name}
                        </td>
                        <td className="px-4 py-3 text-center text-queens-midnight">
                          {team.played}
                        </td>
                        <td className="px-4 py-3 text-center text-queens-midnight">
                          {team.won}
                        </td>
                        <td className="px-4 py-3 text-center text-queens-midnight">
                          {team.lost}
                        </td>
                        <td className="px-4 py-3 text-center text-queens-midnight">
                          {team.drawn}
                        </td>
                        <td className="px-4 py-3 text-center text-queens-midnight">
                          {team.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Marquee Player */}
            <div className="w-full md:w-1/3 mt-0 px-4 md:px-0">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 md:mb-10 text-center text-queens-midnight tracking-wider">
                Marquee Player
              </h2>
              <div className="flex flex-col items-center bg-gradient-to-r from-brand-primary to-text-primary text-white rounded-xl p-6 md:p-8 shadow-2xl transition-transform transform hover:scale-105">
                <Image
                  src="/images/Salina-Shrestha-Marquee.png"
                  alt={`${marqueePlayer.firstName} ${marqueePlayer.lastName}`}
                  width={150}
                  height={150}
                  className="w-full max-w-[150px] md:max-w-[200px] rounded-full border-4 md:border-8 border-brand-secondary shadow-lg"
                />
                <h3 className="text-2xl md:text-3xl font-extrabold mt-4 md:mt-6 tracking-tight drop-shadow-lg">
                  {marqueePlayer.firstName} {marqueePlayer.lastName}
                </h3>
                <p className="text-lg md:text-xl font-semibold mt-2 italic opacity-90">
                  #{marqueePlayer.jerseyNumber} - {marqueePlayer.position}
                </p>
                <div className="mt-4 text-sm text-center">
                  <p className="font-light italic opacity-75">
                    I rise above with every dig and dive.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galllery Section */}
      <ImageReact />
    </>
  );
}

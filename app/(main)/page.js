"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import MatchCard from "@/components/MatchCard";
import NewsCard from "@/components/NewsCard";
import Slider from "react-slick";
import TeamMember from "@/components/TeamMember";

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
          const upMatches = jsonRes.data.filter(
            (match) => match.status === "Pending"
          );
          const results = jsonRes.data.filter(
            (match) => match.status === "Completed"
          );

          upMatches.sort((a, b) => new Date(b.date) - new Date(a.date));
          results.sort((a, b) => new Date(b.date) - new Date(a.date));

          setUpcomingMatches(upMatches);
          setLatestResults(results);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
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
          console.log("news", newsItems);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchNews();
    console.log();
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
        console.error(err);
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
        console.error(err);
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
    slidesToShow: slidesRender, // This can be dynamically set based on screen size
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
          slidesToShow: 3, // Show 3 slides on devices smaller than 1024px
        },
      },
      {
        breakpoint: 768, // Smaller tablets and large mobile devices
        settings: {
          slidesToShow: 2, // Show 2 slides on devices smaller than 768px
        },
      },
      {
        breakpoint: 640, // Mobile devices
        settings: {
          slidesToShow: 1, // Show 1 slide on devices smaller than 640px
        },
      },
    ],
  };

  return (
    <>
      <section className="relative shadow-xl   shadow-gray-400 text-queens-white py-24 md:py-32 ">
        <div className="inset-0 bg-queens-white opacity-50 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Volleyball court"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="relative container mx-auto px-4 text-center ">
          <h1 className="text-4xl md:text-6xl text-queens-midnight font-bold mb-4">
            Lalitpur Queens
          </h1>
          <div className="relative flex items-center justify-center container mx-auto px-4 text-center">
            <div className="slider-content animate-fadeInRight space-y-6">
              <h3 className="text-4xl md:text-4xl font-extrabold leading-tigh text-queens-black tracking-wide drop-shadow-lg">
                Rulers of the Court <br />{" "}
                <span className="text-queens-blue animate-pulse">
                  Champions
                </span>
                <br />
                in the Game!
              </h3>

              <div className="animate-bounce delay-1000">
                <Link
                  href="/About"
                  className="bg-queens-blue text-queens-white py-4 px-8 rounded-full text-lg font-semibold hover:bg-queens-emerald hover:scale-105 transform transition-transform duration-300 shadow-md"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Matches Section */}
      <section className="py-16 bg-queens-emerald bg-opacity-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Upcoming Matches Section */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center text-queens-midnight">
                Upcoming Matches
              </h2>
              <div className="grid grid-cols-1 gap-8">
                {upcomingMatches.length > 0 && (
                  <MatchCard
                    key={upcomingMatches[0]._id}
                    date={formatDate(upcomingMatches[0].date)}
                    opponent={upcomingMatches[0].opponent.name}
                    location={upcomingMatches[0].venue}
                    time={upcomingMatches[0].time}
                    opponentLogo={upcomingMatches[0].opponent.logo}
                    result={upcomingMatches[0].result}
                  />
                )}
              </div>
            </div>
            {/* Latest Results Section */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center text-queens-midnight">
                Latest Results
              </h2>
              <div className="grid grid-cols-1 gap-8">
                {latestResults.length > 0 && (
                  <MatchCard
                    key={latestResults[0]._id}
                    date={formatDate(latestResults[0].date)}
                    opponent={latestResults[0].opponent.name}
                    location={latestResults[0].venue}
                    time={latestResults[0].time}
                    opponentLogo={latestResults[0].opponent.logo}
                    result={latestResults[0].result}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Our Queens Section */}
      <section className="py-12">
        <div className="container mx-auto px-3">
          {/* Section Heading */}
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-queens-midnight">
            Our Queens
          </h2>

          {/* Responsive Carousel */}
          <Slider {...carouselSettings}>
            {players.map((player) => (
              <TeamMember
                key={player._id}
                firstName={player.firstName}
                lastName={player.lastName}
                jerseyNumber={player.jerseyNumber}
                position={player.position}
                image={player.image}
              />
            ))}
          </Slider>

          {/* Button for Full Squad */}
          <div className="text-center mt-8">
            <Link
              href="/Team"
              className="bg-queens-blue text-queens-white py-2 px-4 sm:py-3 sm:px-6 rounded-full text-base sm:text-lg font-semibold hover:bg-queens-emerald transition duration-300"
            >
              View Full Squad
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16  bg-queens-emerald bg-opacity-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-queens-midnight">
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
              className="bg-queens-blue text-queens-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-queens-emerald transition duration-300"
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
                    <tr className="bg-queens-blue text-queens-white">
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
                            ? "bg-queens-emerald bg-opacity-10"
                            : "bg-white"
                        } hover:bg-queens-emerald hover:bg-opacity-20 transition-colors duration-200`}
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
              <div className="flex flex-col items-center bg-gradient-to-r from-queens-blue to-queens-midnight text-queens-white rounded-xl p-6 md:p-8 shadow-2xl transition-transform transform hover:scale-105">
                <Image
                  src={marqueePlayer.image}
                  alt={`${marqueePlayer.firstName} ${marqueePlayer.lastName}`}
                  width={150}
                  height={150}
                  className="rounded-full border-4 md:border-8 border-queens-emerald shadow-lg"
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
    </>
  );
}

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
    "/images/hero-bg.jpg",
    "/images/hero-bg2.jpg",
    "/images/hero-bg3.jpg",
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
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
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
  // Marquee player
  const marqueePlayer = {
    firstName: "Samantha",
    lastName: "Bricio",
    jerseyNumber: 8,
    position: "Outside Hitter",
    image: "/images/marquee-player.jpg",
  };

  // Carousel settings
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
  };

  return (
    <>
      <section className="relative mb-12 text-queens-white py-24 md:py-32">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Volleyball court"
            layout="fill"
            objectFit="cover"
            className="opacity-90"
          />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl text-queens-midnight font-bold mb-4">
            Lalitpur Queens
          </h1>
          <div className="relative flex items-center justify-center container mx-auto px-4 text-center">
            <div className="slider-content animate-fadeInRight space-y-6">
              <h3 className="text-4xl md:text-4xl font-extrabold leading-tight text-queens-emerald tracking-wide drop-shadow-lg">
                Unleashing the Power of <br />
                Queens,{" "}
                <span className="text-queens-green animate-pulse">
                  Reigning Supreme
                </span>
                <br />
                in Court!
              </h3>

              <div className="animate-bounce delay-1000">
                <Link
                  href="/about"
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
                    location={upcomingMatches[0].location}
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
                    location={latestResults[0].location}
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
          <h2 className="text-3xl font-bold mb-6 text-center text-queens-midnight">
            Our Queens
          </h2>

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
          <div className="text-center mt-8">
            <Link
              href="/Team"
              className="bg-queens-blue text-queens-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-queens-emerald transition duration-300"
            >
              View Full Squad
            </Link>
          </div>
        </div>
      </section>
      {/* Latest News Section */}
      <section className="py-16 mb-8 bg-queens-emerald bg-opacity-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-queens-midnight">
            Latest News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsItems.map((news) => (
              <NewsCard
                key={news._id}
                title={news.title}
                summary={news.summary}
                image={news.image}
                date={news.date}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Points Table Section */}
      <section className="py-12 mb-8 bg-queens-emerald bg-opacity-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Points Table */}
            <div className="w-full md:w-2/3">
              <h2 className="text-3xl font-bold mb-8 text-center text-queens-midnight">
                Points Table
              </h2>
              <div className="overflow-x-auto">
                <table className="table-auto w-full text-left">
                  <thead>
                    <tr className="bg-queens-blue text-queens-white">
                      <th className="px-4 py-2">Team</th>
                      <th className="px-4 py-2">P</th>
                      <th className="px-4 py-2">W</th>
                      <th className="px-4 py-2">L</th>
                      <th className="px-4 py-2">D</th>
                      <th className="px-4 py-2">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pointsTable.map((team) => (
                      <tr key={team._id} className="border-t">
                        <td className="px-4 py-2">{team.team.name}</td>
                        <td className="px-4 py-2">{team.played}</td>
                        <td className="px-4 py-2">{team.won}</td>
                        <td className="px-4 py-2">{team.lost}</td>
                        <td className="px-4 py-2">{team.drawn}</td>
                        <td className="px-4 py-2">{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Marquee Player */}
            {marqueePlayer > 0 && (
              <div className="w-full md:w-1/3">
                <h2 className="text-3xl font-bold mb-8 text-center text-queens-midnight">
                  Marquee Player
                </h2>
                {/* Marquee Player */}
                <TeamMember
                  key={marqueePlayer._id}
                  firstName={marqueePlayer.firstName}
                  lastName={marqueePlayer.lastName}
                  jerseyNumber={marqueePlayer.jerseyNumber}
                  position={marqueePlayer.position}
                  image={marqueePlayer.image}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

"use client";
import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import MatchCard from "@/components/MatchCard";
import NewsCard from "@/components/NewsCard";
import Slider from "react-slick";
import TeamMember from "@/components/TeamMember";

export default function Home() {
  //for upcoming matches section matches

  //to store the matched fetched from the api/matches/ endpoint
  const [upcomingMatches, setUpcomingMatches] = useState([]);

  //for leatest match results section
  const [leatestResults, setLeatestResults] = useState([]);

  //fetch matches from API when the component mounts
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("/api/matches");
        const jsonRes = await res.json();

        if (jsonRes.success) {
          //filter matches based on status
          console.log(jsonRes.data);
          const upMatches = jsonRes.data.filter(
            (match) => match.status === "Pending"
          );

          upcomingMatches.sort((a, b) => new Date(b.date) - new Date(a.date));
          const Results = jsonRes.data.filter(
            (match) => match.status === "Completed"
          );
          leatestResults.sort((a, b) => new Date(b.date) - new Date(a.date));

          //update the state with the filtered matches
          setUpcomingMatches(upMatches);

          setLeatestResults(Results);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMatches();
  }, []);

  //format date as "May 15, 2024"
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  //for news section in home page
  const [newsItems, setNews] = useState([]);

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

  // Carousel settings

  const carouselSettings = {
    dots: false,
    arrows: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 4000,
    cssEase: "cubic-bezier(0.2, 0, 0, 1)",
  };

  //state to store the players data
  const [players, setPlayers] = useState([]);

  //fetch players from API when the component mounts

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch("/api/players");
        const jsonRes = await res.json();

        if (jsonRes.success) {
          setPlayers(jsonRes.data);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPlayers();
  }, []);

  //state to store points table data
  const [pointsTable, setPointsTable] = useState([]);

  //fetch points table data from API when the component mounts
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

  return (
    <>
      <section className="relative  mb-12 text-queens-white py-24 md:py-32">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Volleyball court"
            layout="fill"
            objectFit="cover"
            className="opacity-50"
          />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl   text-queens-midnight font-bold mb-4">
            Lalitpur Queens
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-queens-green  ">
            Empowering women through volleyball
          </p>
          <Link
            href="/about"
            className="bg-queens-blue text-queens-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-queens-emerald transition duration-300"
          >
            Learn More
          </Link>
        </div>
      </section>
      {/* Matches Section */}
      <section className="py-16  bg-queens-emerald bg-opacity-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Upcoming Matches Section */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center text-queens-midnight">
                Upcoming Matches
              </h2>
              <div className="grid grid-cols-1 gap-8 ">
                {upcomingMatches.length > 0 && (
                  <MatchCard
                    key={upcomingMatches[0]._id}
                    date={formatDate(upcomingMatches[0].date)} // Format date as "May 15, 2024"
                    opponent={upcomingMatches[0].opponent.name}
                    location={upcomingMatches[0].location}
                    time={upcomingMatches[0].time}
                    opponentLogo={upcomingMatches[0].opponent.logo} // Assuming you have opponent's logo
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
                {leatestResults.length > 0 && (
                  <MatchCard
                    key={leatestResults[0]._id}
                    date={formatDate(leatestResults[0].date)} // Format date as "May 15, 2024"
                    opponent={leatestResults[0].opponent.name}
                    location={leatestResults[0].location}
                    time={leatestResults[0].time}
                    opponentLogo={leatestResults[0].opponent.logo} // Assuming you have opponent's logo
                    result={leatestResults[0].result}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Our Queens Section */}
      <section className="py-12 ">
        <div className="container mx-auto px-3">
          <h2 className="text-3xl font-bold mb-6 text-center text-queens-midnight">
            Our Queens
          </h2>

          <Slider {...carouselSettings}>
            {/* Add squad member data here */}
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
            {/* Add more squad members as needed */}
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
      <section className="py-16 bg-queens-emerald bg-opacity-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-queens-midnight">
            Latest News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsItems.map((newsItem) => (
              <NewsCard
                key={newsItem._id}
                title={newsItem.title}
                excerpt={newsItem.content.substring(0, 100) + "..."}
                image={newsItem.image}
                date={new Date(newsItem.createdAt).toLocaleDateString()}
              />
            ))}
          </div>
        </div>
      </section>
      <div className="flex flex-col md:flex-row">
        {/* Points Table Section */}
        <div className="md:w-1/2 p-4 bg-white shadow-lg mt-12 mb-16 rounded-lg hover:bg-queens-emerald transition-colors duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-queens-midnight">
            Points Table
          </h2>
          <table className="min-w-full bg-white">
            <thead className="bg-queens-emerald text-queens-white">
              <tr>
                <th className="py-2 px-4">Team</th>
                <th className="py-2 px-4">Played</th>
                <th className="py-2 px-4">Won</th>
                <th className="py-2 px-4">Lost</th>
                <th className="py-2 px-4">Points</th>
              </tr>
            </thead>
            <tbody>
              {pointsTable.map((team, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-queens-blue transition-colors duration-200"
                >
                  <td className="py-2 px-4">{team.name}</td>
                  <td className="py-2 px-4 text-center">{team.played}</td>
                  <td className="py-2 px-4 text-center">{team.won}</td>
                  <td className="py-2 px-4 text-center">{team.lost}</td>
                  <td className="py-2 px-4 text-center">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

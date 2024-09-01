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

  //to store the  upcoming matched fetched from the api/matches/ endpoint
  const [match, setMatch] = useState([
    {
      opponent: {
        name: "",
        logo: "",
      },
      date: "",
      location: "",
      time: "",
      result: "",
    },
  ]);

  //for leatest match results section>
  const [result, setResult] = useState([]);

  //fetch matches from API when the component mounts
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("/api/matches");
        const jsonRes = await res.json();

        if (jsonRes.success) {
          //filter matches based on status
          console.log(jsonRes.data);
          const comingMatches = jsonRes.data.filter(
            (match) => match.status === "Pending"
          );
          comingMatches.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          });

          const lastResults = jsonRes.data.filter(
            (match) => match.status === "Completed"
          );
          lastResults.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          });
          //update the state with the filtered matches

          console.log("comming matches console", comingMatches[0]);
          console.log("last results console", lastResults[0]);
          setMatch(comingMatches[0]);

          setResult(lastResults[0]);
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
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <section className="relative bg-queens-green text-queens-white py-24 md:py-32">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Volleyball court"
            layout="fill"
            objectFit="cover"
            className="opacity-30"
          />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Lalitpur Queens
          </h1>
          <p className="text-xl md:text-2xl mb-8">
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
      <section className="py-16 bg-queens-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Upcoming Matches Section */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center text-queens-midnight">
                <span className="text-queens-emerald">{match.opponent}</span>
                Upcoming Matches
              </h2>
              <div className="grid grid-cols-1 gap-8">
                {/* {match && (
                  <MatchCard
                    date={formatDate(match.date)}
                    opponent={match.opponent.name}
                    location={match.location}
                    time={match.time}
                    opponentLogo={match.opponent.logo}
                    result={match.result}
                  />
                )} */}
              </div>
            </div>
            {/* Latest Results Section */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center text-queens-midnight">
                Latest Results
              </h2>
              <div className="grid grid-cols-1 gap-8">
                {/* {result && (
                  <MatchCard
                    date={formatDate(result.date)} // Format date as "May 15, 2024"
                    opponent={result.opponent.name}
                    location={result.location}
                    time={result.time}
                    opponentLogo={result.opponent.logo} // Assuming you have opponent's logo
                    result={result.result} // Assuming you have a result field to show
                  />
                )} */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Queens Section */}
      <section className="py-12 bg-queens-emerald">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center text-queens-midnight">
            Our Queens
          </h2>
          <div className="relative">
            <Slider {...carouselSettings}>
              {/* Add squad member data here */}
              <TeamMember />
              {/* Add more squad members as needed */}
            </Slider>
            <div className="text-center mt-8">
              <Link
                href="/team"
                className="bg-queens-blue text-queens-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-queens-emerald transition duration-300"
              >
                View Full Squad
              </Link>
            </div>
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
    </>
  );
}

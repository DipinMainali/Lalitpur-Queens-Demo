//Implement Marquee Player component( Marquee player is the featured player from the player list )
//Use modern UI components and styles .
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const MarqueePlayer = () => {
  const [featuredPlayer, setFeaturedPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPlayer = async () => {
      try {
        const res = await fetch("/api/players/featured");
        const jsonRes = await res.json();

        if (jsonRes.success && jsonRes.data.length > 0) {
          setFeaturedPlayer(jsonRes.data[0]);
        } else {
          console.error("No featured player found");
        }
      } catch (err) {
        console.error("Error fetching featured player:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPlayer();
  }, []);

  // If loading or no featured player, display placeholder
  if (loading || !featuredPlayer) {
    return (
      <section className="py-20 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5">
        <div className="container mx-auto px-4">
          <div className="animate-pulse bg-white rounded-xl p-10 shadow-lg">
            <div className="h-10 w-48 bg-gray-200 rounded-full mb-8 mx-auto"></div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
              <div className="h-80 w-64 bg-gray-200 rounded-xl"></div>
              <div className="w-full md:w-1/2 space-y-4">
                <div className="h-10 w-40 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded-full w-full"></div>
                <div className="h-4 bg-gray-200 rounded-full w-full"></div>
                <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
                <div className="h-10 w-32 bg-gray-200 rounded-full mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-primary/5 to-transparent"></div>
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-brand-secondary/5 to-transparent"></div>
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-brand-primary rounded-full opacity-5"></div>
        <div className="absolute -bottom-40 -right-20 w-96 h-96 bg-brand-secondary rounded-full opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header with Animated Bar */}
        <div className="relative mb-16 text-center">
          <motion.h2
            className="text-4xl font-bold text-text-primary inline-block relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Star Player
            <motion.span
              className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            ></motion.span>
          </motion.h2>
          <motion.p
            className="text-text-secondary mt-4 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Meet our exceptional talent who represents Lalitpur Queens with
            excellence
          </motion.p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Player Image with Decorative Elements */}
            <motion.div
              className="w-full lg:w-2/5 relative overflow-hidden"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 z-0"></div>

              {/* Team Logo Watermark */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-10 z-0">
                <Image
                  src="/images/Lalitpur-queens-logo.png"
                  alt="Lalitpur Queens Logo"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Player Image */}
              <div className="relative h-[500px] z-10">
                <Image
                  src={featuredPlayer.image}
                  alt={`${featuredPlayer.firstName} ${featuredPlayer.lastName}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  className="object-cover object-top"
                  priority
                />
              </div>

              {/* Jersey Number Accent */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/10 rounded-full flex items-center justify-center z-0">
                <span className="text-6xl font-bold text-brand-primary opacity-30">
                  {featuredPlayer.jerseyNumber}
                </span>
              </div>

              {/* Featured Badge */}
              <div className="absolute top-6 left-6 bg-accent text-text-primary px-4 py-2 rounded-full shadow-lg z-20 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold text-sm">Marquee Player</span>
              </div>
            </motion.div>

            {/* Right Side - Player Details */}
            <motion.div
              className="w-full lg:w-3/5 p-8 lg:p-12"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="bg-brand-primary/10 text-brand-primary text-sm font-medium px-4 py-1 rounded-full">
                  {featuredPlayer.position}
                </div>
                <div className="ml-3 bg-brand-secondary/10 text-brand-secondary text-sm font-medium px-4 py-1 rounded-full">
                  #{featuredPlayer.jerseyNumber}
                </div>
                <div className="ml-3 bg-background text-text-secondary text-sm px-4 py-1 rounded-full">
                  {featuredPlayer.nationality}
                </div>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="text-brand-primary">
                  {featuredPlayer.firstName}
                </span>{" "}
                <span className="text-brand-secondary">
                  {featuredPlayer.lastName}
                </span>
              </h2>

              {/* Player Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-background rounded-xl p-4">
                  <div className="text-xs text-text-secondary mb-1">Height</div>
                  <div className="text-xl font-bold text-text-primary">
                    {featuredPlayer.height} cm
                  </div>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <div className="text-xs text-text-secondary mb-1">Age</div>
                  <div className="text-xl font-bold text-text-primary">
                    {new Date().getFullYear() -
                      new Date(featuredPlayer.DOB).getFullYear()}
                  </div>
                </div>
                <div className="bg-background rounded-xl p-4">
                  <div className="text-xs text-text-secondary mb-1">Role</div>
                  <div className="text-xl font-bold text-text-primary">
                    {featuredPlayer.position}
                  </div>
                </div>
              </div>

              {/* Player Bio */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 text-text-primary">
                  Biography
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {featuredPlayer.bio
                    ? featuredPlayer.bio.replace(/<[^>]*>/g, "")
                    : `${featuredPlayer.firstName} ${featuredPlayer.lastName} is a talented volleyball player representing Lalitpur Queens. 
                    With exceptional skills as a ${featuredPlayer.position}, ${featuredPlayer.firstName} 
                    brings leadership and determination to every match, inspiring teammates and fans alike.`}
                </p>
              </div>

              {/* Player Achievements - Simulated */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 text-text-primary">
                  Key Strengths
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Agility",
                    "Leadership",
                    "Technical Skill",
                    "Game Vision",
                    "Team Player",
                  ].map((strength, index) => (
                    <span
                      key={index}
                      className="bg-brand-primary/5 text-brand-primary text-sm py-1 px-3 rounded-full"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link
                href={`/Team/${featuredPlayer._id}`}
                className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white py-3 px-8 rounded-full transition-all duration-300 shadow hover:shadow-lg transform hover:-translate-y-1"
              >
                <span className="font-semibold">Full Profile</span>
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
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarqueePlayer;

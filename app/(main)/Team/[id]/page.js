"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import { format } from "date-fns";
import Link from "next/link";

// Icons
const HeightIcon = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L11 6.414V16a1 1 0 11-2 0V6.414L7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z"
      clipRule="evenodd"
    ></path>
  </svg>
);

const BirthdayIcon = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
      clipRule="evenodd"
    ></path>
  </svg>
);

const FlagIcon = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
      clipRule="evenodd"
    ></path>
  </svg>
);

const PositionIcon = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
      clipRule="evenodd"
    ></path>
  </svg>
);

export default function PlayerDetails({ params }) {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await fetch(`/api/players/${params.id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch player data");
        }

        const jsonRes = await res.json();
        if (jsonRes.success) {
          setPlayer(jsonRes.data);
        } else {
          setError(jsonRes.message || "Failed to load player details");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching player data");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="relative flex flex-col items-center">
          <div className="absolute animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-primary"></div>
          <img
            src="/images/Lalitpur-queens-logo.png"
            className="rounded-full h-28 w-28 object-contain"
            alt="Lalitpur Queens"
          />
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md border border-background">
          <svg
            className="w-20 h-20 text-error mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Player Not Found
          </h1>
          <p className="text-text-secondary mb-6">
            {error || "The requested player could not be found."}
          </p>
          <Link
            href="/Team"
            className="inline-block px-6 py-3 bg-white border border-brand-primary text-brand-primary font-semibold rounded-lg hover:bg-brand-primary hover:text-white transition-colors"
          >
            Return to Team
          </Link>
        </div>
      </div>
    );
  }

  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <>
      <Head>
        <title>
          {player.firstName} {player.lastName} - Lalitpur Queens
        </title>
        <meta
          name="description"
          content={`${player.firstName} ${player.lastName} - ${player.position} player for Lalitpur Queens`}
        />
      </Head>

      <div className="bg-white min-h-screen">
        {/* Enhanced Hero Section with Centered Image */}
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-primary to-brand-primary/90 min-h-[60vh]">
          {/* Lalitpur Queens Logo Background Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <img
              src="/images/Lalitpur-queens-logo.png"
              alt="Lalitpur Queens Logo"
              className="w-[80%] max-w-2xl object-contain"
            />
          </div>

          {/* Background Pattern - subtle circles */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white"></div>
            <div className="absolute right-1/4 bottom-10 w-40 h-40 rounded-full bg-white"></div>
            <div className="absolute left-1/4 top-40 w-56 h-56 rounded-full bg-white"></div>
          </div>

          <div className="container mx-auto px-4 py-8 flex flex-col items-center relative z-10">
            {/* Player Name and Number at Top */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-white mb-6"
            >
              <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full mb-2">
                <span className="font-semibold">#{player.jerseyNumber}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                <span>
                  {player.firstName} {player.lastName}
                </span>
              </h1>
              <p className="text-xl md:text-2xl mt-2 opacity-80">
                {player.position}
              </p>
            </motion.div>

            {/* Centered Floating Player Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: imageLoaded ? 1 : 0,
                y: imageLoaded ? 0 : 30,
              }}
              transition={{ duration: 0.6 }}
              className="relative mb-[-100px] mt-4"
            >
              {/* Floating animation container */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                {/* Glow effect behind image */}
                <div className="absolute inset-0 bg-brand-secondary/20 rounded-full blur-xl transform scale-90"></div>

                {/* Main image container with shadow effects */}
                <div className="relative w-72 h-72 md:w-96 md:h-96 bg-white p-3 rounded-xl shadow-2xl overflow-hidden">
                  {/* Team logo small overlay on image */}
                  <div className="absolute top-3 right-3 w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-sm rounded-full p-1 z-10">
                    <img
                      src="/images/Lalitpur-queens-logo.png"
                      alt="Team Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <img
                    src={player.image}
                    alt={`${player.firstName} ${player.lastName}`}
                    className="w-full h-full object-cover rounded-lg"
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/400x400/F5F5F5/999999?text=No+Image";
                    }}
                  />
                </div>

                {/* Subtle decorative element */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2/3 h-6 bg-black/10 blur-md rounded-full"></div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Content Area - pushed down to accommodate floating image */}
        <div className="container mx-auto px-4 pt-28 md:pt-32 pb-16 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="md:col-span-1"
            >
              {/* Player Stats Card */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-background">
                <h2 className="text-xl font-bold text-text-primary mb-6 pb-2 border-b border-background">
                  Player Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-brand-primary">
                      <BirthdayIcon />
                    </div>
                    <div className="ml-4">
                      <p className="text-text-secondary text-sm">
                        Date of Birth
                      </p>
                      <p className="text-text-primary font-medium">
                        {format(new Date(player.DOB), "MMMM d, yyyy")} (
                        {calculateAge(player.DOB)} years)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-brand-primary">
                      <HeightIcon />
                    </div>
                    <div className="ml-4">
                      <p className="text-text-secondary text-sm">Height</p>
                      <p className="text-text-primary font-medium">
                        {player.height} cm
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-brand-primary">
                      <FlagIcon />
                    </div>
                    <div className="ml-4">
                      <p className="text-text-secondary text-sm">Nationality</p>
                      <p className="text-text-primary font-medium">
                        {player.nationality}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-brand-primary">
                      <PositionIcon />
                    </div>
                    <div className="ml-4">
                      <p className="text-text-secondary text-sm">Position</p>
                      <p className="text-text-primary font-medium">
                        {player.position}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Player Bio Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="md:col-span-2"
            >
              <div className="bg-white rounded-lg shadow-sm p-6 border border-background">
                <h2 className="text-xl font-bold text-text-primary mb-6 pb-2 border-b border-background">
                  Player Bio
                </h2>

                {player.bio ? (
                  <div className="prose max-w-none text-text-primary">
                    <div dangerouslySetInnerHTML={{ __html: player.bio }} />
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-background"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <p className="mt-4 text-text-secondary">
                      No biography available for this player
                    </p>
                  </div>
                )}
              </div>

              {/* Back to Team Button */}
              <div className="mt-6 text-center md:text-right">
                <Link
                  href="/Team"
                  className="inline-flex items-center px-6 py-3 bg-white border border-brand-primary text-brand-primary font-semibold rounded-lg hover:bg-brand-primary hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                  </svg>
                  Back to Team
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

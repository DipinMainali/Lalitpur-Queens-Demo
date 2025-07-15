import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const HeroSection = ({ images }) => {
  // Animation and interaction states
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  // Countdown timer states
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Match details state
  const [nextMatch, setNextMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the next upcoming match
  useEffect(() => {
    const fetchNextMatch = async () => {
      try {
        const res = await fetch("/api/matches?status=Scheduled");

        if (!res.ok) {
          throw new Error("Failed to fetch upcoming matches");
        }

        const data = await res.json();

        if (data.success && data.data.length > 0) {
          // Sort matches by date to get the earliest one
          const sortedMatches = data.data.sort(
            (a, b) => new Date(a.matchDateTime) - new Date(b.matchDateTime)
          );

          // Get the next upcoming match
          const match = sortedMatches[0];

          setNextMatch({
            date: new Date(match.matchDateTime),
            opponent:
              match.homeTeam.name === "Lalitpur Queens"
                ? match.awayTeam.name
                : match.homeTeam.name,
            venue: match.location,
            isHome: match.homeTeam.name === "Lalitpur Queens",
            matchId: match._id,
            tournament: match.tournament,
            stage: match.stage,
          });
        } else {
          // Fallback if no matches are found
          setNextMatch(null);
        }
      } catch (error) {
        console.error("Error fetching next match:", error);
        setError("Unable to load upcoming matches");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNextMatch();
  }, []);

  useEffect(() => {
    // Trigger entrance animations after a slight delay
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Handle scroll for parallax effects
    const handleScroll = () => {
      if (!heroRef.current) return;

      const scrollY = window.scrollY;
      const heroHeight = heroRef.current.offsetHeight;
      const progress = Math.min(scrollY / heroHeight, 1);
      setScrollProgress(progress);
    };

    // Handle mouse movement for interactive elements
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      setMousePosition({
        x: (clientX / innerWidth - 0.5) * 2, // -1 to 1
        y: (clientY / innerHeight - 0.5) * 2, // -1 to 1
      });
    };

    // Add event listeners
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    // Clean up
    return () => {
      clearTimeout(loadTimer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Update countdown timer based on next match
  useEffect(() => {
    if (!nextMatch) return;

    const countdownTimer = setInterval(() => {
      const now = new Date();
      const difference = nextMatch.date - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        // Match time has passed
        clearInterval(countdownTimer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    // Clean up
    return () => clearInterval(countdownTimer);
  }, [nextMatch]);

  // Format date for display
  const formatMatchDate = (date) => {
    if (!date) return "";

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-text-primary to-brand-primary"
    >
      {/* Geometric background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large circle */}
        <div
          className="absolute -right-1/4 -top-1/4 w-1/2 h-1/2 rounded-full bg-brand-secondary opacity-10"
          style={{
            transform: `translate(${mousePosition.x * -15}px, ${
              mousePosition.y * -15
            }px)`,
            transition: "transform 0.6s ease-out",
          }}
        ></div>

        {/* Middle circle */}
        <div
          className="absolute bottom-1/4 -left-20 w-40 h-40 rounded-full bg-white opacity-5"
          style={{
            transform: `translate(${mousePosition.x * 10}px, ${
              mousePosition.y * 10
            }px)`,
            transition: "transform 0.4s ease-out",
          }}
        ></div>

        {/* Small circle */}
        <div
          className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-accent opacity-10"
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${
              mousePosition.y * 20
            }px)`,
            transition: "transform 0.2s ease-out",
          }}
        ></div>

        {/* Angled line accent */}
        <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-20 origin-bottom-right -rotate-[20deg] scale-[2]"></div>
      </div>

      {/* Animated mesh overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15px 15px, rgba(255, 255, 255, 0.1) 2px, transparent 0)",
            backgroundSize: "30px 30px",
            transform: `translate(${mousePosition.x * -5}px, ${
              mousePosition.y * -5
            }px)`,
            transition: "transform 1s ease-out",
          }}
        ></div>
      </div>

      {/* Content container */}
      <div className="container mx-auto px-4 h-full relative z-10">
        <div className="flex flex-col md:flex-row h-full items-center justify-between">
          {/* Left content section */}
          <div className="w-full md:w-1/2 text-white pt-16 md:pt-0">
            {/* Team name with animated reveal */}
            <div className="overflow-hidden mb-4">
              <h2
                className="text-xl tracking-widest text-accent font-medium uppercase"
                style={{
                  transform: isLoaded ? "translateY(0)" : "translateY(100%)",
                  opacity: isLoaded ? 1 : 0,
                  transition: "transform 0.8s ease, opacity 0.8s ease",
                }}
              >
                Women Volleyball Championship
              </h2>
            </div>

            {/* Main headline with animated characters */}
            <div className="mb-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-none">
                <span className="block overflow-hidden">
                  <span
                    className="inline-block"
                    style={{
                      transform: isLoaded
                        ? "translateY(0)"
                        : "translateY(100%)",
                      opacity: isLoaded ? 1 : 0,
                      transition:
                        "transform 0.8s ease 0.1s, opacity 0.8s ease 0.1s",
                    }}
                  >
                    Lalitpur
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span
                    className="inline-block text-brand-secondary"
                    style={{
                      transform: isLoaded
                        ? "translateY(0)"
                        : "translateY(100%)",
                      opacity: isLoaded ? 1 : 0,
                      transition:
                        "transform 0.8s ease 0.3s, opacity 0.8s ease 0.3s",
                    }}
                  >
                    Queens
                  </span>
                </span>
              </h1>
            </div>

            {/* Tagline with animated reveal */}
            <div className="overflow-hidden mb-10">
              <p
                className="text-lg md:text-xl text-white/80 max-w-md"
                style={{
                  transform: isLoaded ? "translateY(0)" : "translateY(100%)",
                  opacity: isLoaded ? 1 : 0,
                  transition:
                    "transform 0.8s ease 0.5s, opacity 0.8s ease 0.5s",
                }}
              >
                Dominating the court with power, precision, and unstoppable
                passion.
              </p>
            </div>

            {/* Next match banner */}
            <div
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8 border border-white/20 max-w-md transform transition-all duration-700"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(30px)",
                transition: "transform 0.8s ease 0.7s, opacity 0.8s ease 0.7s",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-brand-secondary text-white p-2 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                </div>

                {isLoading ? (
                  <div className="animate-pulse w-full">
                    <div className="h-3 bg-white/20 rounded mb-2 w-20"></div>
                    <div className="h-5 bg-white/30 rounded mb-2 w-32"></div>
                    <div className="h-4 bg-white/20 rounded w-24"></div>
                  </div>
                ) : error ? (
                  <div>
                    <h3 className="text-sm text-accent">MATCH SCHEDULE</h3>
                    <p className="text-white/70">
                      Check back soon for upcoming matches
                    </p>
                  </div>
                ) : nextMatch ? (
                  <div>
                    <h3 className="text-sm text-accent">NEXT MATCH</h3>
                    <div className="flex items-center">
                      <p className="text-white font-medium">
                        {nextMatch.isHome
                          ? `vs ${nextMatch.opponent}`
                          : `at ${nextMatch.opponent}`}
                      </p>
                      {nextMatch.tournament && (
                        <span className="ml-2 px-2 py-0.5 bg-brand-primary/20 text-white border-white text-xs rounded-full">
                          {nextMatch.tournament}
                        </span>
                      )}
                    </div>
                    <p className="text-white/70 text-sm">{nextMatch.venue}</p>
                    <p className="text-white/70 text-xs mt-1">
                      {formatMatchDate(nextMatch.date)}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-sm text-accent">MATCH SCHEDULE</h3>
                    <p className="text-white font-medium">
                      No upcoming matches
                    </p>
                    <p className="text-white/70 text-sm">Check back later</p>
                  </div>
                )}
              </div>

              {nextMatch && (
                <div className="flex justify-between mt-4 text-center">
                  <div className="flex-1">
                    <div className="text-2xl font-bold">{timeLeft.days}</div>
                    <div className="text-xs text-white/70">DAYS</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold">{timeLeft.hours}</div>
                    <div className="text-xs text-white/70">HOURS</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                    <div className="text-xs text-white/70">MINS</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                    <div className="text-xs text-white/70">SECS</div>
                  </div>
                </div>
              )}
            </div>

            {/* CTA buttons with hover effects */}
            <div
              className="flex flex-wrap gap-4 relative z-50"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(30px)",
                transition: "transform 0.8s ease 0.9s, opacity 0.8s ease 0.9s",
              }}
            >
              <Link
                href="/Matches"
                className="group relative px-8 py-3 bg-brand-secondary text-white rounded-md overflow-hidden"
              >
                <span className="absolute inset-0 w-0 bg-accent group-hover:w-full transition-all duration-500 ease-out"></span>
                <span className="relative flex items-center justify-center gap-2">
                  View Schedule
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
              </Link>

              {nextMatch && (
                <Link
                  href={`/tickets?match=${nextMatch.matchId}`}
                  className="group relative px-8 py-3 bg-brand-secondary/80 hover:bg-brand-secondary text-white rounded-md border border-white/50 transition-all duration-300 shadow-lg shadow-brand-primary/20"
                >
                  <span className="flex items-center justify-center gap-2">
                    Buy Tickets
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                      />
                    </svg>
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Right player image with 3D effect */}
          <div className="w-full md:w-1/2 h-full relative flex items-center justify-center">
            {/* 3D floating effect container */}
            <div
              className="perspective-1000 w-full h-[550px] mt-8 md:mt-0"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(50px)",
                transition: "transform 1.2s ease 0.5s, opacity 1.2s ease 0.5s",
              }}
            >
              <div
                className="relative w-full h-full preserve-3d"
                style={{
                  transform: `rotateY(${mousePosition.x * 5}deg) rotateX(${
                    mousePosition.y * -5
                  }deg)`,
                  transition: "transform 0.5s ease-out",
                }}
              >
                {/* Player image with glow effect */}
                <div className="relative w-full h-full z-20">
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[85%] h-[20px] bg-brand-secondary opacity-30 blur-2xl rounded-full"></div>

                  <Image
                    src="/images/player-collage.png"
                    alt="Lalitpur Queens Players"
                    width={600}
                    height={800}
                    priority
                    className="object-contain object-bottom w-full h-full relative z-10"
                  />
                </div>

                {/* Decorative floating elements */}
                <div
                  className="absolute left-1/4 top-1/4 w-16 h-16 border border-brand-secondary rounded-full opacity-50 z-0"
                  style={{
                    transform: `translateZ(20px) translate(${
                      mousePosition.x * -15
                    }px, ${mousePosition.y * -15}px)`,
                    transition: "transform 0.3s ease-out",
                  }}
                ></div>

                <div
                  className="absolute right-1/4 bottom-1/3 w-8 h-8 bg-accent opacity-40 rounded-full z-0"
                  style={{
                    transform: `translateZ(40px) translate(${
                      mousePosition.x * -25
                    }px, ${mousePosition.y * -25}px)`,
                    transition: "transform 0.2s ease-out",
                  }}
                ></div>

                {/* Volleyball graphic */}
                <div
                  className="absolute top-[15%] right-[20%] w-14 h-14 rounded-full bg-white z-30 shadow-lg"
                  style={{
                    transform: `translateZ(50px) translate(${
                      mousePosition.x * -35
                    }px, ${mousePosition.y * -35}px)`,
                    transition: "transform 0.1s ease-out",
                    backgroundImage:
                      "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.2) 31%, transparent 32%, transparent 38%, rgba(0,0,0,0.2) 39%, transparent 40%)",
                    backgroundSize: "100% 100%",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom diagonal cut */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <svg
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          viewBox="0 0 1440 74"
          className="fill-white"
        >
          <path d="M0,0 L1440,50 L1440,74 L0,74 Z"></path>
        </svg>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute left-1/2 bottom-8 transform -translate-x-1/2 z-20 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-1000 delay-1500`}
      >
        <div className="flex flex-col items-center animate-bounce">
          <span className="text-white text-xs tracking-widest mb-2">
            SCROLL
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

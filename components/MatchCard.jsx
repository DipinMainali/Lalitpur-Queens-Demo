import Image from "next/image";

export default function MatchCard({ match }) {
  const lalitpurQueensLogo = "/images/Lalitpur-queens-logo.png";
  const lalitpurQueensName = "Lalitpur Queens";

  // Safe access to match properties
  const homeTeam = match.homeTeam || {
    name: lalitpurQueensName,
    logo: lalitpurQueensLogo,
  };
  const awayTeam = match.awayTeam || { name: "TBA", logo: "" };
  const matchDateTime = match.matchDateTime
    ? new Date(match.matchDateTime)
    : null;

  // Determine match result (for Lalitpur Queens)
  const getMatchResult = () => {
    if (match.matchStatus !== "Completed") {
      return null;
    }

    const isLalitpurHome = homeTeam.name === lalitpurQueensName;

    if (match.winnerTeam === "draw") {
      return "Draw";
    } else if (
      (isLalitpurHome && match.winnerTeam === "home") ||
      (!isLalitpurHome && match.winnerTeam === "away")
    ) {
      return "Win";
    } else {
      return "Loss";
    }
  };

  const result = getMatchResult();

  const getResultColor = (result) => {
    switch (result) {
      case "Win":
        return "bg-brand-secondary";
      case "Draw":
        return "bg-accent";
      case "Loss":
        return "bg-error";
      default:
        return "bg-text-primary";
    }
  };

  // Format date as "May 15, 2024"
  const formatDate = (dateTime) => {
    if (!dateTime) return "Date TBA";
    return dateTime.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time as "7:30 PM"
  const formatTime = (dateTime) => {
    if (!dateTime) return "Time TBA";
    return dateTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get match status badge
  const getStatusBadge = () => {
    if (match.matchStatus === "Scheduled") {
      return (
        <div className="absolute top-0 left-0 bg-info text-white py-1 px-3 rounded-br-lg font-bold">
          Upcoming
        </div>
      );
    } else if (match.matchStatus === "In Progress") {
      return (
        <div className="absolute top-0 left-0 bg-accent text-white py-1 px-3 rounded-br-lg font-bold animate-pulse">
          Live Now
        </div>
      );
    } else if (match.matchStatus === "Postponed") {
      return (
        <div className="absolute top-0 left-0 bg-amber-500 text-white py-1 px-3 rounded-br-lg font-bold">
          Postponed
        </div>
      );
    } else if (match.matchStatus === "Cancelled") {
      return (
        <div className="absolute top-0 left-0 bg-error text-white py-1 px-3 rounded-br-lg font-bold">
          Cancelled
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="bg-cover bg-center bg-no-repeat shadow-lg rounded-xl mt-6 relative overflow-hidden"
      style={{
        backgroundImage: `url('/images/match-card-bg.png')`,
      }}
    >
      <div className="bg-white bg-opacity-80 p-6 rounded-xl">
        {/* Result Badge (top right) */}
        {result && (
          <div
            className={`absolute top-0 right-0 ${getResultColor(
              result
            )} text-white py-1 px-3 rounded-bl-lg font-bold`}
          >
            {result}
          </div>
        )}

        {/* Status Badge (top left) */}
        {getStatusBadge()}

        {/* Match Details Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-4">
          <div className="text-2xl font-bold text-text-primary">
            {formatDate(matchDateTime)}
          </div>

          <div className="mt-2 md:mt-0 text-sm px-3 py-1 bg-background/50 rounded-full">
            <span className="font-semibold">{match.tournament}</span>
            {match.stage && <span> • {match.stage}</span>}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          {/* Home Team */}
          <div className="text-center w-2/5">
            <div className="relative mx-auto w-[100px] h-[100px]">
              <Image
                src={homeTeam.logo || lalitpurQueensLogo}
                alt={homeTeam.name}
                fill
                sizes="100px"
                className="object-contain transform transition-transform duration-300 hover:scale-110"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/100x100/DEE1EC/666666?text=${homeTeam.name
                    .charAt(0)
                    .toUpperCase()}`;
                }}
              />
            </div>
            <div className="text-xl font-bold mt-2 text-text-primary">
              {homeTeam.name}
            </div>
            {match.matchStatus === "Completed" && (
              <div className="text-2xl font-bold text-brand-primary">
                {match.scores?.totalSets.home || 0}
              </div>
            )}
          </div>

          <div className="text-3xl font-bold text-text-primary">VS</div>

          {/* Away Team */}
          <div className="text-center w-2/5">
            <div className="relative mx-auto w-[100px] h-[100px]">
              <Image
                src={awayTeam.logo || "/images/team-placeholder.png"}
                alt={awayTeam.name}
                fill
                sizes="100px"
                className="object-contain transform transition-transform duration-300 hover:scale-110"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/100x100/DEE1EC/666666?text=${awayTeam.name
                    .charAt(0)
                    .toUpperCase()}`;
                }}
              />
            </div>
            <div className="text-xl font-bold mt-2 text-text-primary">
              {awayTeam.name}
            </div>
            {match.matchStatus === "Completed" && (
              <div className="text-2xl font-bold text-text-primary">
                {match.scores?.totalSets.away || 0}
              </div>
            )}
          </div>
        </div>

        {/* Set details for completed matches */}
        {match.matchStatus === "Completed" &&
          match.scores?.sets?.length > 0 && (
            <div className="mb-4 bg-background/30 rounded-lg p-2">
              <div className="flex justify-center gap-3 flex-wrap">
                {match.scores.sets.map((set, idx) => (
                  <div
                    key={idx}
                    className="text-sm bg-white px-3 py-1 rounded-md shadow-sm"
                  >
                    <span className="font-medium">Set {idx + 1}:</span>{" "}
                    {set.homeScore}-{set.awayScore}
                  </div>
                ))}
              </div>
            </div>
          )}

        <div className="flex justify-between items-center text-sm text-text-secondary">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <span className="font-semibold">Location:</span>{" "}
            {match.location || "TBA"}
          </div>
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span className="font-semibold">Time:</span>{" "}
            {formatTime(matchDateTime)}
          </div>
        </div>
      </div>
    </div>
  );
}

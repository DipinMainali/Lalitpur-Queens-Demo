import Image from "next/image";

export default function MatchCard({
  date,
  opponent,
  location,
  time,
  result,
  opponentLogo,
}) {
  console.log(date, opponent, location, time, result, opponentLogo);
  const lalitpurQueensLogo = "/images/Lalitpur-queens-logo.png";
  const lalitpurQueensName = "Lalitpur Queens";

  const getResultColor = (result) => {
    switch (result) {
      case "Win":
        return "bg-green-500";
      case "Draw":
        return "bg-yellow-500";
      case "Loss":
        return "bg-red-500";
      default:
        return "bg-queens-midnight";
    }
  };
  // Format date as "May 15, 2024"
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className="bg-cover bg-center bg-no-repeat shadow-lg rounded-xl mt-6 relative overflow-hidden"
      style={{
        backgroundImage: `url('/images/match-card-bg.png')`,
      }}
    >
      <div className="bg-white bg-opacity-80 p-6 rounded-xl">
        {result && (
          <div
            className={`absolute top-0 right-0 ${getResultColor(
              result
            )} text-white py-1 px-3 rounded-bl-lg font-bold`}
          >
            {result || "Pending"}
          </div>
        )}

        <div className="text-2xl font-bold mb-4 text-queens-midnight">
          {formatDate(date)}
        </div>

        <div className="flex justify-between items-center mb-6">
          {/* Lalitpur Queens */}
          <div className="text-center">
            <Image
              src={lalitpurQueensLogo}
              alt={lalitpurQueensName}
              height={100}
              width={100}
              className="mx-auto transform transition-transform duration-300 hover:scale-110"
            />
            <div className="text-xl font-bold mt-2 text-queens-midnight">
              {lalitpurQueensName}
            </div>
          </div>

          <div className="text-3xl font-bold text-queens-midnight">VS</div>

          {/* Opponent Team */}
          <div className="text-center">
            <Image
              src={opponentLogo}
              alt={opponent}
              height={100}
              width={100}
              className="mx-auto transform transition-transform duration-300 hover:scale-110"
            />
            <div className="text-xl font-bold mt-2 text-queens-midnight">
              {opponent}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            <span className="font-semibold">Location:</span> {location}
          </div>
          <div>
            <span className="font-semibold">Time:</span> {time}
          </div>
        </div>
      </div>
    </div>
  );
}

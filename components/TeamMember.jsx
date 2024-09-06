import Image from "next/image";

export default function TeamMember({
  firstName,
  lastName,
  jerseyNumber,
  position,
  image,
}) {
  return (
    <div className="w-[360px] rounded-xl mt-4 overflow-hidden bg-queens-midnight bg-opacity-80 text-queens-white transform transition-all duration-300 hover:scale-105 mb-4 mx-2">
      <div className="relative">
        {/* Team Member Image */}
        <Image
          src={image}
          alt={`${firstName} ${lastName}`}
          width={360}
          height={240}
          className="w-full h-[240px] object-cover"
        />

        {/* Jersey Number */}
        <div className="absolute top-0 right-0 bg-queens-emerald text-queens-white text-4xl font-bold p-2 rounded-bl-xl">
          {jerseyNumber}
        </div>

        {/* Lalitpur Queens Logo */}
        <div className="absolute top-0 left-0 p-2">
          <Image
            src="/images/Lalitpur-queens-logo.png"
            alt="Lalitpur Queens Logo"
            width={100}
            height={100}
            className="object-contain bg-transparent"
          />
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-2xl font-bold mb-1">
          <span className="text-queens-green">{firstName}</span>{" "}
          <span className="text-blue-300">{lastName}</span>
        </h3>
        <p className="text-queens-white text-lg italic">{position}</p>
      </div>
    </div>
  );
}

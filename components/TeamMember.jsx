import Image from "next/image";

export default function TeamMember({
  firstName,
  lastName,
  jerseyNumber,
  position,
  image,
}) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2">
      {/* Card Header with Accent Gradient */}
      <div className="h-2 bg-gradient-to-r from-brand-primary to-brand-secondary"></div>

      {/* Image and Jersey Number */}
      <div className="relative pt-8 px-4">
        {/* Jersey Number Badge */}
        <div className="absolute top-2 right-2 bg-accent text-text-primary font-bold px-3 py-1 rounded-full shadow-md">
          #{jerseyNumber}
        </div>

        {/* Player Image with Frame */}
        <div className="relative mx-auto w-32 h-32 rounded-full border-4 border-background overflow-hidden bg-background">
          <Image
            src={image}
            alt={`${firstName} ${lastName}`}
            fill
            sizes="128px"
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Player Info */}
      <div className="p-4 text-center bg-gradient-to-b from-white to-background mt-4">
        <h3 className="text-2xl font-bold mb-1 group-hover:text-brand-primary transition-colors duration-300">
          <span className="text-brand-primary">{firstName}</span>{" "}
          <span className="text-brand-secondary">{lastName}</span>
        </h3>

        {/* Position Badge */}
        <div className="inline-block bg-brand-primary bg-opacity-10 text-brand-primary text-sm font-medium py-1 px-3 rounded-full mt-2">
          {position}
        </div>
      </div>

      {/* Decorative Footer */}
      <div className="h-1 bg-brand-primary opacity-50"></div>
    </div>
  );
}

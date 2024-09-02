// components/TeamMember.js
import Image from "next/image";

export default function TeamMember({
  firstName,
  lastName,
  jerseyNumber,
  position,
  image,
}) {
  return (
    <div className="bg-white w-[400px] rounded-lg shadow-md overflow-hidden ">
      <Image
        src={image}
        alt={firstName + " " + lastName}
        width={600}
        height={500}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="text-xl font-semibold mb-1">
          {firstName + " " + lastName}
        </h3>
        <p className="text-gray-600">{position}</p>
      </div>
    </div>
  );
}

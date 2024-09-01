// components/NewsCard.js
import Image from "next/image";

export default function NewsCard({ title, excerpt, image, date }) {
  return (
    <div className=" bg-queens-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <Image
        src={image}
        alt={title}
        width={400}
        height={250}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-2">{excerpt}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
    </div>
  );
}

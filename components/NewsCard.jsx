import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NewsCard({ id, title, excerpt, image, date }) {
  const router = useRouter();

  const handleReadMoreClick = () => {
    router.push(`/News/${id}`);
  };

  return (
    <div className="max-w-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      {/* News Image */}
      <div className="relative h-56">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 ease-in-out"
        />
      </div>

      {/* Title */}
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-brand-primary hover:text-brand-secondary transition-colors duration-300 ease-in-out">
          {title}
        </div>
      </div>

      <div className="p-6 transition-colors duration-300 ease-in-out bg-white hover:bg-info hover:bg-opacity-20 rounded-b-xl">
        <div className="text-text-primary hover:text-brand-primary mb-4 leading-relaxed tracking-wide">
          {/* Excerpt */}
          <span className="block text-md font-medium">{excerpt}</span>
        </div>
        <div className="flex justify-between items-center mt-4">
          {/* Date */}
          <span className="text-sm text-text-secondary transition-colors duration-300 ease-in-out hover:text-brand-primary italic">
            {date}
          </span>
          {/* Read More Button */}
          <button
            onClick={handleReadMoreClick}
            className="bg-brand-secondary text-white text-xs font-semibold py-2 px-4 rounded-full transition-transform duration-300 hover:bg-brand-primary hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-opacity-50 cursor-pointer"
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
}

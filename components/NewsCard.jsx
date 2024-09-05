import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NewsCard({ id, title, excerpt, image, date }) {
  const router = useRouter();
  console.log("id", id);

  const handleReadMoreClick = () => {
    router.push(`/News/${id}`);
  };

  return (
    <div className="bg-queens-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl  hover:text-queens-white">
      {/* Image Section */}
      <div className="relative">
        <Image
          src={image}
          alt={title}
          width={400}
          height={250}
          className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
          <h3 className="text-xl font-bold text-queens-white leading-tight">
            {title}
          </h3>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 transition-colors duration-300 ease-in-out bg-queens-white hover:bg-blue-300 bg-opacity-5  rounded-b-xl">
        <div className="text-queens-black hover:text-queens-white mb-4 leading-relaxed tracking-wide">
          {/* Excerpt */}
          <span className="block text-md font-medium">{excerpt}</span>
        </div>
        <div className="flex justify-between items-center mt-4">
          {/* Date */}
          <span className="text-sm text-queens-midnight transition-colors duration-300 ease-in-out hover:text-queens-white italic">
            {date}
          </span>
          {/* Read More Button */}
          <button
            onClick={handleReadMoreClick}
            className="bg-queens-emerald text-queens-white text-xs font-semibold py-2 px-4 rounded-full transition-transform duration-300 hover:bg-queens-green  hover:scale-105 focus:outline-none focus:ring-2 focus:ring-queens-green focus:ring-opacity-50 cursor-pointer"
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
}

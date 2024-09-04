import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NewsCard({ id, title, excerpt, image, date }) {
  const router = useRouter();

  const handleReadMoreClick = () => {
    router.push(`/news/${id}`);
  };

  return (
    <div className="bg-queens-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="relative">
        <Image
          src={image}
          alt={title}
          width={400}
          height={250}
          className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4">
          <h3 className="text-xl font-bold text-queens-white leading-tight">
            {title}
          </h3>
        </div>
      </div>
      <div className="p-6 bg-queens-white">
        <p className="text-queens-black mb-4 line-clamp-3">{excerpt}</p>
        <div className="flex justify-between items-center">
          <p className="text-sm text-queens-midnight">{date}</p>
          <button
            onClick={handleReadMoreClick}
            className="bg-queens-emerald text-queens-white text-xs font-semibold py-1 px-3 rounded-full transition duration-300 hover:bg-queens-green focus:outline-none focus:ring-2 focus:ring-queens-green focus:ring-opacity-50 cursor-pointer"
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
}

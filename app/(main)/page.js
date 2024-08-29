import Image from "next/image";
import Link from "next/link";
import MatchCard from "@/components/MatchCard";
import NewsCard from "@/components/NewsCard";
export default function Home() {
  return (
    <>
      <section className="relative bg-queens-green text-queens-white py-24 md:py-32">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Volleyball court"
            layout="fill"
            objectFit="cover"
            className="opacity-30"
          />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Lalitpur Queens
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Empowering women through volleyball
          </p>
          <Link
            href="/about"
            className="bg-queens-blue text-queens-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-queens-emerald transition duration-300"
          >
            Learn More
          </Link>
        </div>
      </section>

      <section className="py-16 bg-queens-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-queens-midnight">
            Upcoming Matches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MatchCard
              date="May 15, 2024"
              opponent="Kathmandu Strikers"
              location="Dasharath Stadium"
              time="3:00 PM"
            />
            <MatchCard
              date="May 22, 2024"
              opponent="Pokhara Phoenixes"
              location="Pokhara Stadium"
              time="4:30 PM"
            />
            <MatchCard
              date="May 29, 2024"
              opponent="Biratnagar Blazers"
              location="Dasharath Stadium"
              time="3:00 PM"
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-queens-emerald bg-opacity-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-queens-midnight">
            Latest News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <NewsCard
              title="Queens Triumph in Season Opener"
              excerpt="Lalitpur Queens start the season with a bang, defeating Kathmandu Strikers in a thrilling match."
              image="/images/hero-bg.jpg"
              date="May 1, 2024"
            />
            <NewsCard
              title="Team Captain Wins Player of the Month"
              excerpt="Our captain, Asha Gurung, has been named Player of the Month for her outstanding performance."
              image="/images/news-2.jpg"
              date="April 15, 2024"
            />
            <NewsCard
              title="Queens to Host Volleyball Clinic for Young Girls"
              excerpt="Lalitpur Queens announce a free volleyball clinic to inspire the next generation of players."
              image="/images/news-3.jpeg"
              date="April 5, 2024"
            />
          </div>
        </div>
      </section>
      {/* Add a section for sponsors */}

      <section className="py-16 bg-queens-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-queens-midnight">
            Our Sponsors
          </h2>
          <h3 className="text-xl font-semibold mb-8 text-center text-queens-midnight">
            Title Sponsors
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex justify-center items-center">
              <Image
                src="/images/sponsor-1.png"
                alt="Sponsor 1"
                width={150}
                height={150}
              />
            </div>
            <div className="flex justify-center items-center">
              <Image
                src="/images/sponsor-2.png"
                alt="Sponsor 2"
                width={150}
                height={150}
              />
            </div>
            <div className="flex justify-center items-center">
              <Image
                src="/images/sponsor-3.png"
                alt="Sponsor 3"
                width={150}
                height={150}
              />
            </div>
            <div className="flex justify-center items-center">
              <Image
                src="/images/sponsor-4.png"
                alt="Sponsor 4"
                width={150}
                height={150}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

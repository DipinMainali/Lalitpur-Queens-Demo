import NewsCard from "@/components/NewsCard";

export default function Team() {
  return (
    <>
      <div className="bg-queens-white">
        <div className="container px-8 py-4">
          <h1 className=" text-2xl ">News</h1>
        </div>
        <div className="container flex flex-row gap-4 mx-auto px-4 pb-16">
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
    </>
  );
}

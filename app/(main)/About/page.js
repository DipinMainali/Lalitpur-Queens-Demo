// app/about/page.js
import Image from "next/image";

export default function About() {
  return (
    <div className="bg-queens-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-queens-midnight">
          About Lalitpur Queens
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="mb-4 text-queens-black">
              Lalitpur Queens is a premier women&apos;s volleyball team based in
              Lalitpur, Nepal. Founded in 2020, our team has quickly risen to
              become one of the most competitive and respected volleyball
              franchises in the country.
            </p>
            <p className="mb-4 text-queens-black">
              Our mission is to empower women through sports, providing
              opportunities for talented athletes to showcase their skills and
              inspire the next generation of volleyball players.
            </p>
            <p className="text-queens-black">
              We are committed to excellence both on and off the court,
              fostering a culture of teamwork, dedication, and community
              engagement.
            </p>
          </div>
          <div className="relative h-64 md:h-auto">
            <Image
              src="/images/team-photo.jpg"
              alt="Lalitpur Queens Team"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

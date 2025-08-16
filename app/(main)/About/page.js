// app/about/page.js
import Image from "next/image";

export default function About() {
  // Owner data
  const owners = [
    {
      name: "Ramesh Parajuli",
      title: "Chairman",
      image: "/images/about-owners/RameshParajuli-Chairman.jpg",
      quote:
        "Our vision is to create a platform that not only showcases the incredible talent of women volleyball players in Nepal but also inspires the next generation of athletes.",
    },
    {
      name: "Ayush Bikram Shah",
      title: "Director",
      image: "/images/about-owners/AyushBikramShah-Director.jpg",
      quote:
        "Lalitpur Queens represents our commitment to excellence, community engagement, and the advancement of women's sports in Nepal.",
    },
    {
      name: "Suresh Giri",
      title: "Director",
      image: "/images/about-owners/SureshGiri-Director.jpg",
      quote:
        "We're building more than a team—we're creating a movement that celebrates the power, grace, and determination of women athletes.",
    },
  ];

  return (
    <div className="bg-queens-white">
      {/* About Intro Section */}
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-queens-midnight">
          About Lalitpur Queens
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="mb-4 text-queens-black">
              Lalitpur Queens is a premier women&apos;s volleyball team based in
              Lalitpur, Nepal. Founded in 2024, our team has quickly risen to
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

      {/* Meet Our Owners Section */}
      <section className="py-20 bg-gradient-to-b from-white to-background">
        <div className="container mx-auto px-4">
          {/* Section Header with Animated Bar */}
          <div className="relative mb-16 text-center">
            <h2 className="text-4xl font-bold text-text-primary inline-block relative">
              Meet Our Owners
              <span className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary"></span>
            </h2>
            <p className="text-text-secondary mt-6 max-w-3xl mx-auto">
              Lalitpur Queens is proudly owned by Rupse Holidays, a company
              committed to promoting sports excellence and creating
              opportunities for athletes in Nepal.
            </p>
          </div>

          {/* Staggered Owners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {owners.map((owner, index) => (
              <div
                key={owner.name}
                className={`${
                  index === 1 ? "md:transform md:-translate-y-12" : ""
                }`}
              >
                <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  {/* Owner Image */}
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={owner.image}
                      alt={owner.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Hidden Quote that appears on hover */}
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <p className="italic text-sm">"{owner.quote}"</p>
                    </div>
                  </div>

                  {/* Owner Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-brand-primary">
                      {owner.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className="h-px w-10 bg-brand-secondary"></span>
                      <span className="ml-3 text-brand-secondary font-medium">
                        {owner.title}
                      </span>
                    </div>
                  </div>

                  {/* Decorative accent */}
                  <div className="h-1 bg-gradient-to-r from-brand-primary to-brand-secondary"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Rupse Holidays Info */}
          <div className="mt-20 bg-white rounded-2xl shadow-lg max-w-4xl mx-auto overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left side with logo and content */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="inline-block bg-brand-primary/10 text-brand-primary text-sm font-medium py-1 px-3 rounded-full mb-6">
                  Our Parent Company
                </div>
                <h3 className="text-2xl font-bold mb-4 text-text-primary">
                  Rupse Holidays
                </h3>
                <p className="text-text-secondary mb-6">
                  Rupse Holidays has a long-standing commitment to sports
                  development and community engagement across Nepal. The
                  company's investment in Lalitpur Queens represents their
                  dedication to growing women's sports and creating
                  inspirational role models.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-secondary transition-colors duration-300 font-medium"
                >
                  <span>Learn more about Rupse Holidays</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>

              {/* Right side with decorative pattern */}
              <div className="bg-gradient-to-br from-brand-primary to-brand-secondary relative hidden md:block">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
                </div>
                <div className="h-full flex items-center justify-center p-10">
                  <div className="bg-white/90 p-6 rounded-xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <h4 className="text-xl font-bold text-brand-primary">
                      Our Values
                    </h4>
                    <ul className="mt-4 space-y-2">
                      <li className="flex items-start gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-brand-secondary flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-text-primary">
                          Excellence in sports
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-brand-secondary flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-text-primary">
                          Women empowerment
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-brand-secondary flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-text-primary">
                          Community development
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-brand-secondary flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-text-primary">
                          National pride
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

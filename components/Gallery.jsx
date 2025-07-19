import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const Gallery = () => {
  const [isVisible, setIsVisible] = useState(false);
  const galleryRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (galleryRef.current) {
      observer.observe(galleryRef.current);
    }

    return () => {
      if (galleryRef.current) {
        observer.unobserve(galleryRef.current);
      }
    };
  }, []);

  // Gallery image details
  const galleryImages = [
    {
      id: 1,
      src: "/images/gallery/one.jpg",
      alt: "Team celebration moment",
      position: "left-top",
    },
    {
      id: 2,
      src: "/images/gallery/two.jpg",
      alt: "Game action shot",
      position: "left-middle",
    },
    {
      id: 3,
      src: "/images/gallery/three.jpg",
      alt: "Team strategy session",
      position: "left-bottom",
    },
    {
      id: 4,
      src: "/images/gallery/four.jpg",
      alt: "Match point celebration",
      position: "right-top",
    },
    {
      id: 5,
      src: "/images/gallery/five.jpg",
      alt: "Perfect form serve",
      position: "right-middle-left",
    },
    {
      id: 6,
      src: "/images/gallery/six.jpg",
      alt: "Victory moment",
      position: "right-middle-right",
    },
    {
      id: 7,
      src: "/images/gallery/seven.jpg",
      alt: "Championship winning point",
      position: "extra",
    },
  ];

  return (
    <section
      ref={galleryRef}
      className="relative py-16 md:py-24 bg-gradient-to-b from-white to-background overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-primary opacity-5 transform translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-brand-secondary opacity-5 transform -translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-accent opacity-5 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Section Header */}
      <div className="container mx-auto px-5 mb-12 md:mb-16">
        <div className="text-center">
          <h2
            className={`text-4xl md:text-5xl font-bold text-text-primary mb-3 transition-transform duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            Queens in Action
          </h2>
          <div
            className="w-24 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto mb-6 transition-all duration-1000 delay-300"
            style={{
              width: isVisible ? "120px" : "0px",
              opacity: isVisible ? 1 : 0,
            }}
          ></div>
          <p
            className={`text-lg text-text-secondary max-w-2xl mx-auto transition-all duration-700 delay-500 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            Witness our team&apos;s passion, determination, and skill through
            these captured moments.
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-5 lg:px-32">
        <div className="-m-1 md:-m-2 flex flex-col sm:flex-row flex-wrap">
          {/* Left column */}
          <div
            className={`flex w-full sm:w-1/2 flex-wrap lg:flex-row flex-row-reverse transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            {/* Left top */}
            <div
              className="w-full lg:w-1/2 p-1 md:p-2 overflow-hidden transition-transform duration-700 delay-100"
              style={{ transitionDelay: "100ms" }}
            >
              <div className="group relative h-full overflow-hidden rounded-lg 2xl:rounded-2xl">
                <Image
                  src="/images/gallery/one.jpg"
                  alt="Team celebration moment"
                  width={400}
                  height={300}
                  className="block h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white text-sm md:text-base font-medium">
                    Team celebration moment
                  </p>
                </div>
              </div>
            </div>

            {/* Left middle */}
            <div
              className="w-full lg:w-1/2 p-1 md:p-2 overflow-hidden"
              style={{ transitionDelay: "200ms" }}
            >
              <div className="group relative h-full overflow-hidden rounded-lg 2xl:rounded-2xl">
                <Image
                  src="/images/gallery/two.jpg"
                  alt="Game action shot"
                  width={400}
                  height={300}
                  className="block h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white text-sm md:text-base font-medium">
                    Game action shot
                  </p>
                </div>
              </div>
            </div>

            {/* Left bottom */}
            <div
              className="w-full p-1 md:p-2 overflow-hidden"
              style={{ transitionDelay: "300ms" }}
            >
              <div className="group relative overflow-hidden rounded-lg 2xl:rounded-2xl">
                <Image
                  src="/images/gallery/three.jpg"
                  alt="Team strategy session"
                  width={800}
                  height={500}
                  className="block h-full w-full object-cover object-center max-h-none lg:max-h-[1000px] transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white text-sm md:text-base font-medium">
                    Team strategy session
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div
            className={`flex w-full sm:w-1/2 flex-wrap transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            {/* Right top */}
            <div
              className="w-full p-1 md:p-2 overflow-hidden"
              style={{ transitionDelay: "400ms" }}
            >
              <div className="group relative overflow-hidden rounded-lg 2xl:rounded-2xl">
                <Image
                  src="/images/gallery/four.jpg"
                  alt="Match point celebration"
                  width={800}
                  height={500}
                  className="block h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white text-sm md:text-base font-medium">
                    Match point celebration
                  </p>
                </div>
              </div>
            </div>

            {/* Right middle left */}
            <div
              className="w-1/2 p-1 md:p-2 overflow-hidden"
              style={{ transitionDelay: "500ms" }}
            >
              <div className="group relative h-full overflow-hidden rounded-lg 2xl:rounded-2xl">
                <Image
                  src="/images/gallery/five.jpg"
                  alt="Perfect form serve"
                  width={400}
                  height={300}
                  className="block h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white text-sm md:text-base font-medium">
                    Perfect form serve
                  </p>
                </div>
              </div>
            </div>

            {/* Right middle right */}
            <div
              className="w-1/2 p-1 md:p-2 overflow-hidden"
              style={{ transitionDelay: "600ms" }}
            >
              <div className="group relative h-full overflow-hidden rounded-lg 2xl:rounded-2xl">
                <Image
                  src="/images/gallery/six.jpg"
                  alt="Victory moment"
                  width={400}
                  height={300}
                  className="block h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white text-sm md:text-base font-medium">
                    Victory moment
                  </p>
                </div>
              </div>
            </div>

            {/* Extra image - show only on larger screens */}
            <div
              className="w-full p-1 md:p-2 overflow-hidden hidden md:block"
              style={{ transitionDelay: "700ms" }}
            >
              <div className="group relative h-48 overflow-hidden rounded-lg 2xl:rounded-2xl">
                <Image
                  src="/images/gallery/seven.jpg"
                  alt="Championship winning point"
                  width={800}
                  height={400}
                  className="block h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-accent/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white text-sm md:text-base font-medium">
                    Championship winning point
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View More Button */}
      {/* <div
        className={`text-center mt-12 md:mt-16 transition-all duration-700 delay-800 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <a
          href="/gallery"
          className="inline-block bg-transparent border-2 border-brand-primary text-brand-primary hover:text-white hover:bg-brand-primary rounded-full py-3 px-10 font-semibold transition-all duration-300 hover:shadow-lg"
        >
          View Full Gallery
        </a>
      </div> */}

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-16"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V100.94C50.28,91.79,98.78,80.6,150.7,71.7A808.88,808.88,0,0,1,321.39,56.44Z"
            fill="white"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Gallery;

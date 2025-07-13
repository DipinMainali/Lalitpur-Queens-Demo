// JourneySection component
function JourneySection() {
  // Data for the timeline events
  const timelineEvents = [
    {
      year: "2024",
      title: "Foundation",
      description:
        "Lalitpur Queens was founded with a vision to create the premier women's volleyball franchise in Nepal, setting the stage for a new era of professional sports representing beautiful cultural and historical city Lalitpur",
      image:
        "https://assets-cdn-api.ekantipur.com/thumb.php?src=https://assets-cdn.ekantipur.com/uploads/source/news/kantipur/2024/third-party/lalitpurqueens09262024d2a1862-copy-2892024023636-1000x0.jpg&w=1001&h=0", // Placeholder image
      imageAlt: "Lalitpur Queens team foundation",
      isLeft: true,
    },
    {
      year: "2024",
      title: "First Tournament",
      description:
        "Our debut in the Vatsalya Women's Volleyball League marked the beginning of our competitive journey, showcasing our talent and determination as a new team.",
      image:
        "https://scontent.fktm3-1.fna.fbcdn.net/v/t39.30808-6/472119381_122128302188511632_8963721117077195667_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=f727a1&_nc_ohc=ZbncwQKrHC8Q7kNvwESQoEB&_nc_oc=AdmW4a_XLh-JkLDii16w7z1IYOZKa0TZiNhdzJkRWqXKAsUDCj8oPUsdmpFXoS_dMsI5g_-Rn57wDCjoLZk0C9EA&_nc_zt=23&_nc_ht=scontent.fktm3-1.fna&_nc_gid=Y9TOJQUbEhUcQoXWLZaIbg&oh=00_AfQyMF87qNzNx6UpviZNPz5K8D_jnJ6at04wNgDhtMjk6A&oe=6872C6C7", // Placeholder image
      imageAlt: "Lalitpur Queens first tournament",
      isLeft: false,
    },
    {
      year: "2024",
      title: "Runner Up Title",
      description:
        "A historic moment as we claimed our first major runner-up title, proving that dedication and teamwork can overcome any challenge.",
      image:
        "https://scontent.fktm3-1.fna.fbcdn.net/v/t39.30808-6/471325564_122128528370511632_2464875196885137189_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=vIw2o7W4Es4Q7kNvwGMXsVY&_nc_oc=Adlfo9Kf8YHqVenbXgSFMcjnm8Z9H_Kip75fw0EG0IzigSyHJmGiXs3wYenQul1wjldoVZS_06ekK0LMrdF6cXzS&_nc_zt=23&_nc_ht=scontent.fktm3-1.fna&_nc_gid=ay8nsu23ZjZr43KsomVpLg&oh=00_AfRj50npiS_MBcKs1Tc9UmLTYGQivGpNORFaxcqooMfFdA&oe=6872D28D", // Placeholder image
      imageAlt: "Lalitpur Queens Runner-Up Title",
      isLeft: true,
    },
    {
      year: "2024",
      title: "Training Facility",
      description:
        "Investment in world-class training facilities and coaching staff elevated our team's performance to international standards.",
      image:
        "https://scontent.fktm3-1.fna.fbcdn.net/v/t39.30808-6/471987544_122128290554511632_4777309750770517659_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=rYXRsVsLmZcQ7kNvwHsWQoc&_nc_oc=AdnVhXdPhxvZ07gK_Fntz21PDzfQKtImjlsZ7q_ux2PptqtZA5wvz7i3PB9_MZ9iBjLFGa7OlINhaK9VlP4GPUfk&_nc_zt=23&_nc_ht=scontent.fktm3-1.fna&_nc_gid=xSy4wfX9xhwrOv5--R_cQg&oh=00_AfSyWzk607AfG9i8wWjk5nZsWt7pQBYeM7g_cS5Gyiw6xQ&oe=6872F86D", // Placeholder image
      imageAlt: "Lalitpur Queens training facility",
      isLeft: false,
    },
    {
      year: "2025",
      title: "Legacy Continues",
      description:
        "Today, we continue to inspire the next generation of female athletes while maintaining our position as champions and role models.",
      image:
        "https://scontent.fktm3-1.fna.fbcdn.net/v/t39.30808-6/472247732_122128533212511632_8059340336317398811_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=f727a1&_nc_ohc=HUmNzGGFLAwQ7kNvwFoHh1K&_nc_oc=AdmKNjzSUmkTBPG5Zu_S7qkFlQe1SJi_kCSYaaOZea-QWX5xicv3rpH0upUMZOswC_vtXRO-uDc9gVuLt8XvWZix&_nc_zt=23&_nc_ht=scontent.fktm3-1.fna&_nc_gid=ZZ9e29DsA0eAC7oQbv4VRg&oh=00_AfQuFOLJvDZcUttF3em5CbHKJ8T8Tq9bCDbSQLI9rUhVEQ&oe=6872EB3F", // Placeholder image
      imageAlt: "Lalitpur Queens legacy continues",
      isLeft: true,
    },
  ];

  // Statistics data
  const stats = [
    {
      icon: (
        <svg
          className="w-8 h-8 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      ),
      value: "1+",
      label: "Years of Excellence",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.324 1.118l1.519 4.674c.3.921-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.519-4.674a1 1 0 00-.324-1.118L2.928 9.101c-.783-.57-.381-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"
          ></path>
        </svg>
      ),
      value: "1",
      label: "Runner Up Title",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h-2v-2a4 4 0 00-8 0v2H7a2 2 0 00-2 2v3a1 1 0 001 1h12a1 1 0 001-1v-3a2 2 0 00-2-2z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 10a6 6 0 016 6v2a2 2 0 002 2h2"
          ></path>
        </svg>
      ),
      value: "20+",
      label: "Athletes Developed",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          ></path>
        </svg>
      ),
      value: "1000+",
      label: "Lives Inspired",
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-block p-3 bg-purple-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            ></path>
          </svg>
        </div>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Our Journey
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          From humble beginnings to championship glory, discover the inspiring
          story of Lalitpur Queens and our relentless pursuit of excellence.
        </p>
      </div>

      {/* Timeline Section */}
      <div className="relative wrap overflow-hidden p-10 h-full">
        {/* Vertical line */}
        <div className="border-2-2 absolute border-opacity-20 border-purple-200 h-full border left-1/2 transform -translate-x-1/2 hidden md:block"></div>

        {timelineEvents.map((event, index) => (
          <TimelineItem key={index} {...event} />
        ))}
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
          />
        ))}
      </div>
    </section>
  );
}

// TimelineItem component
function TimelineItem({ year, title, description, image, imageAlt, isLeft }) {
  return (
    <div
      className={`mb-8 flex justify-between items-center w-full ${
        isLeft ? "flex-row-reverse md:flex-row" : "flex-row"
      }`}
    >
      {/* Left side (for text on desktop, image on mobile) */}
      <div
        className={`order-1 w-full md:w-5/12 ${
          isLeft ? "md:pr-16" : "md:pl-16"
        }`}
      >
        <div className="bg-purple-50 rounded-lg shadow-md p-6 relative">
          <h3 className="mb-2 font-semibold text-purple-800 text-xl">
            {title}
          </h3>
          <p className="text-sm leading-snug text-gray-700">{description}</p>
        </div>
      </div>

      {/* Circle dot */}
      <div className="z-20 flex items-center order-1 bg-purple-600 shadow-xl w-8 h-8 rounded-full hidden md:flex justify-center items-center">
        <span className="text-white font-bold text-xs">{year.slice(2)}</span>{" "}
        {/* Display last two digits of year */}
      </div>

      {/* Right side (for image on desktop, text on mobile) */}
      <div
        className={`order-1 w-full md:w-5/12 ${
          isLeft ? "md:pl-16" : "md:pr-16"
        }`}
      >
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-48 object-cover rounded-t-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/400x250/E0E0E0/333333?text=Image+Not+Found";
            }}
          />
          <div className="p-4 md:hidden">
            {" "}
            {/* Show year and title on mobile below image */}
            <h3 className="mb-2 font-semibold text-purple-800 text-xl">
              {year} - {title}
            </h3>
            <p className="text-sm leading-snug text-gray-700">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// StatCard component
function StatCard({ icon, value, label }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center flex flex-col items-center justify-center">
      <div className="mb-4">{icon}</div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-gray-600 text-sm">{label}</p>
    </div>
  );
}
export default JourneySection;

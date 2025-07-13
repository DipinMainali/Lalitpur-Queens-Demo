import React, { useEffect, useState } from "react";
import Image from "next/image";

const TeamBehindTeam = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStaff, setActiveStaff] = useState(null);

  // Using local images from the public/images/staff folder
  const coachingStaff = [
    {
      id: 1,
      name: "Utsav Khadka",
      role: "Head Coach",
      image: "/images/staff/head-coach.jpg",
      bio: "Former national player with 10+ years of coaching experience",
      achievement: "FIVB Coaches Course Level III",
    },
    {
      id: 2,
      name: "Yugesh Hamal",
      role: "Assistant Coach",
      image: "/images/staff/assistant-coach.jpg",
      bio: "Specializes in defensive strategies and player development",
      achievement: "Former university champion coach",
    },
    {
      id: 3,
      name: "Purnima Ghising",
      role: "Team Physio",
      image: "/images/staff/physio.jpg",
      bio: "Sports medicine specialist with expertise in volleyball-specific injuries",
      achievement: "Certified sports rehabilitation expert",
    },
  ];

  const managementStaff = [
    {
      id: 4,
      name: "Utsav Shakya",
      role: "General Manager",
      image: "/images/staff/general-manager.jpg",
      bio: "Former sports executive with extensive experience in team management",
      achievement: "Developed youth volleyball programs nationwide",
    },
    {
      id: 5,
      name: "Abiskar Bikram Rai",
      role: "Head of Media & Communications",
      image: "/images/staff/media-head.jpg",
      bio: "Media professional with background in sports journalism and PR",
      achievement: "Award-winning sports documentary producer",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector("#team-behind-team");
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <section
      id="team-behind-team"
      className="py-32 bg-gradient-to-b from-white to-background relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent opacity-10"
          style={{
            animation: "float 15s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-brand-primary opacity-10"
          style={{
            animation: "float 20s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-brand-secondary opacity-5"
          style={{
            animation: "pulse 7s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-accent opacity-5"
          style={{
            animation: "pulse 10s ease-in-out infinite 2s",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header with Animated Underline */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary relative inline-block">
            The Team Behind Our Team
            <span
              className="absolute -bottom-3 left-0 w-0 right-0 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary"
              style={{
                animation: isVisible
                  ? "expandWidth 1.5s ease forwards"
                  : "none",
              }}
            ></span>
          </h2>
          <p
            className="text-text-secondary mt-6 max-w-2xl mx-auto text-lg opacity-0"
            style={{
              animation: isVisible ? "fadeInUp 1s ease forwards 0.5s" : "none",
            }}
          >
            Meet the dedicated professionals who work tirelessly behind the
            scenes to ensure our Queens perform at their best.
          </p>
        </div>

        {/* Coaching Staff with Inclined Image Containers */}
        <div className="mb-28">
          <h3
            className="text-3xl font-bold text-brand-primary text-center mb-16 opacity-0"
            style={{
              animation: isVisible ? "fadeInUp 1s ease forwards 0.7s" : "none",
            }}
          >
            Coaching Staff
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {coachingStaff.map((staff, index) => (
              <div
                key={staff.id}
                className={`transform transition-all duration-1000 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  transitionDelay: `${index * 200}ms`,
                  transform: isVisible
                    ? `translateY(0) rotate(0deg)`
                    : `translateY(40px) rotate(${
                        index % 2 === 0 ? "-3deg" : "3deg"
                      })`,
                }}
                onMouseEnter={() => setActiveStaff(staff.id)}
                onMouseLeave={() => setActiveStaff(null)}
              >
                {/* Card with regular container but inclined image */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group relative z-10">
                  {/* Inclined image container with pseudo-element for tilt effect */}
                  <div className="h-64 overflow-hidden relative">
                    {/* Background color gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary to-brand-secondary opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-0"></div>

                    {/* Inclined image container */}
                    <div className="relative h-full w-full transform -skew-y-3 scale-110 translate-y-5 overflow-hidden">
                      <Image
                        src={staff.image}
                        alt={staff.name}
                        width={400}
                        height={300}
                        className="object-cover w-full h-full transform skew-y-3 scale-100 -translate-y-5 transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/200x200/${
                            staff.id % 2 === 0 ? "0B8457" : "10316B"
                          }/FFFFFF?text=${staff.name.charAt(0)}`;
                        }}
                      />
                    </div>

                    {/* Role badge that slides in on hover */}
                    <div className="absolute bottom-4 left-0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 z-20">
                      <div className="bg-accent text-text-primary px-4 py-2 rounded-r-full font-bold shadow-lg">
                        {staff.role}
                      </div>
                    </div>
                  </div>

                  {/* Content section */}
                  <div className="p-6 text-center">
                    <h4 className="text-2xl font-bold mb-3 text-text-primary relative inline-block">
                      {staff.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
                    </h4>

                    <p className="text-text-secondary mt-2">{staff.bio}</p>

                    {/* Achievement that appears on hover with slide-up animation */}
                    <div className="mt-4 h-0 overflow-hidden opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 bg-background bg-opacity-30 rounded-lg">
                      <div className="py-3 px-4">
                        <div className="text-sm font-medium text-brand-secondary">
                          ACHIEVEMENT
                        </div>
                        <div className="italic text-text-secondary">
                          {staff.achievement}
                        </div>
                      </div>
                    </div>

                    {/* Social icons that fade in on hover */}
                    <div className="flex justify-center mt-4 space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      <a
                        href="#"
                        className="text-brand-primary hover:text-brand-secondary transition-all duration-300 hover:scale-125"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="text-brand-primary hover:text-brand-secondary transition-all duration-300 hover:scale-125"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Border highlight that animates on hover */}
                  <div className="absolute inset-0 border-2 border-transparent rounded-xl group-hover:border-brand-primary opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Management Team with 3D Card Effect */}
        <div className="mb-24">
          <h3
            className="text-3xl font-bold text-brand-secondary text-center mb-16 opacity-0"
            style={{
              animation: isVisible ? "fadeInUp 1s ease forwards 1.2s" : "none",
            }}
          >
            Management Team
          </h3>
          <div className="flex flex-col md:flex-row gap-10 justify-center items-stretch">
            {managementStaff.map((staff, index) => (
              <div
                key={staff.id}
                className={`perspective-1000 md:w-2/5 transform transition-all duration-1000 ${
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                }`}
                style={{
                  transitionDelay: `${(index + coachingStaff.length) * 200}ms`,
                }}
              >
                {/* 3D Card Container */}
                <div
                  className="relative bg-white rounded-xl shadow-xl overflow-hidden h-full preserve-3d hover:shadow-2xl transition-all duration-500 group"
                  style={{
                    transformStyle: "preserve-3d",
                    transform:
                      activeStaff === staff.id
                        ? "rotateY(10deg) rotateX(5deg)"
                        : "rotateY(0) rotateX(0)",
                  }}
                >
                  {/* Card Header with Inclined Image */}
                  <div className="h-56 relative overflow-hidden">
                    {/* Inclined gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-primary to-background transform -skew-y-3 scale-110">
                      {/* Decorative circles */}
                      <div className="absolute top-4 left-4 w-12 h-12 rounded-full border-2 border-white opacity-30 transform -translate-z-10"></div>
                      <div className="absolute bottom-12 right-8 w-20 h-20 rounded-full border-2 border-white opacity-20 transform -translate-z-10"></div>
                    </div>

                    {/* Image Container that floats out on hover */}
                    <div
                      className="absolute -bottom-12 inset-x-0 flex justify-center transform group-hover:translate-y-2 transition-transform duration-500"
                      style={{
                        transform:
                          activeStaff === staff.id ? "translateY(-5px)" : "",
                        transitionDuration: "0.5s",
                      }}
                    >
                      <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg relative z-30">
                        <div className="absolute inset-0 bg-accent opacity-0 mix-blend-overlay group-hover:opacity-20 transition-opacity duration-300"></div>
                        <Image
                          src={staff.image}
                          alt={staff.name}
                          width={128}
                          height={128}
                          className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/200x200/${
                              staff.id % 2 === 0 ? "10316B" : "0B8457"
                            }/FFFFFF?text=${staff.name.charAt(0)}`;
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 pt-20 text-center flex-grow flex flex-col justify-between relative z-10">
                    <div>
                      {/* Name with animated underline */}
                      <h4 className="relative inline-block text-2xl font-bold mb-1 text-brand-primary">
                        {staff.name}
                        <span className="absolute -bottom-1 left-0 w-0 right-auto h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                      </h4>

                      {/* Role badge */}
                      <div className="inline-block bg-accent px-4 py-1 rounded-full text-text-primary text-sm font-medium mb-4 transform group-hover:scale-105 transition-transform duration-300 shadow-sm">
                        {staff.role}
                      </div>

                      {/* Bio */}
                      <p className="text-text-secondary">{staff.bio}</p>

                      {/* Achievement that slides in from bottom */}
                      <div className="mt-4 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="py-2 px-3 bg-brand-primary bg-opacity-5 rounded-lg text-sm">
                          <span className="text-brand-primary font-medium">
                            Achievement:
                          </span>{" "}
                          {staff.achievement}
                        </div>
                      </div>
                    </div>

                    {/* Social Media Icons in Circle Formation */}
                    <div className="mt-6 flex justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <a
                        href="#"
                        className="text-background hover:text-brand-primary bg-brand-primary hover:bg-accent transition-colors duration-300 rounded-full p-2 transform hover:scale-110"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="text-background hover:text-brand-primary bg-brand-primary hover:bg-accent transition-colors duration-300 rounded-full p-2 transform hover:scale-110"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* 3D lighting effect */}
                  <div
                    className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white via-transparent to-black opacity-0 group-hover:opacity-5 pointer-events-none"
                    style={{ transform: "translateZ(20px)" }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Values with Floating Animation */}
        <div
          className={`mt-24 text-center max-w-4xl mx-auto transform transition-all duration-1000 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h3 className="text-2xl font-semibold text-text-primary mb-10 relative inline-block">
            Our Values
            <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-accent"></span>
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { value: "Excellence", icon: "🏆" },
              { value: "Teamwork", icon: "👥" },
              { value: "Discipline", icon: "⏱️" },
              { value: "Passion", icon: "🔥" },
              { value: "Resilience", icon: "💪" },
              { value: "Integrity", icon: "⭐" },
            ].map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white shadow-md rounded-full text-brand-primary font-medium hover:bg-brand-primary hover:text-white transition-colors duration-300 transform hover:scale-105"
                style={{
                  animation: `float ${3 + index * 0.5}s ease-in-out infinite ${
                    index * 0.7
                  }s`,
                }}
              >
                <span>{item.icon}</span>
                {item.value}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamBehindTeam;

import React, { useEffect, useState } from "react";
import Image from "next/image";

const TeamBehindTeam = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("coaching");

  // Updated coaching staff array - removed physio
  const coachingStaff = [
    {
      id: 1,
      name: "Utsav Khadka",
      role: "Head Coach",
      image: "/images/staff/head-coach.jpg",
      bio: "Former national player with 10+ years of coaching experience.",
      achievement: "FIVB Coaches Course Level III",
    },
    {
      id: 2,
      name: "Yugesh Hamal",
      role: "Assistant Coach",
      image: "/images/staff/assistant-coach.jpg",
      bio: "Specializes in defensive strategies and player development.",
      achievement: "Former University Champion Coach",
    },
  ];

  const managementStaff = [
    {
      id: 4,
      name: "Utsav Shakya",
      role: "General Manager",
      image: "/images/staff/general-manager.jpg",
      bio: "Former sports executive with extensive experience in team management.",
      achievement:
        "Developed Nationwide National and Local Youth Volleyball Programs.",
    },
    {
      id: 5,
      name: "Abiskar Bikram Rai",
      role: "Head of Media & Communications",
      image: "/images/staff/media-head.jpg",
      bio: "Media professional with background in sports journalism and PR.",
      achievement: "National Award Winning Sports Documentary Producer.",
    },
  ];

  const teamValues = [
    { value: "Excellence", icon: "🏆" },
    { value: "Teamwork", icon: "👥" },
    { value: "Discipline", icon: "⏱️" },
    { value: "Passion", icon: "🔥" },
    { value: "Resilience", icon: "💪" },
    { value: "Integrity", icon: "⭐" },
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
      className="py-20 bg-white relative overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(#10316B 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Simple decorative element */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-secondary to-transparent"></div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header with Minimal Design */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text-primary inline-block relative">
            The Team Behind Our Team
            <div className="h-1 w-12 bg-accent mx-auto mt-4"></div>
          </h2>
          <p className="text-text-secondary mt-5 max-w-2xl mx-auto">
            Meet the dedicated professionals who work tirelessly behind the
            scenes to ensure our Queens perform at their best.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab("coaching")}
              className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
                activeTab === "coaching"
                  ? "bg-brand-primary text-white"
                  : "bg-white text-text-primary hover:bg-gray-50"
              } border border-gray-200 focus:z-10 focus:outline-none transition-colors duration-300`}
            >
              Coaching Staff
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("management")}
              className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                activeTab === "management"
                  ? "bg-brand-primary text-white"
                  : "bg-white text-text-primary hover:bg-gray-50"
              } border border-gray-200 focus:z-10 focus:outline-none transition-colors duration-300`}
            >
              Management Team
            </button>
          </div>
        </div>

        {/* Staff Cards Section - Updated grid for coaching staff */}
        <div className="mb-16">
          {/* Coaching Staff Cards - Changed grid to 2 columns */}
          {activeTab === "coaching" && (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              style={{
                opacity: 0,
                animation: isVisible ? "fadeIn 0.8s ease forwards" : "none",
              }}
            >
              {coachingStaff.map((staff) => (
                <StaffCard key={staff.id} staff={staff} />
              ))}
            </div>
          )}

          {/* Management Staff Cards */}
          {activeTab === "management" && (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              style={{
                opacity: 0,
                animation: isVisible ? "fadeIn 0.8s ease forwards" : "none",
              }}
            >
              {managementStaff.map((staff) => (
                <StaffCard key={staff.id} staff={staff} />
              ))}
            </div>
          )}
        </div>

        {/* Team Values Section - Simplified */}
        <div className="mt-16 text-center max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-text-primary mb-8">
            Our Values
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {teamValues.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="text-lg font-semibold text-brand-primary">
                  {item.value}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Staff Card Component - Reusable and Clean Design
const StaffCard = ({ staff }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-300">
      {/* Image Container */}
      <div className="h-64 relative overflow-hidden">
        <Image
          src={staff.image}
          alt={staff.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/400x300/10316B/FFFFFF?text=${staff.name.charAt(
              0
            )}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content Container */}
      <div className="p-6">
        {/* Role Tag */}
        <div className="inline-block bg-gray-100 px-3 py-1 rounded-md text-text-secondary text-xs font-medium mb-2">
          {staff.role}
        </div>

        {/* Name */}
        <h4 className="text-xl font-bold text-text-primary mb-2 group-hover:text-brand-primary transition-colors duration-300">
          {staff.name}
        </h4>

        {/* Bio */}
        <p className="text-text-secondary text-sm mb-4">{staff.bio}</p>

        {/* Achievement - Only Visible on Hover */}
        <div className="mt-4 overflow-hidden max-h-0 group-hover:max-h-20 transition-all duration-300 ease-in-out">
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs uppercase tracking-wider text-text-secondary mb-1">
              Achievement
            </p>
            <p className="text-sm text-brand-primary">{staff.achievement}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamBehindTeam;

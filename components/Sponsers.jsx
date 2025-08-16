"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await fetch("/api/sponsors");
        const jsonRes = await res.json();
        if (jsonRes.success) {
          setSponsors(jsonRes.data);
        } else {
          console.error(jsonRes.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchSponsors();
  }, []);

  // Group sponsors by tier
  const groupedSponsors = sponsors.reduce((acc, sponsor) => {
    const { tier } = sponsor;
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(sponsor);
    return acc;
  }, {});

  // Get unique tiers for tab navigation
  const sponsorTiers = Object.keys(groupedSponsors);

  return (
    <section className="py-12 bg-white text-center">
      <div className="container mx-auto px-4">
        {/* Concise centered header */}
        <h2 className="text-3xl font-bold text-text-primary mb-2">
          Our Partners
        </h2>
        <div className="h-0.5 w-16 bg-brand-primary mx-auto mb-4"></div>
        <p className="text-text-secondary mb-8 max-w-md mx-auto text-sm">
          Organizations that support our vision for women&apos;s sports
          excellence
        </p>

        {/* Simple tabs */}
        {sponsorTiers.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-1.5 text-sm ${
                activeTab === "all"
                  ? "text-brand-primary font-medium"
                  : "text-gray-500"
              }`}
            >
              All
            </button>
            {sponsorTiers.map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTab(tier)}
                className={`px-4 py-1.5 text-sm ${
                  activeTab === tier
                    ? "text-brand-primary font-medium"
                    : "text-gray-500"
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        )}

        {/* All sponsors view */}
        {activeTab === "all" ? (
          <div className="space-y-10">
            {Object.keys(groupedSponsors).map((tier) => (
              <div key={tier}>
                <h3 className="text-xl font-medium text-center mb-6">
                  <span className="text-brand-primary">{tier}</span> Partners
                </h3>

                <div className="flex flex-wrap justify-center">
                  {groupedSponsors[tier].map((sponsor) => (
                    <div
                      key={sponsor._id}
                      className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-4"
                    >
                      <SponsorCard sponsor={sponsor} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Single tier view
          <div className="flex flex-wrap justify-center">
            {groupedSponsors[activeTab]?.map((sponsor) => (
              <div
                key={sponsor._id}
                className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-4"
              >
                <SponsorCard sponsor={sponsor} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SponsorCard({ sponsor }) {
  return (
    <div className="group flex flex-col items-center">
      {/* Centered image without grayscale effect */}
      <div className="relative h-16 w-full mb-2">
        <Image
          src={sponsor.logo}
          alt={`${sponsor.name} logo`}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-contain object-center"
        />
      </div>

      <h4 className="text-sm font-medium text-gray-600 text-center group-hover:text-brand-primary transition-colors duration-300">
        {sponsor.name}
      </h4>

      <a
        href={sponsor.website}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        Visit
      </a>
    </div>
  );
}

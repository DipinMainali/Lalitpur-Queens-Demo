"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);

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

  return (
    <section className="py-16 bg-queens-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-queens-midnight">
          Our Sponsors
        </h2>
        {Object.keys(groupedSponsors).map((tier) => (
          <div key={tier} className="mb-12">
            <h3 className="text-xl font-semibold mb-8 text-center text-queens-midnight">
              {tier}s
            </h3>
            <div className="flex flex-row flex-wrap gap-8 items-center justify-center mx-auto">
              {groupedSponsors[tier].map((sponsor) => (
                <div
                  key={sponsor._id}
                  className="flex justify-center items-center"
                >
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={sponsor.logo}
                      alt={`${sponsor.name} logo`}
                      width={150}
                      height={150}
                      className="object-contain"
                    />
                  </a>
                </div>
              ))}
            </div>
            {/* Styled Section Break */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-4 border-gradient-to-r from-queens-emerald via-queens-blue to-queens-green"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm text-queens-midnight font-semibold"></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

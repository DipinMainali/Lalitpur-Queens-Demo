"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import SponsorForm from "@/components/AdminComponents/SponsorForm";
import { motion } from "framer-motion";
import { Building, Edit, Briefcase, Loader2 } from "lucide-react";

export default function EditSponsor() {
  const { id } = useParams();
  const [sponsor, setSponsor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSponsor = async () => {
      try {
        const res = await fetch(`/api/sponsors/${id}`);
        const data = await res.json();

        if (data.success) {
          setSponsor(data.data);
        } else {
          setError(data.message || "Failed to fetch sponsor details");
        }
      } catch (err) {
        setError("An error occurred while fetching sponsor details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchSponsor();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-8">
            <div className="bg-brand-secondary p-2 rounded-lg mr-4">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Edit Sponsor</h1>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-brand-secondary animate-spin mb-4" />
            <p className="text-white text-lg">Loading sponsor details...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-8">
            <div className="bg-brand-secondary p-2 rounded-lg mr-4">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Edit Sponsor</h1>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-20 text-center">
            <p className="text-red-400 text-lg mb-2">Error</p>
            <p className="text-white">{error}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-8">
          <div className="bg-brand-secondary p-2 rounded-lg mr-4">
            <Edit className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Edit Sponsor</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden"
            >
              <SponsorForm initialData={sponsor} />
            </motion.div>
          </div>

          {/* Info Panel Column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 sticky top-6"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Building className="w-5 h-5 mr-2 text-brand-secondary" />
                Sponsor Guidelines
              </h2>

              <div className="space-y-6 text-gray-300">
                <div>
                  <h3 className="font-semibold text-brand-secondary mb-2">
                    Sponsor Information
                  </h3>
                  <p className="text-sm">
                    Update the sponsor details including name, website, and tier
                    level. Ensure all information is current and accurately
                    represents the partnership.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-brand-secondary mb-2">
                    Logo Requirements
                  </h3>
                  <p className="text-sm">
                    For best results, upload logos with transparent backgrounds
                    in SVG or PNG format. Recommended minimum size is 400×200
                    pixels.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-brand-secondary mb-2">
                    Sponsorship Tiers
                  </h3>
                  <p className="text-sm">
                    The tier level determines how and where the sponsor is
                    displayed on the website. Title sponsors receive the most
                    prominent placement.
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-700 mt-6">
                  <div className="flex items-center text-sm text-white">
                    <Briefcase className="w-4 h-4 mr-2 text-brand-secondary" />
                    <span>Editing sponsor ID: {id}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

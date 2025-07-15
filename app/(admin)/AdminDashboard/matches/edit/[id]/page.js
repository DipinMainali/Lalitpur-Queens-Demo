"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import MatchForm from "@/components/AdminComponents/MatchForm";
import { motion } from "framer-motion";
import { Calendar, Edit, MapPin, Loader2 } from "lucide-react";

export default function EditMatch() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await fetch(`/api/matches/${id}`);
        const data = await res.json();

        if (data.success) {
          setMatch(data.data);
        } else {
          setError(data.message || "Failed to fetch match details");
        }
      } catch (err) {
        setError("An error occurred while fetching match details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMatch();
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
            <h1 className="text-3xl font-bold text-white">Edit Match</h1>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-brand-secondary animate-spin mb-4" />
            <p className="text-white text-lg">Loading match details...</p>
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
            <h1 className="text-3xl font-bold text-white">Edit Match</h1>
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
          <h1 className="text-3xl font-bold text-white">Edit Match</h1>
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
              <MatchForm initialData={match} />
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
                <Calendar className="w-5 h-5 mr-2 text-brand-secondary" />
                Editing Guidelines
              </h2>

              <div className="space-y-6 text-gray-300">
                <div>
                  <h3 className="font-semibold text-brand-secondary mb-2">
                    Match Information
                  </h3>
                  <p className="text-sm">
                    You can update all match details including tournament info,
                    date, time, and opponent team.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-brand-secondary mb-2">
                    Status Updates
                  </h3>
                  <p className="text-sm">
                    Change match status as needed. Remember to input scores for
                    matches marked "In Progress" or "Completed".
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-brand-secondary mb-2">
                    Score Modifications
                  </h3>
                  <p className="text-sm">
                    Scores can be adjusted for each set. The system will
                    automatically recalculate total sets won.
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-700 mt-6">
                  <div className="flex items-center text-sm text-white">
                    <MapPin className="w-4 h-4 mr-2 text-brand-secondary" />
                    <span>Editing match ID: {id}</span>
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

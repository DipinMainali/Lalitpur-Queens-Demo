"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import StandingForm from "@/components/AdminComponents/edit/StandingForm";
import { motion } from "framer-motion";
import { Trophy, Edit, ArrowLeft, FileText, Loader2, List } from "lucide-react";

export default function EditStandingPage({ params }) {
  const { id } = params;
  const [standing, setStanding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStanding = async () => {
      try {
        const res = await fetch(`/api/standings/${id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch standing");
        }

        const data = await res.json();

        if (data.success) {
          setStanding(data.data);
        } else {
          setError(data.message || "Failed to fetch standing");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
        console.error("Error fetching standing:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStanding();
  }, [id]);

  if (loading) {
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
            <h1 className="text-3xl font-bold text-white">Edit Standing</h1>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-brand-secondary animate-spin mb-4" />
            <p className="text-white text-lg">Loading standing details...</p>
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
            <Link
              href="/AdminDashboard/standings"
              className="flex items-center text-brand-secondary hover:text-brand-primary transition duration-200 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
            </Link>
            <div className="bg-brand-secondary p-2 rounded-lg mr-4">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Edit Standing</h1>
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
          <Link
            href="/AdminDashboard/standings"
            className="flex items-center text-brand-secondary hover:text-brand-primary transition duration-200 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
          </Link>
          <div className="bg-brand-secondary p-2 rounded-lg mr-4">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Edit Standing for {standing?.team?.name}
          </h1>
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
              {standing && <StandingForm standing={standing} />}
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
                <FileText className="w-5 h-5 mr-2 text-brand-secondary" />
                Editing Guidelines
              </h2>

              <div className="space-y-6 text-gray-300">
                <div>
                  <h3 className="font-semibold text-brand-secondary mb-2">
                    Team Stats
                  </h3>
                  <p className="text-sm">
                    Update team performance metrics including matches played,
                    won, drawn, and lost. The system will validate that these
                    numbers are consistent.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-brand-secondary mb-2">
                    Set Statistics
                  </h3>
                  <p className="text-sm">
                    Edit the total sets won and lost by the team. These stats
                    contribute to the team's position in case of equal points.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-brand-secondary mb-2">
                    Points Calculation
                  </h3>
                  <p className="text-sm">
                    Points are typically calculated as: 3 for a win, 1 for a
                    draw, and 0 for a loss. Ensure the total points reflect the
                    team's performance.
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-700 mt-6">
                  <div className="flex items-center text-sm text-white">
                    <List className="w-4 h-4 mr-2 text-brand-secondary" />
                    <span>Editing standing ID: {id}</span>
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

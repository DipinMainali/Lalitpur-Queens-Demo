"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StandingForm from "@/components/AdminComponents/edit/StandingForm";
import { motion } from "framer-motion";
import {
  Trophy,
  Edit,
  ArrowLeft,
  FileText,
  Loader2,
  List,
  Save,
} from "lucide-react";

export default function EditStandingPage({ params }) {
  const router = useRouter();
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
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-8">
            <div className="bg-queens-green p-2 rounded-lg mr-4">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Edit Standing</h1>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-queens-green animate-spin mb-4" />
            <p className="text-gray-700 text-lg">Loading standing details...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-8">
            <Link
              href="/AdminDashboard/standings"
              className="flex items-center text-queens-green hover:text-queens-green/80 transition duration-200 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
            </Link>
            <div className="bg-queens-green p-2 rounded-lg mr-4">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Edit Standing</h1>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-20 text-center">
            <p className="text-red-500 text-lg mb-2">Error</p>
            <p className="text-gray-700">{error}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-8">
          <Link
            href="/AdminDashboard/standings"
            className="flex items-center text-queens-green hover:text-queens-green/80 transition duration-200 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
          </Link>
          <div className="bg-queens-green p-2 rounded-lg mr-4">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
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
              className="bg-white rounded-xl shadow-xl overflow-hidden"
            >
              {standing && <StandingForm standing={standing} />}

              {/* Add visible action buttons inside the form container */}
              <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-4">
                <button
                  onClick={() => router.push("/AdminDashboard/standings")}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Cancel
                </button>

                <button
                  form="standing-form"
                  type="submit"
                  className="px-8 py-3 bg-queens-green text-black rounded-lg shadow-md 
    hover:bg-green-600 hover:shadow-lg hover:translate-y-[-1px]
    active:translate-y-[1px] active:shadow-md
    transition-all duration-200 font-medium flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>

          {/* Info Panel Column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white rounded-xl shadow-xl p-6 sticky top-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-queens-green" />
                Editing Guidelines
              </h2>

              <div className="space-y-6 text-gray-600">
                <div>
                  <h3 className="font-semibold text-queens-green mb-2">
                    Team Stats
                  </h3>
                  <p className="text-sm">
                    Update team performance metrics including matches played,
                    won, drawn, and lost. The system will validate that these
                    numbers are consistent.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-queens-green mb-2">
                    Set Statistics
                  </h3>
                  <p className="text-sm">
                    Edit the total sets won and lost by the team. These stats
                    contribute to the team&apos;s position in case of equal
                    points.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-queens-green mb-2">
                    Points Calculation
                  </h3>
                  <p className="text-sm">
                    Points are typically calculated as: 3 for a win, 1 for a
                    draw, and 0 for a loss. Ensure the total points reflect the
                    team&apos;s performance.
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-200 mt-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <List className="w-4 h-4 mr-2 text-queens-green" />
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

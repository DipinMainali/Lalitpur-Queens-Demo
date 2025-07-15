"use client";
import MatchForm from "@/components/AdminComponents/MatchForm";
import { motion } from "framer-motion";
import { Calendar, Trophy, MapPin } from "lucide-react";

export default function AddMatch() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-8">
          <div className="bg-brand-secondary p-2 rounded-lg mr-4">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Add New Match</h1>
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
              <MatchForm />
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
                Match Guidelines
              </h2>

              <div className="space-y-6 text-gray-300">
                <div>
                  <h3 className="font-semibold text-brand-secondary mb-2">
                    Tournament Details
                  </h3>
                  <p className="text-sm">
                    Ensure you select the correct tournament and stage. The game
                    day should represent the sequential match number in the
                    tournament.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-brand-secondary mb-2">
                    Match Scheduling
                  </h3>
                  <p className="text-sm">
                    All match dates and times should be set in local time. Make
                    sure to verify the venue availability before scheduling.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-brand-secondary mb-2">
                    Score Reporting
                  </h3>
                  <p className="text-sm">
                    For completed matches, add individual set scores. The system
                    will automatically calculate the total sets won.
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-700 mt-6">
                  <div className="flex items-center text-sm text-white">
                    <MapPin className="w-4 h-4 mr-2 text-brand-secondary" />
                    <span>Need help? Contact tournament administrator</span>
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

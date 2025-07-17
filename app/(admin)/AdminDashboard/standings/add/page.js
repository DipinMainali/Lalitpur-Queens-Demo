"use client";
import AddStandingForm from "@/components/AdminComponents/add/AddStandingForm";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, ArrowLeft, FileText, List, Info } from "lucide-react";

export default function AddStandingPage() {
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
          <h1 className="text-3xl font-bold text-white">Add New Standing</h1>
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
              <AddStandingForm />
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
                Standings Guidelines
              </h2>

              <div className="space-y-6 text-gray-300">
                <div>
                  <h3 className="font-semibold text-brand-secondary mb-2">
                    Team Selection
                  </h3>
                  <p className="text-sm">
                    Ensure you select the correct team from the dropdown. The
                    team must be registered in the system before adding
                    standings.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-brand-secondary mb-2">
                    Season Selection
                  </h3>
                  <p className="text-sm">
                    Select the appropriate season for which you`&apos;re adding
                    standings. Each team can have one standing entry per season.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-brand-secondary mb-2">
                    Statistical Accuracy
                  </h3>
                  <p className="text-sm">
                    Double-check all stats before submitting. The points should
                    correctly reflect the won, drawn, and lost matches according
                    to league rules.
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-700 mt-6">
                  <div className="flex items-center text-sm text-white">
                    <Info className="w-4 h-4 mr-2 text-brand-secondary" />
                    <span>
                      Standings are automatically sorted by points, then by set
                      difference
                    </span>
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

"use client";
import AddStandingForm from "@/components/AdminComponents/add/AddStandingForm";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy,
  ArrowLeft,
  FileText,
  List,
  Info,
  ChevronRight,
} from "lucide-react";

export default function AddStandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link
            href="/AdminDashboard"
            className="hover:text-brand-primary transition-colors duration-200"
          >
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link
            href="/AdminDashboard/standings"
            className="hover:text-brand-primary transition-colors duration-200"
          >
            Standings
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-brand-primary font-medium">Add New</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center">
            <Link
              href="/AdminDashboard/standings"
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 text-brand-secondary hover:text-brand-primary transition-all duration-200 mr-4"
              aria-label="Back to standings"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-2.5 rounded-lg mr-4 shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Add New Standing
            </h1>
          </div>

          <Link
            href="/AdminDashboard/standings"
            className="flex items-center text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors duration-200"
          >
            <List className="w-4 h-4 mr-2" />
            View All Standings
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Column */}
          <div className="lg:col-span-2 ">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="bg-gray-50 dark:bg-gray-750 px-8 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Standing Information
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Enter team statistics for the selected season
                </p>
              </div>

              <AddStandingForm />
            </motion.div>
          </div>

          {/* Info Panel Column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-6 border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-brand-primary" />
                Standings Guidelines
              </h2>

              <div className="space-y-6 text-gray-600 dark:text-gray-300">
                <div>
                  <h3 className="font-semibold text-brand-primary mb-2">
                    Team Selection
                  </h3>
                  <p className="text-sm">
                    Ensure you select the correct team from the dropdown. The
                    team must be registered in the system before adding
                    standings.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-brand-primary mb-2">
                    Season Selection
                  </h3>
                  <p className="text-sm">
                    Select the appropriate season for which you&apos;re adding
                    standings. Each team can have one standing entry per season.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-brand-primary mb-2">
                    Statistical Accuracy
                  </h3>
                  <p className="text-sm">
                    Double-check all stats before submitting. The points should
                    correctly reflect the won, drawn, and lost matches according
                    to league rules.
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                  <div className="flex items-center px-4 py-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-l-4 border-blue-500 text-sm text-blue-700 dark:text-blue-300">
                    <Info className="w-5 h-5 mr-3 text-blue-500" />
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

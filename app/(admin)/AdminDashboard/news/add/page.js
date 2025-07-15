"use client";
import NewsForm from "@/components/AdminComponents/NewsForm";
import { motion } from "framer-motion";
import { FileText, Newspaper, Link2 } from "lucide-react";

export default function AddNews() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-8">
          <div className="bg-brand-secondary p-2 rounded-lg mr-4">
            <Newspaper className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Add New Article</h1>
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
              <NewsForm />
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
                Article Guidelines
              </h2>

              <div className="space-y-6 text-gray-300">
                <div>
                  <h3 className="font-semibold text-brand-secondary mb-2">
                    Content Quality
                  </h3>
                  <p className="text-sm">
                    Write clear, concise and engaging content. Aim for
                    approximately 300-800 words for standard news articles. Use
                    proper formatting for better readability.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-brand-secondary mb-2">
                    Featured Image
                  </h3>
                  <p className="text-sm">
                    Upload high-resolution images (1200×630px recommended)
                    related to the article content. Images should be in JPG or
                    PNG format.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-brand-secondary mb-2">
                    SEO Tips
                  </h3>
                  <p className="text-sm">
                    Use descriptive titles with relevant keywords. Add tags that
                    accurately represent your content to improve
                    discoverability.
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-700 mt-6">
                  <div className="flex items-center text-sm text-white">
                    <Link2 className="w-4 h-4 mr-2 text-brand-secondary" />
                    <span>
                      News articles appear on the official team website
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

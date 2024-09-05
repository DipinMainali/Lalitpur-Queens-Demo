import mongoose from "mongoose";
import generateUniqueSlug from "@/utils/slug.js";

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Pre-save and pre-update middleware to generate and validate unique slug
newsSchema.pre("save", async function (next) {
  const news = this;
  await generateUniqueSlug(news, next);
});

// Pre-remove hook to delete the image file before the news document is deleted

const News = mongoose.models.News || mongoose.model("News", newsSchema);

export default News;

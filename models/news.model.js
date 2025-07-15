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
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["published", "draft", "archived"],
      default: "published",
    },
    author: {
      type: String,
      default: "Admin",
    },
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Pre-save and pre-update middleware to generate and validate unique slug
newsSchema.pre("save", async function (next) {
  const news = this;
  await generateUniqueSlug(news, next);
});

// Process tags from comma-separated string
newsSchema.pre("save", function (next) {
  // If tags are provided as a comma-separated string, split and trim them
  if (this.isModified("tags") && typeof this.tags === "string") {
    this.tags = this.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }
  next();
});

// Pre-remove hook to delete the image file before the news document is deleted
newsSchema.pre("remove", async function (next) {
  // Implementation for image deletion would go here
  // This requires file system operations to delete the actual image file
  next();
});

const News = mongoose.models.News || mongoose.model("News", newsSchema);

export default News;

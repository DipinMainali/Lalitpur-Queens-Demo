export default async function generateUniqueSlug(news, next) {
  let slug = news.slug || news.title.toLowerCase().replace(/\s+/g, "-");

  try {
    // Check for existing slugs and append a number if necessary
    let existingNews = await mongoose.models.News.findOne({ slug });
    let count = 1;
    while (existingNews) {
      slug = `${news.title.toLowerCase().replace(/\s+/g, "-")}-${count++}`;
      existingNews = await mongoose.models.News.findOne({ slug });
    }
    news.slug = slug;
    next();
  } catch (err) {
    return next(err);
  }
}

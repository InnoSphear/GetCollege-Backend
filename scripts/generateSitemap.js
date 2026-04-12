import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

async function generateSitemap() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database");

    const College = mongoose.model("College", new mongoose.Schema({}, { strict: false }), "colleges");
    const Blog = mongoose.model("Blog", new mongoose.Schema({}, { strict: false }), "blogs");

    const [colleges, blogs] = await Promise.all([
      College.find({}, "name slug _id").lean(),
      Blog.find({ isPublished: true }, "title slug _id").lean(),
    ]);

    console.log(`Found ${colleges.length} colleges and ${blogs.length} blogs`);

    const baseUrl = "https://getcollegeadmission.com";

    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/colleges", priority: "0.9", changefreq: "daily" },
      { url: "/blogs", priority: "0.9", changefreq: "weekly" },
      { url: "/engineering", priority: "0.8", changefreq: "weekly" },
      { url: "/medical", priority: "0.8", changefreq: "weekly" },
      { url: "/managment", priority: "0.8", changefreq: "weekly" },
      { url: "/contact", priority: "0.7", changefreq: "monthly" },
    ];

    const collegeUrls = colleges.map((college) => {
      const slug = college.slug || generateSlug(college.name);
      return {
        url: `/college/${slug}-${college._id}`,
        priority: "0.8",
        changefreq: "weekly",
      };
    });

    const blogUrls = blogs.map((blog) => {
      const slug = blog.slug || generateSlug(blog.title);
      return {
        url: `/blogs/${slug}-${blog._id}`,
        priority: "0.7",
        changefreq: "monthly",
      };
    });

    const allUrls = [...staticPages, ...collegeUrls, ...blogUrls];
    const today = new Date().toISOString().split("T")[0];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allUrls
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${today}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

    const sitemapPath = path.join(__dirname, "..", "frontend", "public", "sitemap.xml");
    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`Sitemap generated at: ${sitemapPath}`);
    console.log(`Total URLs: ${allUrls.length}`);

    await mongoose.disconnect();
    console.log("Disconnected from database");
  } catch (error) {
    console.error("Error generating sitemap:", error);
    process.exit(1);
  }
}

generateSitemap();

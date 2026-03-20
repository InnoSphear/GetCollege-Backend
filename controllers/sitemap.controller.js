import College from "../models/college.model.js";
import Blog from "../models/blog.model.js";

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

export const generateSitemap = async (req, res) => {
  try {
    const baseUrl = "https://getcollegeadmission.com";

    const [colleges, blogs] = await Promise.all([
      College.find({}, "name slug").lean(),
      Blog.find({ isPublished: true }, "title slug").lean(),
    ]);

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
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(sitemap);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Error generating sitemap");
  }
};

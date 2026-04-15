import College from "../models/college.model.js";
import Blog from "../models/blog.model.js";

const BASE_URL = "https://getcollegeadmission.com";

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

export const generateLegacySitemap = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const [colleges, blogs] = await Promise.all([
      College.find({}, "name slug updatedAt").lean(),
      Blog.find({ isPublished: true }, "title slug category tags updatedAt coverImage")
        .lean(),
    ]);

    const seenBlogSlugs = new Set();
    const uniqueBlogs = blogs.filter((blog) => {
      if (seenBlogSlugs.has(blog.slug)) return false;
      seenBlogSlugs.add(blog.slug);
      return true;
    });

    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "daily", lastmod: today },
      { url: "/colleges", priority: "0.9", changefreq: "daily", lastmod: today },
      { url: "/blogs", priority: "0.9", changefreq: "daily", lastmod: today },
      { url: "/engineering", priority: "0.85", changefreq: "weekly", lastmod: today },
      { url: "/medical", priority: "0.85", changefreq: "weekly", lastmod: today },
      { url: "/management", priority: "0.85", changefreq: "weekly", lastmod: today },
      { url: "/about", priority: "0.7", changefreq: "monthly", lastmod: today },
      { url: "/contact", priority: "0.8", changefreq: "monthly", lastmod: today },
      { url: "/privacy-policy", priority: "0.5", changefreq: "yearly", lastmod: today },
      { url: "/terms-of-service", priority: "0.5", changefreq: "yearly", lastmod: today },
    ];

    const categoryPages = [...new Set(uniqueBlogs.map((b) => b.category.toLowerCase()))];
    const categoryUrls = categoryPages.map((cat) => ({
      url: `/blogs?category=${encodeURIComponent(cat)}`,
      priority: "0.85",
      changefreq: "daily",
      lastmod: today,
    }));

    const collegeUrls = colleges.map((college) => ({
      url: `/college/${college.slug || generateSlug(college.name)}-${college._id}`,
      priority: "0.75",
      changefreq: "weekly",
      lastmod: college.updatedAt
        ? new Date(college.updatedAt).toISOString().split("T")[0]
        : today,
    }));

    const blogUrls = uniqueBlogs.map((blog) => ({
      url: `/blogs/${blog.slug || generateSlug(blog.title)}-${blog._id}`,
      priority: "0.8",
      changefreq: "monthly",
      lastmod: blog.updatedAt
        ? new Date(blog.updatedAt).toISOString().split("T")[0]
        : today,
      coverImage: blog.coverImage,
      title: blog.title,
    }));

    const allUrls = [
      ...staticPages,
      ...categoryUrls,
      ...collegeUrls,
      ...blogUrls,
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allUrls
  .map((page) => {
    let entry = `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${page.url}"/>`;

    if (page.coverImage) {
      entry += `
    <image:image>
      <image:loc>${page.coverImage}</image:loc>
      <image:title>${escapeXml(page.title || "")}</image:title>
    </image:image>`;
    }

    entry += `
  </url>`;
    return entry;
  })
  .join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400");
    res.send(sitemap);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Error generating sitemap");
  }
};

function escapeXml(unsafe) {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

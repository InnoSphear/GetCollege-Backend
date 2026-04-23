import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.FRONTEND_URL || "https://getcollegeadmission.com";
const publicDir = path.join(__dirname, "..", "frontend", "public");

const today = new Date().toISOString().split("T")[0];

const COLLEGES_SAMPLE = [
  { _id: "507f1f77bcf86cd799439011", name: "Indian Institute of Technology Delhi", slug: "iit-delhi" },
  { _id: "507f1f77bcf86cd799439012", name: "Indian Institute of Technology Bombay", slug: "iit-bombay" },
  { _id: "507f1f77bcf86cd799439013", name: "All India Institute of Medical Sciences", slug: "aiims-delhi" },
];

const BLOGS_SAMPLE = [
  { _id: "607f1f77bcf86cd799439011", title: "Top Engineering Colleges in India 2026", slug: "top-engineering-colleges-india-2026", category: "Engineering", tags: ["engineering", "iit", "colleges"], coverImage: "https://example.com/image1.jpg" },
  { _id: "607f1f77bcf86cd799439012", title: "NEET 2026: Complete Preparation Guide", slug: "neet-2026-preparation-guide", category: "Medical", tags: ["neet", "medical", "preparation"], coverImage: "https://example.com/image2.jpg" },
  { _id: "607f1f77bcf86cd799439013", title: "MBA Admissions 2026: What You Need to Know", slug: "mba-admissions-2026-guide", category: "Management", tags: ["mba", "management", "admissions"], coverImage: "https://example.com/image3.jpg" },
];

function escapeXml(unsafe) {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateSitemapIndex() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>/sitemap-static.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>/sitemap-colleges.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>/sitemap-blogs.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
}

function generateStaticSitemap(staticPages) {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  sitemap += staticPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join("\n");

  sitemap += "\n</urlset>";
  return sitemap;
}

function generateCollegeSitemap(colleges) {
  const indexPages = [
    { url: "/colleges", priority: "0.9", changefreq: "daily" },
    { url: "/engineering", priority: "0.85", changefreq: "weekly" },
    { url: "/medical", priority: "0.85", changefreq: "weekly" },
    { url: "/management", priority: "0.85", changefreq: "weekly" },
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  sitemap += indexPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join("\n");

  sitemap += "\n\n  <!-- Individual College Pages -->\n";

  sitemap += colleges.map(college => `  <url>
    <loc>/college/${college.slug}-${college._id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("\n");

  sitemap += "\n</urlset>";
  return sitemap;
}

function generateBlogSitemap(blogs) {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  sitemap += `  <url>
    <loc>/blogs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Individual Blog Posts -->
`;

  sitemap += blogs.map(blog => `  <url>
    <loc>/blogs/${blog.slug}-${blog._id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${blog.coverImage || ""}</image:loc>
      <image:title>${escapeXml(blog.title)}</image:title>
    </image:image>
  </url>`).join("\n");

  sitemap += "\n</urlset>";
  return sitemap;
}

async function generateSitemaps() {
  try {
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    let colleges = COLLEGES_SAMPLE;
    let blogs = BLOGS_SAMPLE;

    try {
      const mongoose = await import("mongoose");
      await mongoose.default.connect(process.env.MONGO_URI);
      
      const College = mongoose.default.model("College", new mongoose.default.Schema({}, { strict: false }), "colleges");
      const Blog = mongoose.default.model("Blog", new mongoose.default.Schema({}, { strict: false }), "blogs");

      const [dbColleges, dbBlogs] = await Promise.all([
        College.find({}, "_id name slug").lean(),
        Blog.find({ isPublished: true }, "_id title slug category tags coverImage").lean()
      ]);

      if (dbColleges.length > 0) colleges = dbColleges;
      if (dbBlogs.length > 0) blogs = dbBlogs;

      await mongoose.default.disconnect();
      console.log("Database connected and fetched data");
    } catch (dbError) {
      console.log("Database unavailable, using sample data");
    }

    console.log(`Generating sitemaps with ${colleges.length} colleges and ${blogs.length} blogs...`);

    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "daily", lastmod: today },
      { url: "/colleges", priority: "0.9", changefreq: "daily", lastmod: today },
      { url: "/engineering", priority: "0.85", changefreq: "weekly", lastmod: today },
      { url: "/medical", priority: "0.85", changefreq: "weekly", lastmod: today },
      { url: "/management", priority: "0.85", changefreq: "weekly", lastmod: today },
      { url: "/blogs", priority: "0.9", changefreq: "daily", lastmod: today },
      { url: "/contact", priority: "0.8", changefreq: "monthly", lastmod: today },
      { url: "/compare", priority: "0.6", changefreq: "weekly", lastmod: today },
    ];

    fs.writeFileSync(path.join(publicDir, "sitemap.xml"), generateSitemapIndex());
    fs.writeFileSync(path.join(publicDir, "sitemap-static.xml"), generateStaticSitemap(staticPages));
    fs.writeFileSync(path.join(publicDir, "sitemap-colleges.xml"), generateCollegeSitemap(colleges));
    fs.writeFileSync(path.join(publicDir, "sitemap-blogs.xml"), generateBlogSitemap(blogs));

    const robotsTxt = `# Robots.txt for GetCollegeAdmission.com
# Generated: ${today}

User-agent: *
Allow: /

Sitemap: /sitemap.xml

Disallow: /api/
Disallow: /admin/
`;
    fs.writeFileSync(path.join(publicDir, "robots.txt"), robotsTxt);

    console.log(`\nGenerated sitemap files in frontend/public/`);
    console.log("Done!");

  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

generateSitemaps();

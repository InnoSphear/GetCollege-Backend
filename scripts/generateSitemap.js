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
<?xml-stylesheet type="text/xsl" href="${BASE_URL}/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
              http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd">
  <sitemap>
    <loc>${BASE_URL}/sitemap-static.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-colleges.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-blogs.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
}

function generateStaticSitemap() {
  const staticPages = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/colleges", priority: "0.9", changefreq: "daily" },
    { url: "/blogs", priority: "0.9", changefreq: "daily" },
    { url: "/engineering", priority: "0.85", changefreq: "weekly" },
    { url: "/medical", priority: "0.85", changefreq: "weekly" },
    { url: "/management", priority: "0.85", changefreq: "weekly" },
    { url: "/about", priority: "0.7", changefreq: "monthly" },
    { url: "/contact", priority: "0.8", changefreq: "monthly" },
    { url: "/privacy-policy", priority: "0.5", changefreq: "yearly" },
    { url: "/terms-of-service", priority: "0.5", changefreq: "yearly" },
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  sitemap += staticPages.map(page => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${page.url}"/>
  </url>`).join("\n");

  sitemap += "\n</urlset>";
  return sitemap;
}

function generateCollegeSitemap(colleges) {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  const indexPages = [
    { url: "/colleges", priority: "0.9", changefreq: "daily" },
    { url: "/engineering", priority: "0.85", changefreq: "weekly" },
    { url: "/medical", priority: "0.85", changefreq: "weekly" },
    { url: "/management", priority: "0.85", changefreq: "weekly" },
  ];

  sitemap += indexPages.map(page => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${page.url}"/>
  </url>`).join("\n");

  sitemap += "\n\n  <!-- Individual College Pages -->\n";

  sitemap += colleges.map(college => `  <url>
    <loc>${BASE_URL}/college/${college.slug}-${college._id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/college/${college.slug}-${college._id}"/>
  </url>`).join("\n");

  sitemap += "\n</urlset>";
  return sitemap;
}

function generateBlogSitemap(blogs) {
  const categories = [...new Set(blogs.map(b => b.category?.toLowerCase()).filter(Boolean))];
  const allTags = [...new Set(blogs.flatMap(b => b.tags || []).filter(Boolean))];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  sitemap += `  <!-- Blog Category Pages -->\n`;
  sitemap += categories.map(cat => `  <url>
    <loc>${BASE_URL}/blogs?category=${encodeURIComponent(cat)}</loc>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
    <lastmod>${today}</lastmod>
  </url>`).join("\n");

  sitemap += `\n\n  <!-- Blog Tag Pages -->\n`;
  sitemap += allTags.slice(0, 100).map(tag => `  <url>
    <loc>${BASE_URL}/blogs?tag=${encodeURIComponent(tag)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
    <lastmod>${today}</lastmod>
  </url>`).join("\n");

  sitemap += `\n\n  <!-- Individual Blog Posts -->\n`;
  sitemap += blogs.map(blog => `  <url>
    <loc>${BASE_URL}/blogs/${blog.slug}-${blog._id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/blogs/${blog.slug}-${blog._id}"/>
    <image:image>
      <image:loc>${blog.coverImage || ""}</image:loc>
      <image:title>${escapeXml(blog.title)}</image:title>
    </image:image>
  </url>`).join("\n");

  sitemap += "\n</urlset>";
  return sitemap;
}

function generateSitemapXsl() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap - GetCollegeAdmission</title>
        <meta charset="UTF-8"/>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; padding: 2rem; }
          .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          h1 { color: #333; margin-bottom: 1rem; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
          th { background: #f8f9fa; font-weight: 600; color: #555; }
          a { color: #667eea; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
          .high { background: #d4edda; color: #155724; }
          .medium { background: #fff3cd; color: #856404; }
          .low { background: #f8d7da; color: #721c24; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Sitemap - GetCollegeAdmission.com</h1>
          <p>Generated: ${today}</p>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Priority</th>
                <th>Change Frequency</th>
                <th>Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                  <td><span class="badge"><xsl:value-of select="sitemap:priority"/></span></td>
                  <td><xsl:value-of select="sitemap:changefreq"/></td>
                  <td><xsl:value-of select="sitemap:lastmod"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;
}

function generateRobotsTxt() {
  return `# Robots.txt for GetCollegeAdmission.com
# Generated: ${today}

User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml

Disallow: /api/
Disallow: /admin/
`;
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
      console.log("Note: Run with database connected for real data");
    }

    console.log(`Generating sitemaps with ${colleges.length} colleges and ${blogs.length} blogs...`);

    fs.writeFileSync(path.join(publicDir, "sitemap.xml"), generateSitemapIndex());
    fs.writeFileSync(path.join(publicDir, "sitemap-static.xml"), generateStaticSitemap());
    fs.writeFileSync(path.join(publicDir, "sitemap-colleges.xml"), generateCollegeSitemap(colleges));
    fs.writeFileSync(path.join(publicDir, "sitemap-blogs.xml"), generateBlogSitemap(blogs));
    fs.writeFileSync(path.join(publicDir, "sitemap.xsl"), generateSitemapXsl());
    fs.writeFileSync(path.join(publicDir, "robots.txt"), generateRobotsTxt());

    const totalUrls = 10 + colleges.length + blogs.length + 2 + Math.min(blogs.flatMap(b => b.tags || []).length, 100);
    console.log(`\nGenerated ${totalUrls} URLs`);
    console.log("Files created in frontend/public/:");
    console.log("  - sitemap.xml");
    console.log("  - sitemap-static.xml");
    console.log("  - sitemap-colleges.xml");
    console.log("  - sitemap-blogs.xml");
    console.log("  - sitemap.xsl");
    console.log("  - robots.txt");
    console.log("\nDone!");

  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

generateSitemaps();

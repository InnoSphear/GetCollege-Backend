import Blog from "../models/blog.model.js";

const BASE_URL = process.env.BASE_URL || "https://getcollegeadmission.in";

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

export const generateBlogSitemap = async (req, res) => {
  try {
    const baseUrl = BASE_URL;
    const today = new Date().toISOString().split("T")[0];

    const blogs = await Blog.find(
      { isPublished: true },
      "title slug category author tags updatedAt coverImage"
    )
      .sort({ updatedAt: -1 })
      .lean();

    const seenSlugs = new Set();
    const uniqueBlogs = blogs.filter((blog) => {
      if (seenSlugs.has(blog.slug)) return false;
      seenSlugs.add(blog.slug);
      return true;
    });

    const categoryPages = [...new Set(uniqueBlogs.map((b) => b.category.toLowerCase()))];
    const allTags = [...new Set(uniqueBlogs.flatMap((b) => b.tags || []))];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    sitemap += `  <!-- Blog Index Pages -->
`;
    sitemap += categoryPages
      .map(
        (cat) => `  <url>
    <loc>${baseUrl}/blogs?category=${encodeURIComponent(cat)}</loc>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
    <lastmod>${today}</lastmod>
  </url>`
      )
      .join("\n");

    sitemap += `\n\n  <!-- Blog Tag Pages -->
`;
    sitemap += allTags
      .slice(0, 100)
      .map(
        (tag) => `  <url>
    <loc>${baseUrl}/blogs?tag=${encodeURIComponent(tag)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
    <lastmod>${today}</lastmod>
  </url>`
      )
      .join("\n");

    sitemap += `\n\n  <!-- Individual Blog Posts -->
`;
    sitemap += uniqueBlogs
      .map((blog) => {
        const slug = blog.slug || generateSlug(blog.title);
        const blogUrl = `${baseUrl}/blogs/${slug}-${blog._id}`;
        const lastmod = blog.updatedAt
          ? new Date(blog.updatedAt).toISOString().split("T")[0]
          : today;

        let urlEntry = `  <url>
    <loc>${blogUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
`;

        if (blog.coverImage) {
          urlEntry += `    <image:image>
      <image:loc>${blog.coverImage}</image:loc>
      <image:title>${escapeXml(blog.title)}</image:title>
    </image:image>
`;
        }

        urlEntry += `    <xhtml:link rel="alternate" hreflang="en" href="${blogUrl}"/>
  </url>`;

        return urlEntry;
      })
      .join("\n");

    sitemap += "\n</urlset>";

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400");
    res.setHeader("X-Robots-Tag", "noindex");
    res.send(sitemap);
  } catch (error) {
    console.error("Blog sitemap generation error:", error);
    res.status(500).send("Error generating blog sitemap");
  }
};

export const generateBlogSitemapStatic = async () => {
  const baseUrl = BASE_URL;
  const today = new Date().toISOString().split("T")[0];

  const blogs = await Blog.find(
    { isPublished: true },
    "title slug category author tags updatedAt coverImage"
  )
    .sort({ updatedAt: -1 })
    .lean();

  const seenSlugs = new Set();
  const uniqueBlogs = blogs.filter((blog) => {
    if (seenSlugs.has(blog.slug)) return false;
    seenSlugs.add(blog.slug);
    return true;
  });

  const categoryPages = [...new Set(uniqueBlogs.map((b) => b.category.toLowerCase()))];
  const allTags = [...new Set(uniqueBlogs.flatMap((b) => b.tags || []))];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  sitemap += `  <!-- Blog Index Pages -->
`;
  sitemap += categoryPages
    .map(
      (cat) => `  <url>
    <loc>${baseUrl}/blogs?category=${encodeURIComponent(cat)}</loc>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
    <lastmod>${today}</lastmod>
  </url>`
    )
    .join("\n");

  sitemap += `\n\n  <!-- Blog Tag Pages -->
`;
  sitemap += allTags
    .slice(0, 100)
    .map(
      (tag) => `  <url>
    <loc>${baseUrl}/blogs?tag=${encodeURIComponent(tag)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
    <lastmod>${today}</lastmod>
  </url>`
    )
    .join("\n");

  sitemap += `\n\n  <!-- Individual Blog Posts -->
`;
  sitemap += uniqueBlogs
    .map((blog) => {
      const slug = blog.slug || generateSlug(blog.title);
      const blogUrl = `${baseUrl}/blogs/${slug}-${blog._id}`;
      const lastmod = blog.updatedAt
        ? new Date(blog.updatedAt).toISOString().split("T")[0]
        : today;

      let urlEntry = `  <url>
    <loc>${blogUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
`;

      if (blog.coverImage) {
        urlEntry += `    <image:image>
      <image:loc>${blog.coverImage}</image:loc>
      <image:title>${escapeXml(blog.title)}</image:title>
    </image:image>
`;
      }

      urlEntry += `    <xhtml:link rel="alternate" hreflang="en" href="${blogUrl}"/>
  </url>`;

      return urlEntry;
    })
    .join("\n");

  sitemap += "\n</urlset>";

  return sitemap;
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

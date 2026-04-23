import College from "../models/college.model.js";

const BASE_URL = process.env.BASE_URL || "https://getcollegeadmission.in";

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

export const generateCollegeSitemap = async (req, res) => {
  try {
    const baseUrl = BASE_URL;
    const today = new Date().toISOString().split("T")[0];

    const colleges = await College.find({}, "name slug city state type updatedAt")
      .lean();

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    sitemap += `  <!-- College Index/Listing Pages -->
  <url>
    <loc>${baseUrl}/colleges</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <lastmod>${today}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/engineering</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${today}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/medical</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${today}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/management</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${today}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/colleges?type=government</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${today}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/colleges?type=private</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${today}</lastmod>
  </url>

  <!-- Individual College Pages -->
`;

    sitemap += colleges
      .map((college) => {
        const slug = college.slug || generateSlug(college.name);
        const collegeUrl = `${baseUrl}/college/${slug}-${college._id}`;
        const lastmod = college.updatedAt
          ? new Date(college.updatedAt).toISOString().split("T")[0]
          : today;

        return `  <url>
    <loc>${collegeUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${collegeUrl}"/>
  </url>`;
      })
      .join("\n");

    sitemap += "\n</urlset>";

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400");
    res.setHeader("X-Robots-Tag", "noindex");
    res.send(sitemap);
  } catch (error) {
    console.error("College sitemap generation error:", error);
    res.status(500).send("Error generating college sitemap");
  }
};

export const generateCollegeSitemapStatic = async () => {
  const baseUrl = BASE_URL;
  const today = new Date().toISOString().split("T")[0];

  const colleges = await College.find({}, "name slug city state type updatedAt")
    .lean();

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  sitemap += `  <!-- College Index/Listing Pages -->
  <url>
    <loc>${baseUrl}/colleges</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <lastmod>${today}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/engineering</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${today}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/medical</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${today}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/management</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${today}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/colleges?type=government</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${today}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/colleges?type=private</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${today}</lastmod>
  </url>

  <!-- Individual College Pages -->
`;

  sitemap += colleges
    .map((college) => {
      const slug = college.slug || generateSlug(college.name);
      const collegeUrl = `${baseUrl}/college/${slug}-${college._id}`;
      const lastmod = college.updatedAt
        ? new Date(college.updatedAt).toISOString().split("T")[0]
        : today;

      return `  <url>
    <loc>${collegeUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${collegeUrl}"/>
  </url>`;
    })
    .join("\n");

  sitemap += "\n</urlset>";

  return sitemap;
};
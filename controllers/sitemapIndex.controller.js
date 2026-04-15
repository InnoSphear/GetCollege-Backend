const BASE_URL = "https://getcollegeadmission.com";
const today = new Date().toISOString().split("T")[0];

export const generateSitemapIndex = async (req, res) => {
  try {
    const sitemaps = [
      {
        loc: `${BASE_URL}/sitemap-static.xml`,
        lastmod: today,
        priority: "1.0",
      },
      {
        loc: `${BASE_URL}/sitemap-colleges.xml`,
        lastmod: today,
        priority: "0.9",
      },
      {
        loc: `${BASE_URL}/sitemap-blogs.xml`,
        lastmod: today,
        priority: "0.9",
      },
    ];

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${BASE_URL}/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
              http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd">
${sitemaps
  .map(
    (sitemap) => `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`
  )
  .join("\n")}
</sitemapindex>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400");
    res.send(sitemapIndex);
  } catch (error) {
    console.error("Sitemap index generation error:", error);
    res.status(500).send("Error generating sitemap index");
  }
};

export const generateStaticSitemap = async (req, res) => {
  try {
    const staticPages = [
      {
        url: "/",
        priority: "1.0",
        changefreq: "daily",
        lastmod: today,
      },
      {
        url: "/colleges",
        priority: "0.9",
        changefreq: "daily",
        lastmod: today,
      },
      {
        url: "/blogs",
        priority: "0.9",
        changefreq: "daily",
        lastmod: today,
      },
      {
        url: "/engineering",
        priority: "0.85",
        changefreq: "weekly",
        lastmod: today,
      },
      {
        url: "/medical",
        priority: "0.85",
        changefreq: "weekly",
        lastmod: today,
      },
      {
        url: "/management",
        priority: "0.85",
        changefreq: "weekly",
        lastmod: today,
      },
      {
        url: "/about",
        priority: "0.7",
        changefreq: "monthly",
        lastmod: today,
      },
      {
        url: "/contact",
        priority: "0.8",
        changefreq: "monthly",
        lastmod: today,
      },
      {
        url: "/privacy-policy",
        priority: "0.5",
        changefreq: "yearly",
        lastmod: today,
      },
      {
        url: "/terms-of-service",
        priority: "0.5",
        changefreq: "yearly",
        lastmod: today,
      },
      {
        url: "/disclaimer",
        priority: "0.4",
        changefreq: "yearly",
        lastmod: today,
      },
      {
        url: "/sitemap",
        priority: "0.3",
        changefreq: "weekly",
        lastmod: today,
      },
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

    sitemap += staticPages
      .map(
        (page) => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${page.url}"/>
  </url>`
      )
      .join("\n");

    sitemap += "\n</urlset>";

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400");
    res.setHeader("X-Robots-Tag", "noindex");
    res.send(sitemap);
  } catch (error) {
    console.error("Static sitemap generation error:", error);
    res.status(500).send("Error generating static sitemap");
  }
};

export const generateStaticSitemapStatic = async () => {
  const today = new Date().toISOString().split("T")[0];

  const staticPages = [
    {
      url: "/",
      priority: "1.0",
      changefreq: "daily",
      lastmod: today,
    },
    {
      url: "/colleges",
      priority: "0.9",
      changefreq: "daily",
      lastmod: today,
    },
    {
      url: "/blogs",
      priority: "0.9",
      changefreq: "daily",
      lastmod: today,
    },
    {
      url: "/engineering",
      priority: "0.85",
      changefreq: "weekly",
      lastmod: today,
    },
    {
      url: "/medical",
      priority: "0.85",
      changefreq: "weekly",
      lastmod: today,
    },
    {
      url: "/management",
      priority: "0.85",
      changefreq: "weekly",
      lastmod: today,
    },
    {
      url: "/about",
      priority: "0.7",
      changefreq: "monthly",
      lastmod: today,
    },
    {
      url: "/contact",
      priority: "0.8",
      changefreq: "monthly",
      lastmod: today,
    },
    {
      url: "/privacy-policy",
      priority: "0.5",
      changefreq: "yearly",
      lastmod: today,
    },
    {
      url: "/terms-of-service",
      priority: "0.5",
      changefreq: "yearly",
      lastmod: today,
    },
    {
      url: "/disclaimer",
      priority: "0.4",
      changefreq: "yearly",
      lastmod: today,
    },
    {
      url: "/sitemap",
      priority: "0.3",
      changefreq: "weekly",
      lastmod: today,
    },
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  sitemap += staticPages
    .map(
      (page) => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${page.url}"/>
  </url>`
    )
    .join("\n");

  sitemap += "\n</urlset>";

  return sitemap;
};

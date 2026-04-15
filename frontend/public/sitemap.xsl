<?xml version="1.0" encoding="UTF-8"?>
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
          <p>Generated: 2026-04-15</p>
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
</xsl:stylesheet>
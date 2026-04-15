import express from "express";
import { generateSitemapIndex, generateStaticSitemap } from "../controllers/sitemapIndex.controller.js";
import { generateCollegeSitemap } from "../controllers/collegeSitemap.controller.js";
import { generateBlogSitemap } from "../controllers/blogSitemap.controller.js";
import { generateLegacySitemap } from "../controllers/sitemap.controller.js";

const router = express.Router();

router.get("/sitemap.xml", generateSitemapIndex);
router.get("/api/sitemap/static", generateStaticSitemap);
router.get("/api/sitemap/colleges", generateCollegeSitemap);
router.get("/api/sitemap/blogs", generateBlogSitemap);
router.get("/api/sitemap", generateLegacySitemap);

export default router;

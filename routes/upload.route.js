import express from "express";
import multer from "multer";
import ImageKit, { toFile } from "@imagekit/nodejs";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const client = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    });

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    const fileInstance = await toFile(req.file.buffer, req.file.originalname);

    const result = await client.files.upload({
      file: fileInstance,
      fileName: req.file.originalname,
      folder: "/landing-pages",
    });

    return res.status(200).json({
      success: true,
      url: result.url,
      fileId: result.fileId,
      name: result.name,
    });
  } catch (error) {
    console.error("ImageKit upload error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
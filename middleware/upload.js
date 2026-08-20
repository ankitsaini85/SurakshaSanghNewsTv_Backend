const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "")
      .slice(0, 40);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${base}${ext}`);
  },
});

const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|webm|avi|mkv/;

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
  const isImage = file.mimetype.startsWith("image/");
  const isVideo = file.mimetype.startsWith("video/");
  if ((isImage || isVideo) && allowedTypes.test(ext)) {
    return cb(null, true);
  }
  cb(new Error("Only image or video files are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

module.exports = upload;

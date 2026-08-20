exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const url = `/uploads/${req.file.filename}`;
    const mediaType = req.file.mimetype.startsWith("video/") ? "video" : "image";
    res.status(201).json({ url, mediaType, filename: req.file.filename });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

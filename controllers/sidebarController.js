const SidebarItem = require("../models/SidebarItem");

const normalizeYouTubeUrl = (value) => {
  if (!value) return value;
  const trimmed = value.trim();
  if (trimmed.includes("youtube.com/embed/")) return trimmed;
  if (trimmed.includes("youtu.be/")) {
    const id = trimmed.split("youtu.be/")[1].split(/[?&]/)[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (trimmed.includes("youtube.com/watch")) {
    const match = trimmed.match(/[?&]v=([^&]+)/);
    if (match?.[1]) return `https://www.youtube.com/embed/${match[1]}`;
  }
  return trimmed;
};

exports.getSidebarItems = async (req, res) => {
  try {
    const { type, limit = 5 } = req.query;
    const fetchAll = limit === "all";
    const filter = { active: true };
    if (type) filter.type = type;
    let query = SidebarItem.find(filter).sort({ order: 1, createdAt: -1 });
    if (!fetchAll) {
      query = query.limit(Number(limit));
    }
    const items = await query;
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllSidebarItems = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type) filter.type = type;
    const items = await SidebarItem.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSidebarItem = async (req, res) => {
  try {
    const { type, title, body, caption, mediaUrl, order, active } = req.body;
    if (!type || !title) {
      return res.status(400).json({ message: "Type and title are required" });
    }
    const normalizedMediaUrl = type === "video" ? normalizeYouTubeUrl(mediaUrl) : mediaUrl;
    const item = await SidebarItem.create({
      type,
      title,
      body: body || "",
      caption: caption || "",
      mediaUrl: normalizedMediaUrl || "",
      order: Number(order || 0),
      active: active !== undefined ? Boolean(active) : true,
    });
    res.status(201).json({ item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSidebarItem = async (req, res) => {
  try {
    const item = await SidebarItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
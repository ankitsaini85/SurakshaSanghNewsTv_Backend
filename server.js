// const path = require("path");
// const dotenv = require("dotenv");
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");

// // Load backend-local .env even when server is started from workspace root.
// dotenv.config({ path: path.join(__dirname, ".env") });
// dotenv.config();

// const authRoutes = require("./routes/authRoutes");
// const articleRoutes = require("./routes/articleRoutes");
// const tipRoutes = require("./routes/tipRoutes");
// const commentRoutes = require("./routes/commentRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const sidebarRoutes = require("./routes/sidebarRoutes");
// const uploadRoutes = require("./routes/uploadRoutes");
// const reporterRoutes = require("./routes/reporterRoutes");
// const settingsRoutes = require("./routes/settingsRoutes");

// connectDB();

// const app = express();

// app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// }
 
 
// ));
// app.use(express.json({ limit: "5mb" }));
// app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date() }));

// app.use("/api/auth", authRoutes);
// app.use("/api/articles", articleRoutes);
// app.use("/api/tips", tipRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/sidebar-items", sidebarRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api/reporters", reporterRoutes);
// app.use("/api/settings", settingsRoutes);

// app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// // eslint-disable-next-line no-unused-vars
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Server error", error: err.message });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`GlobalNews API running on port ${PORT}`));


const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Load backend-local .env
dotenv.config({
  path: path.join(__dirname, ".env"),
});

dotenv.config();

// Routes
const authRoutes = require("./routes/authRoutes");
const articleRoutes = require("./routes/articleRoutes");
const tipRoutes = require("./routes/tipRoutes");
const commentRoutes = require("./routes/commentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const sidebarRoutes = require("./routes/sidebarRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const reporterRoutes = require("./routes/reporterRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

// Connect Database
connectDB();

const app = express();

// ================================
// Middleware
// ================================

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================================
// API Routes
// ================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/tips", tipRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/sidebar-items", sidebarRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reporters", reporterRoutes);
app.use("/api/settings", settingsRoutes);

// ================================
// React Frontend
// ================================

// CHANGE THIS PATH ACCORDING TO YOUR HOSTINGER DOMAIN
const FRONTEND_PATH =
  "/home/u123456789/domains/yourdomain.com/public_html";

// Serve React static files
app.use(express.static(FRONTEND_PATH));

// React Router fallback
// API and uploads routes are excluded from frontend handling
app.use((req, res, next) => {
  const isFrontendRoute =
    req.method === "GET" &&
    !req.path.startsWith("/api") &&
    !req.path.startsWith("/uploads");

  if (isFrontendRoute) {
    return res.sendFile(
      path.join(FRONTEND_PATH, "index.html")
    );
  }

  next();
});

// ================================
// API 404 Handler
// ================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ================================
// Error Handler
// ================================

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : undefined,
  });
});

// ================================
// Start Server
// ================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`GlobalNews API running on port ${PORT}`);
});
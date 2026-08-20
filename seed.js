require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/User");
const Article = require("./models/Article");
const Tip = require("./models/Tip");
const SidebarItem = require("./models/SidebarItem");

const run = async () => {
  await connectDB();

  await User.deleteMany({});
  await Article.deleteMany({});
  await Tip.deleteMany({});
  await SidebarItem.deleteMany({});

  const admin = await User.create({
    name: "Alex Rivera",
    email: "admin@globalnews.com",
    password: "admin123",
    role: "admin",
    title: "Admin Editor",
    isVerified: true,
  });

  const reporter = await User.create({
    name: "Elena Vance",
    email: "reporter@globalnews.com",
    password: "reporter123",
    role: "reporter",
    title: "Senior Investigative Correspondent",
    bio: "Specializing in international politics and climate policy.",
    bureau: "London Bureau",
    yearsExperience: 12,
    isVerified: true,
    isBestPerformer: true,
    location: "London, UK",
  });

  const sampleArticles = [
    {
      title: "The Global Transition: How New Energy Policies Are Reshaping the Industrial Landscape",
      category: "Climate",
      excerpt: "Leaders from forty nations convene to finalize a historic treaty aimed at accelerating sustainable manufacturing.",
      content: "Leaders from forty nations convene to finalize a historic treaty aimed at accelerating the move toward sustainable manufacturing and carbon-neutral infrastructure.\n\nThe accord marks a turning point in how industrial economies plan for the next decade of energy production and consumption.",
      coverImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200",
      featured: true,
      isBreaking: true,
    },
    {
      title: "The Silent Shift: How Modern Diplomacy is Moving Beyond Traditional Borders",
      category: "Politics",
      excerpt: "Digital infrastructure now rivals physical geography in the new architecture of global statecraft.",
      content: "For centuries, the map of human power was drawn in ink on parchment. Today those lines are blurring as diplomacy migrates to the decentralized cloud.\n\n\"We are witnessing the death of distance in statecraft,\" says Dr. Aris Thorne of the Global Policy Institute.",
      coverImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200",
      featured: true,
    },
    {
      title: "The Silicon Singularity: How Custom Chips Are Changing the Generative AI Race Forever",
      category: "Tech",
      excerpt: "As global giants pull away from general-purpose GPUs, the architecture of the next decade's intelligence is being forged in bespoke hardware.",
      content: "In a world dominated by software, the real revolution is happening in the physical foundries.\n\nCustom silicon is becoming the deciding factor in the race for generative AI supremacy.",
      coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
      featured: true,
    },
    {
      title: "Central Banks Signal Shift in Interest Rate Trajectory Following Inflation Data",
      category: "Finance",
      excerpt: "New quarterly reports suggest a more hawkish stance as global markets brace for volatility.",
      content: "New quarterly reports suggest a more hawkish stance as global markets brace for volatility in the upcoming fiscal cycle.",
      coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200",
    },
    {
      title: "Breakthrough Vaccine Candidate Shows Promising Results in Clinical Trials",
      category: "Health",
      excerpt: "Researchers are cautiously optimistic about a new broad-spectrum antiviral.",
      content: "Researchers are cautiously optimistic about a new broad-spectrum antiviral that could mitigate future pandemic risks significantly.",
      coverImage: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=1200",
    },
    {
      title: "स्थानीय पुलिस ने सुरक्षा अभियान तेज़ किया",
      category: "सुरक्षा टीवी न्यूज़",
      excerpt: "रिपोर्टर द्वारा भेजी गई खबर, संपादकीय समीक्षा के बाद प्रकाशित।",
      content: "स्थानीय प्रशासन ने क्षेत्र में सुरक्षा व्यवस्था बढ़ा दी है। यह खबर एक फील्ड रिपोर्टर द्वारा भेजी गई और संपादक की मंजूरी के बाद प्रकाशित की गई।",
      coverImage: "https://images.unsplash.com/photo-1461151304423-40871e6a5e0f?w=1200",
      reporterName: "Elena Vance",
      location: "London, UK",
      featured: true,
      homeOrder: 1,
    },
  ];

  for (const a of sampleArticles) {
    await Article.create({
      ...a,
      slug: a.title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 80) + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      author: reporter._id,
      status: "approved",
      publishedAt: new Date(),
      readTimeMinutes: Math.floor(Math.random() * 10) + 4,
    });
  }

  await Tip.create([
    {
      title: "Mayor's budget meeting under review",
      category: "Politics",
      description: "Local sources say the draft budget includes major changes to transport funding.",
      status: "approved",
    },
    {
      title: "Factory expansion rumors in the north district",
      category: "Finance",
      description: "Workers claim the expansion plan could be announced before the end of the week.",
      status: "reviewing",
    },
  ]);

  await SidebarItem.create([
    {
      type: "video",
      title: "Global diplomacy briefing",
      mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      caption: "World Desk",
      order: 1,
    },
    {
      type: "video",
      title: "Markets update",
      mediaUrl: "https://www.youtube.com/embed/oHg5SJYRHA0",
      caption: "Finance Desk",
      order: 2,
    },
    {
      type: "review",
      title: "Editorial review",
      body: "Clear, direct analysis with strong sourcing and a tight narrative.",
      caption: "Senior Editor",
      mediaUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      order: 1,
    },
    {
      type: "reporter",
      title: "Elena Vance",
      body: "Investigative correspondent covering politics and climate policy.",
      caption: "Best performer reporter",
      mediaUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      order: 1,
    },
  ]);

  console.log("Seed complete.");
  console.log("Admin login: admin@globalnews.com / admin123");
  console.log("Reporter login: reporter@globalnews.com / reporter123");
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

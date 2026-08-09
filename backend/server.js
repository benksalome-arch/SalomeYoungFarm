const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// =====================================
// Static Uploads
// =====================================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// =====================================
// Routes
// =====================================

// Authentication
const authRoutes = require("./routes/authRoutes");

// Goat Module
const goatRoutes = require("./routes/goatsRoutes");
const healthRoutes = require("./routes/healthRoutes");
const weightRoutes = require("./routes/weightRoutes");
const breedingRoutes = require("./routes/breedingRoutes");
const kiddingRoutes = require("./routes/kiddingRoutes");

// Workers
const workersRoutes = require("./routes/workersRoutes");

// Finance
const financeRoutes = require("./routes/financeRoutes");

// Inventory
const inventoryRoutes = require("./routes/inventoryRoutes");

// Feed
const feedRoutes = require("./routes/feedRoutes");
const feedUsageRoutes = require("./routes/feedUsageRoutes");

// Chickens
const chickensRoutes = require("./routes/chickensRoutes");
const eggProductionRoutes = require("./routes/eggProductionRoutes");
const eggSalesRoutes = require("./routes/eggSalesRoutes");
const chickenMortalityRoutes = require("./routes/chickenMortalityRoutes");
const chickenVaccinationRoutes = require("./routes/chickenVaccinationRoutes");

// Rabbits
const rabbitsRoutes = require("./routes/rabbitsRoutes");
const rabbitHealthRoutes = require("./routes/rabbitHealthRoutes");
const rabbitVaccinationRoutes = require("./routes/rabbitVaccinationRoutes");
const rabbitMortalityRoutes = require("./routes/rabbitMortalityRoutes");
const rabbitBreedingRoutes = require("./routes/rabbitBreedingRoutes");
const rabbitLitterRoutes = require("./routes/rabbitLitterRoutes");

// Photos
const photoRoutes = require("./routes/photoRoutes");
const galleryRoutes = require("./routes/galleryRoutes");

// =====================================
// Home
// =====================================

app.get("/", (req, res) => {
  res.send("🐐 Salome Young Farm ERP Backend Running");
});

// =====================================
// API Routes
// =====================================

// Authentication
app.use("/api/auth", authRoutes);

// Goat Module
app.use("/api/goats", goatRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/weight", weightRoutes);
app.use("/api/breeding", breedingRoutes);
app.use("/api/kidding", kiddingRoutes);

// Workers
app.use("/api/workers", workersRoutes);

// Finance
app.use("/api/finance", financeRoutes);

// Inventory
app.use("/api/inventory", inventoryRoutes);

// Feed
app.use("/api/feed", feedRoutes);
app.use("/api/feed-usage", feedUsageRoutes);

// Chickens
app.use("/api/chickens", chickensRoutes);
app.use("/api/egg-production", eggProductionRoutes);
app.use("/api/egg-sales", eggSalesRoutes);
app.use("/api/chicken-mortality", chickenMortalityRoutes);
app.use("/api/chicken-vaccinations", chickenVaccinationRoutes);

// Rabbits
app.use("/api/rabbits", rabbitsRoutes);
app.use("/api/rabbit-health", rabbitHealthRoutes);
app.use("/api/rabbit-vaccinations", rabbitVaccinationRoutes);
app.use("/api/rabbit-mortality", rabbitMortalityRoutes);
app.use("/api/rabbit-breeding", rabbitBreedingRoutes);
app.use("/api/rabbit-litters", rabbitLitterRoutes);

// Photos
app.use("/api/photos", photoRoutes);
app.use("/api/gallery", galleryRoutes);

// =====================================
// Start Server
// =====================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
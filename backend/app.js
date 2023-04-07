import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import { authRoutes, adminRoutes, distributorRoutes, contractorRoutes } from "./src/services/index.js";
import bodyParser from "body-parser";
import seedData from "./src/config/adminMigration.js";

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));

import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
const swaggerJsDocs = YAML.load("./siteSwagger/api.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDocs));

// CORS Policy
app.use(cors());

// Database Connection
await seedData();
connectDB();

// JSON
app.use(express.json());

// Load Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin/", adminRoutes);
app.use("/api/distributor", distributorRoutes);
app.use("/api/contractor", contractorRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
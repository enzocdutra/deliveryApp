import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();
// Middlewares globais
app.use(express.json({ limit: "15mb" }));
app.use(cors());

// Rotas
app.get("/", (req, res) => {
  res.json({ ok: true, api: "Hamburgueria API", version: "1.0.0" });
});
app.use("/produtos", productRoutes);

app.use("/auth", authRoutes);
// Start
app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});

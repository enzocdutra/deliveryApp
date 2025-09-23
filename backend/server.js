import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares globais
app.use(express.json({ limit: "15mb" }));
app.use(cors());

// Rotas
app.get("/", (req, res) => {
  res.json({ ok: true, api: "Hamburgueria API", version: "1.0.0" });
});

app.use("/produtos", productRoutes);
app.use("/auth", authRoutes);

// ❌ NÃO usa app.listen no Vercel
export default app;

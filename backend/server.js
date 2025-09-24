import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import { setupDatabase } from './config/db.js';

dotenv.config();
setupDatabase();

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

// ⚡ Executa apenas localmente para desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server rodando na porta ${PORT}`);
  });
}

export default app;

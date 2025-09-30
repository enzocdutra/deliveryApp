import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import { setupDatabase } from './config/db.js';

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

// ⚡ AGUARDA O SETUP DO BANCO ANTES DE INICIAR O SERVIDOR
async function startServer() {
  try {
    await setupDatabase();
    console.log('✅ Banco de dados configurado com sucesso!');
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();

export default app;